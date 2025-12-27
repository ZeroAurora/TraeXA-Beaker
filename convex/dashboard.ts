import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const documents = await ctx.db.query("documents").collect();
    const subscriptions = await ctx.db.query("subscriptions").collect();
    const chats = await ctx.db.query("chats").collect();
    const messages = await ctx.db.query("messages").collect();
    const remixTasks = await ctx.db.query("remixTasks").collect();

    const totalDocuments = documents.length;
    const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length;
    const totalChats = chats.length;
    const remixCount = remixTasks.filter((t) => t.status === "complete").length;

    const aiGeneratedDocs = documents.filter((d) => d.isAIGenerated).length;
    const bySource = documents.reduce((acc, doc) => {
      acc[doc.source] = (acc[doc.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentDocuments = documents
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

    const recentChats = chats
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);

    const recentActivities = [];

    for (const doc of recentDocuments.slice(0, 5)) {
      recentActivities.push({
        type: doc.isAIGenerated ? "remix" : "crawl",
        title: doc.isAIGenerated ? `生成文档：${doc.title}` : `抓取文章：${doc.title}`,
        timestamp: doc.createdAt,
      });
    }

    for (const chat of recentChats) {
      const chatMessages = messages.filter((m) => m.chatId === chat._id);
      if (chatMessages.length > 0) {
        const lastMessage = chatMessages[chatMessages.length - 1];
        recentActivities.push({
          type: "chat",
          title: `聊天：${lastMessage.content.substring(0, 30)}...`,
          timestamp: chat.updatedAt,
        });
      }
    }

    recentActivities.sort((a, b) => b.timestamp - a.timestamp);

    return {
      totalDocuments,
      activeSubscriptions,
      totalChats,
      remixCount,
      aiGeneratedDocs,
      bySource,
      recentActivities: recentActivities.slice(0, 10),
    };
  },
});

export const getRecentActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const recentDocuments = await ctx.db
      .query("documents")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);

    const recentRemixTasks = await ctx.db
      .query("remixTasks")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);

    const recentChats = await ctx.db
      .query("chats")
      .withIndex("by_updated_at")
      .order("desc")
      .take(limit);

    const activities = [];

    for (const doc of recentDocuments) {
      activities.push({
        id: doc._id,
        type: doc.isAIGenerated ? "remix" : "crawl",
        title: doc.isAIGenerated ? `生成文档：${doc.title}` : `抓取文章：${doc.title}`,
        timestamp: doc.createdAt,
      });
    }

    for (const task of recentRemixTasks) {
      activities.push({
        id: task._id,
        type: "remix",
        title: `知识重组：${task.title || "未命名任务"}`,
        timestamp: task.createdAt,
      });
    }

    for (const chat of recentChats) {
      activities.push({
        id: chat._id,
        type: "chat",
        title: `聊天：${chat.title || "新对话"}`,
        timestamp: chat.updatedAt,
      });
    }

    activities.sort((a, b) => b.timestamp - a.timestamp);

    return activities.slice(0, limit);
  },
});
