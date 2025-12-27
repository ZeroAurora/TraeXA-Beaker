import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    source: v.optional(v.string()),
    isAIGenerated: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let documentsQuery;

    if (args.source) {
      documentsQuery = ctx.db.query("documents").withIndex("by_source", (q) =>
        q.eq("source", args.source!)
      );
    } else {
      documentsQuery = ctx.db.query("documents");
    }

    if (args.isAIGenerated !== undefined) {
      documentsQuery = documentsQuery.filter((q) =>
        q.eq(q.field("isAIGenerated"), args.isAIGenerated!)
      );
    }

    const documents = await documentsQuery
      .order("desc")
      .take(args.limit ?? 50);

    return documents;
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const search = query({
  args: {
    searchQuery: v.string(),
    limit: v.optional(v.number()),
    source: v.optional(v.string()),
    isAIGenerated: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const searchResults = await ctx.db
      .query("documents")
      .withSearchIndex("search_content", (q) =>
        q.search("content", args.searchQuery)
      )
      .take(args.limit ?? 20);

    return searchResults;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    url: v.optional(v.string()),
    source: v.string(),
    isAIGenerated: v.boolean(),
    tags: v.array(v.string()),
    summary: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.any())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const documentId = await ctx.db.insert("documents", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return documentId;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    url: v.optional(v.string()),
    source: v.optional(v.string()),
    isAIGenerated: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    summary: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.any())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const document = await ctx.db.get(id);
    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const crawlUrl = action({
  args: {
    url: v.string(),
    title: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<any> => {
    const jinaReaderUrl = `https://r.jina.ai/${args.url}`;

    const response = await fetch(jinaReaderUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Beaker/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const content = await response.text();

    const lines = content.split("\n");
    const extractedTitle = args.title || lines[0] || "Untitled Document";
    const bodyContent = lines.slice(1).join("\n").trim();

    const documentId = await ctx.runMutation((internal as any).documents.create, {
      title: extractedTitle,
      content: bodyContent,
      url: args.url,
      source: "jina",
      isAIGenerated: false,
      tags: args.tags || [],
      summary: bodyContent.substring(0, 200) + "...",
      metadata: {
        extractedAt: new Date().toISOString(),
        wordCount: bodyContent.split(/\s+/).length,
      },
    });

    return documentId;
  },
});

export const getByTags = query({
  args: {
    tags: v.array(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allDocuments = await ctx.db
      .query("documents")
      .withIndex("by_tags")
      .take(args.limit ?? 50);

    const documents = allDocuments.filter((doc) =>
      args.tags.some((tag) => doc.tags.includes(tag))
    );

    return documents;
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allDocuments = await ctx.db.query("documents").collect();
    const total = allDocuments.length;
    const aiGenerated = allDocuments.filter((d) => d.isAIGenerated).length;
    const bySource = allDocuments.reduce((acc, doc) => {
      acc[doc.source] = (acc[doc.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      aiGenerated,
      bySource,
    };
  },
});
