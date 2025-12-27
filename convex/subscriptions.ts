import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let subscriptionsQuery;

    if (args.status) {
      subscriptionsQuery = ctx.db.query("subscriptions").withIndex("by_status", (q) =>
        q.eq("status", args.status!)
      );
    } else {
      subscriptionsQuery = ctx.db.query("subscriptions");
    }

    const subscriptions = await subscriptionsQuery
      .order("desc")
      .take(args.limit ?? 50);

    return subscriptions;
  },
});

export const get = query({
  args: { id: v.id("subscriptions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    syncInterval: v.optional(v.number()),
    keywords: v.optional(v.array(v.string())),
    autoImport: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const subscriptionId = await ctx.db.insert("subscriptions", {
      ...args,
      status: args.status ?? "active",
      articleCount: 0,
      autoImport: args.autoImport ?? true,
      createdAt: now,
      updatedAt: now,
    });
    return subscriptionId;
  },
});

export const update = mutation({
  args: {
    id: v.id("subscriptions"),
    name: v.optional(v.string()),
    url: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    syncInterval: v.optional(v.number()),
    keywords: v.optional(v.array(v.string())),
    autoImport: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const subscription = await ctx.db.get(id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("subscriptions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const sync = action({
  args: { id: v.id("subscriptions") },
  handler: async (ctx, args): Promise<{
    importedCount: number;
    totalItems: number;
  }> => {
    const subscription = await ctx.runQuery((internal as any).subscriptions.get, { id: args.id });
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const response = await fetch(subscription.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const rssContent = await response.text();
    const items = parseRSS(rssContent);

    let importedCount = 0;
    for (const item of items) {
      if (subscription.autoImport) {
        try {
          await ctx.runMutation((internal as any).documents.create, {
            title: item.title,
            content: item.content,
            url: item.link,
            source: "rss",
            isAIGenerated: false,
            tags: subscription.keywords || [],
            summary: item.description,
            metadata: {
              subscriptionId: args.id,
              publishedAt: item.pubDate,
            },
          });
          importedCount++;
        } catch (error) {
          console.error(`Failed to import article: ${item.title}`, error);
        }
      }
    }

    await ctx.runMutation((internal as any).subscriptions.update, {
      id: args.id,
      lastSync: Date.now(),
    });

    return {
      importedCount,
      totalItems: items.length,
    };
  },
});

export const syncAll = action({
  args: {},
  handler: async (ctx): Promise<Array<{
    subscriptionId: any;
    name: string;
    success: boolean;
    importedCount?: number;
    totalItems?: number;
    error?: string;
  }>> => {
    const subscriptions = await ctx.runQuery((internal as any).subscriptions.list, {
      status: "active",
    });

    const results: Array<{
      subscriptionId: any;
      name: string;
      success: boolean;
      importedCount?: number;
      totalItems?: number;
      error?: string;
    }> = [];

    for (const subscription of subscriptions) {
      try {
        const result = await ctx.runAction((internal as any).subscriptions.sync, {
          id: subscription._id,
        });
        results.push({
          subscriptionId: subscription._id,
          name: subscription.name,
          success: true,
          ...result,
        });
      } catch (error) {
        results.push({
          subscriptionId: subscription._id,
          name: subscription.name,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return results;
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allSubscriptions = await ctx.db.query("subscriptions").collect();
    const active = allSubscriptions.filter((s) => s.status === "active").length;
    const totalArticles = allSubscriptions.reduce((sum, s) => sum + s.articleCount, 0);

    return {
      total: allSubscriptions.length,
      active,
      totalArticles,
    };
  },
});

interface RSSItem {
  title: string;
  link: string;
  description: string;
  content: string;
  pubDate: string;
}

function parseRSS(rssContent: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemPattern = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemPattern.exec(rssContent)) !== null) {
    const itemContent = match[1];
    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
    const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
    const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/);
    const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);

    if (titleMatch && linkMatch) {
      items.push({
        title: titleMatch[1],
        link: linkMatch[1],
        description: descMatch ? descMatch[1] : "",
        content: descMatch ? descMatch[1] : "",
        pubDate: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
      });
    }
  }

  return items;
}
