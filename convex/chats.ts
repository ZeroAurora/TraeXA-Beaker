import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_created_at")
      .order("desc")
      .take(args.limit ?? 50);

    return chats;
  },
});

export const get = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const chatId = await ctx.db.insert("chats", {
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });
    return chatId;
  },
});

export const update = mutation({
  args: {
    id: v.id("chats"),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const chat = await ctx.db.get(id);
    if (!chat) {
      throw new Error("Chat not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat_id")
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const getMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();

    return messages;
  },
});

export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    role: v.string(),
    content: v.string(),
    references: v.array(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const messageId = await ctx.db.insert("messages", {
      ...args,
      createdAt: now,
    });

    await ctx.db.patch(args.chatId, {
      updatedAt: now,
    });

    return messageId;
  },
});

export const chatWithKnowledge = action({
  args: {
    chatId: v.id("chats"),
    message: v.string(),
    searchSources: v.optional(v.array(v.string())),
    includeAIGenerated: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<{
    messageId: any;
    references: any[];
    searchResults: Doc<"documents">[];
  }> => {
    await ctx.runMutation((internal as any).chats.sendMessage, {
      chatId: args.chatId,
      role: "user",
      content: args.message,
      references: [],
    });

    const searchResults = await ctx.runQuery((internal as any).documents.search, {
      searchQuery: args.message,
      limit: 5,
    }) as Doc<"documents">[];

    const relevantDocs = searchResults.filter((doc) => {
      if (args.searchSources && !args.searchSources.includes(doc.source)) {
        return false;
      }
      if (args.includeAIGenerated === false && doc.isAIGenerated) {
        return false;
      }
      return true;
    });

    const context = relevantDocs
      .map((doc) => `Document: ${doc.title}\n${doc.content.substring(0, 500)}...`)
      .join("\n\n");

    const assistantMessage = `Based on knowledge base search, I found ${relevantDocs.length} relevant documents.\n\n${context}`;

    const messageId = await ctx.runMutation((internal as any).chats.sendMessage, {
      chatId: args.chatId,
      role: "assistant",
      content: assistantMessage,
      references: relevantDocs.map((doc) => doc._id),
    });

    return {
      messageId,
      references: relevantDocs.map((doc) => doc._id),
      searchResults: relevantDocs,
    };
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allChats = await ctx.db.query("chats").collect();
    const allMessages = await ctx.db.query("messages").collect();

    return {
      totalChats: allChats.length,
      totalMessages: allMessages.length,
      avgMessagesPerChat: allChats.length > 0
        ? allMessages.length / allChats.length
        : 0,
    };
  },
});
