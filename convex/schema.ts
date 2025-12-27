import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    url: v.optional(v.string()),
    source: v.string(),
    isAIGenerated: v.boolean(),
    tags: v.array(v.string()),
    summary: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.any())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_source", ["source"])
    .index("by_tags", ["tags"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["source", "isAIGenerated"],
    }),

  subscriptions: defineTable({
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    lastSync: v.optional(v.number()),
    articleCount: v.number(),
    syncInterval: v.optional(v.number()),
    keywords: v.optional(v.array(v.string())),
    autoImport: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_last_sync", ["lastSync"])
    .index("by_created_at", ["createdAt"]),

  chats: defineTable({
    title: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_updated_at", ["updatedAt"]),

  messages: defineTable({
    chatId: v.id("chats"),
    role: v.string(),
    content: v.string(),
    references: v.array(v.id("documents")),
    createdAt: v.number(),
  })
    .index("by_chat_id", ["chatId"])
    .index("by_created_at", ["createdAt"]),

  remixTasks: defineTable({
    title: v.optional(v.string()),
    sourceDocumentIds: v.array(v.id("documents")),
    prompt: v.string(),
    status: v.string(),
    progress: v.number(),
    logs: v.array(
      v.object({
        timestamp: v.number(),
        message: v.string(),
      })
    ),
    generatedContent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"])
    .index("by_source_docs", ["sourceDocumentIds"]),

  vibeRecommendations: defineTable({
    documentId: v.id("documents"),
    fragment: v.string(),
    relevanceScore: v.number(),
    context: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_document_id", ["documentId"])
    .index("by_relevance", ["relevanceScore"])
    .index("by_created_at", ["createdAt"]),
});
