// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// export const create = mutation({
//   args: {
//     userAId: v.string(),
//     userBId: v.string(),
//     streamCallId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.insert("sessions", {
//       userAId: args.userAId,
//       userBId: args.userBId,
//       streamCallId: args.streamCallId,
//       status: "active",
//       createdAt: Date.now(),
//     });
//   },
// });

// export const getMySession = query({
//   args: { userId: v.string() },
//   handler: async (ctx, args) => {
//     const asA = await ctx.db
//       .query("sessions")
//       .withIndex("by_userA", (q) => q.eq("userAId", args.userId))
//       .filter((q) => q.eq(q.field("status"), "active"))
//       .unique();

//     if (asA) return asA;

//     const asB = await ctx.db
//       .query("sessions")
//       .withIndex("by_userB", (q) => q.eq("userBId", args.userId))
//       .filter((q) => q.eq(q.field("status"), "active"))
//       .unique();

//     return asB ?? null;
//   },
// });

// export const end = mutation({
//   args: { sessionId: v.id("sessions") },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.sessionId, { status: "ended" });
//   },
// });

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userAId: v.string(),
    userBId: v.string(),
    streamCallId: v.string(),
  },
  handler: async (ctx, args) => {
    const endExisting = async (userId: string) => {
      const asA = await ctx.db
        .query("sessions")
        .withIndex("by_userA", (q) => q.eq("userAId", userId))
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect();
      const asB = await ctx.db
        .query("sessions")
        .withIndex("by_userB", (q) => q.eq("userBId", userId))
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect();
      for (const s of [...asA, ...asB]) {
        await ctx.db.patch(s._id, { status: "ended" });
      }
    };

    await endExisting(args.userAId);
    await endExisting(args.userBId);

    return await ctx.db.insert("sessions", {
      userAId: args.userAId,
      userBId: args.userBId,
      streamCallId: args.streamCallId,
      status: "active",
      createdAt: Date.now(),
    });
  },
});

export const getMySession = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const asA = await ctx.db
      .query("sessions")
      .withIndex("by_userA", (q) => q.eq("userAId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    if (asA.length > 0) return asA[0];

    const asB = await ctx.db
      .query("sessions")
      .withIndex("by_userB", (q) => q.eq("userBId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    return asB.length > 0 ? asB[0] : null;
  },
});

export const end = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { status: "ended" });
  },
});

export const endAllActive = mutation({
  handler: async (ctx) => {
    const all = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    for (const s of all) {
      await ctx.db.patch(s._id, { status: "ended" });
    }
    return `Ended ${all.length} sessions`;
  },
});

export const clearOnMount = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // End all active sessions for this user
    const asA = await ctx.db
      .query("sessions")
      .withIndex("by_userA", (q) => q.eq("userAId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    const asB = await ctx.db
      .query("sessions")
      .withIndex("by_userB", (q) => q.eq("userBId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    for (const s of [...asA, ...asB]) {
      await ctx.db.patch(s._id, { status: "ended" });
    }

    // Also clear any pending matches
    const pendingAsA = await ctx.db
      .query("pendingMatches")
      .withIndex("by_userA", (q) => q.eq("userAId", args.userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "accepted"),
        ),
      )
      .collect();
    const pendingAsB = await ctx.db
      .query("pendingMatches")
      .withIndex("by_userB", (q) => q.eq("userBId", args.userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "accepted"),
        ),
      )
      .collect();
    for (const m of [...pendingAsA, ...pendingAsB]) {
      await ctx.db.patch(m._id, { status: "declined" });
    }
  },
});
