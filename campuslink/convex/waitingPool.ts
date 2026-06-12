import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const join = mutation({
  args: {
    userId: v.string(),
    clerkId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("waitingPool")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("waitingPool", {
      userId: args.userId,
      clerkId: args.clerkId,
      name: args.name,
      imageUrl: args.imageUrl,
      location: args.location,
      joinedAt: Date.now(),
    });
  },
});

export const leave = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("waitingPool")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (entry) await ctx.db.delete(entry._id);
  },
});

export const findMatch = mutation({
  args: {
    userId: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    let candidates;

    if (args.location === "all") {
      candidates = await ctx.db.query("waitingPool").collect();
    } else {
      const exactMatches = await ctx.db
        .query("waitingPool")
        .withIndex("by_location", (q) => q.eq("location", args.location))
        .collect();

      const globalMatches = await ctx.db
        .query("waitingPool")
        .withIndex("by_location", (q) => q.eq("location", "all"))
        .collect();

      candidates = [...exactMatches, ...globalMatches];
    }

    const match = candidates.find((c) => c.userId !== args.userId);
    return match ?? null;
  },
});

export const getOnlineCount = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("waitingPool").collect();
    return all.length;
  },
});
