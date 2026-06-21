import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userAId: v.string(),
    userAName: v.string(),
    userAImageUrl: v.optional(v.string()),
    userBId: v.string(),
    userBName: v.string(),
    userBImageUrl: v.optional(v.string()),
    streamCallId: v.string(),
  },
  handler: async (ctx, args) => {
    for (const userId of [args.userAId, args.userBId]) {
      const asA = await ctx.db
        .query("pendingMatches")
        .withIndex("by_userA", (q) => q.eq("userAId", userId))
        .filter((q) => q.eq(q.field("status"), "pending"))
        .collect();
      const asB = await ctx.db
        .query("pendingMatches")
        .withIndex("by_userB", (q) => q.eq("userBId", userId))
        .filter((q) => q.eq(q.field("status"), "pending"))
        .collect();
      for (const m of [...asA, ...asB]) {
        await ctx.db.patch(m._id, { status: "declined" });
      }
    }

    return await ctx.db.insert("pendingMatches", {
      userAId: args.userAId,
      userAName: args.userAName,
      userAImageUrl: args.userAImageUrl,
      userBId: args.userBId,
      userBName: args.userBName,
      userBImageUrl: args.userBImageUrl,
      streamCallId: args.streamCallId,
      userAAccepted: false,
      userBAccepted: false,
      status: "pending",
      expiresAt: Date.now() + 15000,
    });
  },
});

export const getMyPendingMatch = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const asA = await ctx.db
      .query("pendingMatches")
      .withIndex("by_userA", (q) => q.eq("userAId", args.userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "accepted"),
        ),
      )
      .collect();
    if (asA.length > 0) return asA[0];

    const asB = await ctx.db
      .query("pendingMatches")
      .withIndex("by_userB", (q) => q.eq("userBId", args.userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "accepted"),
        ),
      )
      .collect();
    return asB.length > 0 ? asB[0] : null;
  },
});

export const cleanup = mutation({
  args: { matchId: v.id("pendingMatches") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.matchId, { status: "declined" });
  },
});

export const respond = mutation({
  args: {
    matchId: v.id("pendingMatches"),
    userId: v.string(),
    accepted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match || match.status !== "pending") return null;

    if (!args.accepted) {
      await ctx.db.patch(args.matchId, { status: "declined" });
      return { status: "declined" };
    }

    const isA = match.userAId === args.userId;
    const newUserAAccepted = isA ? true : match.userAAccepted;
    const newUserBAccepted = isA ? match.userBAccepted : true;

    if (newUserAAccepted && newUserBAccepted) {
      await ctx.db.patch(args.matchId, {
        userAAccepted: true,
        userBAccepted: true,
        status: "accepted",
      });
      return { status: "accepted", streamCallId: match.streamCallId };
    }

    await ctx.db.patch(args.matchId, {
      ...(isA ? { userAAccepted: true } : { userBAccepted: true }),
    });
    return { status: "waiting" };
  },
});
