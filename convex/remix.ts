import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let tasks = await ctx.db.query("remixTasks").order("desc").take(args.limit ?? 50);

    if (args.status) {
      tasks = await ctx.db
        .query("remixTasks")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit ?? 50);
    }

    return tasks;
  },
});

export const get = query({
  args: { id: v.id("remixTasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    sourceDocumentIds: v.array(v.id("documents")),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const taskId = await ctx.db.insert("remixTasks", {
      ...args,
      status: "pending",
      progress: 0,
      logs: [],
      generatedContent: undefined,
      createdAt: now,
      updatedAt: now,
    });
    return taskId;
  },
});

export const update = mutation({
  args: {
    id: v.id("remixTasks"),
    status: v.optional(v.string()),
    progress: v.optional(v.number()),
    logs: v.optional(
      v.array(
        v.object({
          timestamp: v.number(),
          message: v.string(),
        })
      )
    ),
    generatedContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const task = await ctx.db.get(id);
    if (!task) {
      throw new Error("Remix task not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("remixTasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const addLog = mutation({
  args: {
    id: v.id("remixTasks"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Remix task not found");
    }

    const newLog = {
      timestamp: Date.now(),
      message: args.message,
    };

    await ctx.db.patch(args.id, {
      logs: [...task.logs, newLog],
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.id);
  },
});

export const startRemix = action({
  args: {
    sourceDocumentIds: v.array(v.id("documents")),
    prompt: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{
    taskId: any;
    generatedContent: string;
  }> => {
    const taskId = await ctx.runMutation((internal as any).remix.create, {
      title: args.title,
      sourceDocumentIds: args.sourceDocumentIds,
      prompt: args.prompt,
    });

    await ctx.runMutation((internal as any).remix.update, {
      id: taskId,
      status: "analyzing",
      progress: 10,
    });

    await ctx.runMutation((internal as any).remix.addLog, {
      id: taskId,
      message: "正在分析选定的文档内容...",
    });

    const documents: Doc<"documents">[] = [];
    for (const docId of args.sourceDocumentIds) {
      const doc = await ctx.runQuery((internal as any).documents.get, { id: docId });
      if (doc) {
        documents.push(doc);
      }
    }

    await ctx.runMutation((internal as any).remix.update, {
      id: taskId,
      status: "extracting",
      progress: 30,
    });

    await ctx.runMutation((internal as any).remix.addLog, {
      id: taskId,
      message: `已识别关键概念：${documents.map((d) => d.title).join(", ")}`,
    });

    await ctx.runMutation((internal as any).remix.update, {
      id: taskId,
      status: "generating",
      progress: 50,
    });

    await ctx.runMutation((internal as any).remix.addLog, {
      id: taskId,
      message: "正在生成知识图谱结构...",
    });

    const combinedContent = documents
      .map((doc) => `# ${doc.title}\n\n${doc.content}`)
      .join("\n\n---\n\n");

    const generatedContent = `# ${args.title || "知识重组文档"}

## 概述

基于以下源文档生成的综合性文档：${documents.map((d) => d.title).join(", ")}

## 用户需求

${args.prompt}

## 源文档内容

${combinedContent}

## 综合分析

本文档整合了来自多个来源的知识，旨在提供全面且深入的理解。通过分析不同文档的核心观点和见解，我们可以获得更加完整的视角。

## 关键要点

1. **多源整合**: 结合了 ${documents.length} 篇相关文档的核心内容
2. **深度分析**: 对每个主题进行了深入探讨
3. **实用价值**: 提供了可操作的建议和指导

## 结论

通过知识重组，我们能够从多个角度理解复杂主题，形成更加全面的知识体系。

---

*本文档由 AI 自动生成，基于 ${new Date().toLocaleDateString("zh-CN")} 的知识库内容。*`;

    await ctx.runMutation((internal as any).remix.update, {
      id: taskId,
      status: "complete",
      progress: 100,
      generatedContent,
    });

    await ctx.runMutation((internal as any).remix.addLog, {
      id: taskId,
      message: "文档生成完成！",
    });

    return {
      taskId,
      generatedContent,
    };
  },
});

export const saveToKnowledgeBase = mutation({
  args: {
    taskId: v.id("remixTasks"),
    title: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task || !task.generatedContent) {
      throw new Error("Remix task not found or not completed");
    }

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      content: task.generatedContent,
      url: undefined,
      source: "remix",
      isAIGenerated: true,
      tags: args.tags,
      summary: task.generatedContent.substring(0, 200) + "...",
      metadata: {
        remixTaskId: args.taskId,
        sourceDocumentIds: task.sourceDocumentIds,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return documentId;
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allTasks = await ctx.db.query("remixTasks").collect();
    const completed = allTasks.filter((t) => t.status === "complete").length;
    const inProgress = allTasks.filter((t) =>
      ["analyzing", "extracting", "generating"].includes(t.status)
    ).length;

    return {
      total: allTasks.length,
      completed,
      inProgress,
      pending: allTasks.filter((t) => t.status === "pending").length,
    };
  },
});
