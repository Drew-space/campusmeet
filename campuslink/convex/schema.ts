import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  waitingPool: defineTable({
    userId: v.string(),
    clerkId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()), // add this
    location: v.string(),
    joinedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_location", ["location"]),

  pendingMatches: defineTable({
    userAId: v.string(),
    userAName: v.string(),
    userAImageUrl: v.optional(v.string()),
    userBId: v.string(),
    userBName: v.string(),
    userBImageUrl: v.optional(v.string()),
    streamCallId: v.string(),
    userAAccepted: v.boolean(),
    userBAccepted: v.boolean(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("declined"),
    ),
    expiresAt: v.number(),
  })
    .index("by_userA", ["userAId"])
    .index("by_userB", ["userBId"]),

  // pendingMatches: defineTable({
  //   userAId: v.string(),
  //   userAName: v.string(),
  //   userBId: v.string(),
  //   userBName: v.string(),
  //   streamCallId: v.string(),
  //   userAAccepted: v.boolean(),
  //   userBAccepted: v.boolean(),
  //   status: v.union(
  //     v.literal("pending"),
  //     v.literal("accepted"),
  //     v.literal("declined"),
  //   ),
  //   expiresAt: v.number(),
  // })
  //   .index("by_userA", ["userAId"])
  //   .index("by_userB", ["userBId"]),

  sessions: defineTable({
    userAId: v.string(),
    userBId: v.string(),
    streamCallId: v.string(),
    status: v.union(v.literal("active"), v.literal("ended")),
    createdAt: v.number(),
  })
    .index("by_userA", ["userAId"])
    .index("by_userB", ["userBId"]),
});
