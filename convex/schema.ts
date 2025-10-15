import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    pic: v.string(),
    uid: v.string()
  }),
  workspaces: defineTable({
    message: v.array(v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number()
    })),
    fileData: v.optional(v.any()),
    user: v.id("users"),
    title: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
})
