import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  waitingPool: defineTable({
    userId: v.string(),
    clerkId: v.string(),
    name: v.string(),
    location: v.string(),
    joinedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_location", ["location"]),

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
