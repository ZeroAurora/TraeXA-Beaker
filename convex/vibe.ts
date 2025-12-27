import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

export const list = query({
  args: {
    documentId: v.optional(v.id("documents")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let recommendations = await ctx.db
      .query("vibeRecommendations")
      .order("desc")
      .take(args.limit ?? 20);

    if (args.documentId) {
      recommendations = await ctx.db
        .query("vibeRecommendations")
        .withIndex("by_document_id", (q) => q.eq("documentId", args.documentId!))
        .order("desc")
        .take(args.limit ?? 20);
    }

    return recommendations;
  },
});

export const get = query({
  args: { id: v.id("vibeRecommendations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    documentId: v.id("documents"),
    fragment: v.string(),
    relevanceScore: v.number(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const recommendationId = await ctx.db.insert("vibeRecommendations", {
      ...args,
      createdAt: now,
    });
    return recommendationId;
  },
});

export const remove = mutation({
  args: { id: v.id("vibeRecommendations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getRecommendations = query({
  args: {
    inputText: v.string(),
    limit: v.optional(v.number()),
    excludeDocumentIds: v.optional(v.array(v.id("documents"))),
  },
  handler: async (ctx, args) => {
    const searchResults = await ctx.db
      .query("documents")
      .withSearchIndex("search_content", (q) =>
        q.search("content", args.inputText)
      )
      .take(args.limit ?? 10);

    const filteredResults = args.excludeDocumentIds
      ? searchResults.filter((doc) => !args.excludeDocumentIds!.includes(doc._id))
      : searchResults;

    const recommendations = [];
    for (const doc of filteredResults) {
      const fragment = extractRelevantFragment(doc.content, args.inputText);
      const relevanceScore = calculateRelevanceScore(doc.content, args.inputText);

      recommendations.push({
        documentId: doc._id,
        document: doc,
        fragment,
        relevanceScore,
      });
    }

    recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return recommendations.slice(0, args.limit ?? 10);
  },
});

export const generateRecommendations = action({
  args: {
    inputText: v.string(),
    limit: v.optional(v.number()),
    excludeDocumentIds: v.optional(v.array(v.id("documents"))),
  },
  handler: async (ctx, args): Promise<Array<{
    id: any;
    documentId: any;
    document: Doc<"documents">;
    fragment: string;
    relevanceScore: number;
    context?: string;
  }>> => {
    const recommendations = await ctx.runQuery((internal as any).vibe.getRecommendations, {
      inputText: args.inputText,
      limit: args.limit,
      excludeDocumentIds: args.excludeDocumentIds,
    });

    const savedRecommendations: Array<{
      id: any;
      documentId: any;
      document: Doc<"documents">;
      fragment: string;
      relevanceScore: number;
      context?: string;
    }> = [];
    for (const rec of recommendations) {
      const recommendationId = await ctx.runMutation((internal as any).vibe.create, {
        documentId: rec.documentId,
        fragment: rec.fragment,
        relevanceScore: rec.relevanceScore,
        context: args.inputText,
      });

      savedRecommendations.push({
        id: recommendationId,
        ...rec,
      });
    }

    return savedRecommendations;
  },
});

export const clearOldRecommendations = mutation({
  args: {
    olderThan: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoff = args.olderThan ?? Date.now() - 24 * 60 * 60 * 1000;
    const oldRecommendations = await ctx.db
      .query("vibeRecommendations")
      .withIndex("by_created_at")
      .collect();

    let deletedCount = 0;
    for (const rec of oldRecommendations) {
      if (rec.createdAt < cutoff) {
        await ctx.db.delete(rec._id);
        deletedCount++;
      }
    }

    return deletedCount;
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allRecommendations = await ctx.db
      .query("vibeRecommendations")
      .collect();

    const avgRelevance =
      allRecommendations.length > 0
        ? allRecommendations.reduce((sum, r) => sum + r.relevanceScore, 0) /
          allRecommendations.length
        : 0;

    const byDocument = allRecommendations.reduce((acc, rec) => {
      const docId = rec.documentId;
      acc[docId] = (acc[docId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: allRecommendations.length,
      avgRelevance,
      uniqueDocuments: Object.keys(byDocument).length,
      byDocument,
    };
  },
});

function extractRelevantFragment(content: string, query: string): string {
  const queryLower = query.toLowerCase();
  const contentLower = content.toLowerCase();

  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);
  if (queryWords.length === 0) {
    return content.substring(0, 200) + "...";
  }

  let bestMatchIndex = -1;
  let bestMatchScore = 0;

  for (let i = 0; i < contentLower.length - 100; i++) {
    const fragment = contentLower.substring(i, i + 300);
    let score = 0;
    for (const word of queryWords) {
      if (fragment.includes(word)) {
        score++;
      }
    }
    if (score > bestMatchScore) {
      bestMatchScore = score;
      bestMatchIndex = i;
    }
  }

  if (bestMatchIndex >= 0) {
    const start = Math.max(0, bestMatchIndex - 50);
    const end = Math.min(content.length, bestMatchIndex + 350);
    return content.substring(start, end) + "...";
  }

  return content.substring(0, 200) + "...";
}

function calculateRelevanceScore(content: string, query: string): number {
  const queryLower = query.toLowerCase();
  const contentLower = content.toLowerCase();

  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);
  if (queryWords.length === 0) {
    return 0.5;
  }

  let matchCount = 0;
  for (const word of queryWords) {
    if (contentLower.includes(word)) {
      matchCount++;
    }
  }

  const baseScore = matchCount / queryWords.length;

  const exactPhraseMatch = contentLower.includes(queryLower);
  const phraseBonus = exactPhraseMatch ? 0.3 : 0;

  const proximityBonus = calculateProximityBonus(contentLower, queryWords);

  return Math.min(1, baseScore + phraseBonus + proximityBonus);
}

function calculateProximityBonus(content: string, queryWords: string[]): number {
  if (queryWords.length < 2) {
    return 0;
  }

  let totalDistance = 0;
  let pairCount = 0;

  for (let i = 0; i < queryWords.length - 1; i++) {
    const pos1 = content.indexOf(queryWords[i]);
    const pos2 = content.indexOf(queryWords[i + 1]);

    if (pos1 >= 0 && pos2 >= 0) {
      const distance = Math.abs(pos2 - pos1);
      totalDistance += distance;
      pairCount++;
    }
  }

  if (pairCount === 0) {
    return 0;
  }

  const avgDistance = totalDistance / pairCount;
  const maxDistance = 500;

  return Math.max(0, 1 - avgDistance / maxDistance) * 0.2;
}
