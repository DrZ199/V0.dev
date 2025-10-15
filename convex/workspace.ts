import { v } from 'convex/values';
import { mutation, query } from "./_generated/server";

export const CreateWorkSpace = mutation({
  args: {
    message: v.array(v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number()
    })),
    user: v.id("users"),
    title: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db.get(args.user);
      if (!user) {
        throw new Error("User not found");
      }
      const now = Date.now();
      const workSpaceId = await ctx.db.insert("workspaces", {
        message: args.message,
        user: args.user,
        title: args.title || "Untitled Workspace",
        createdAt: now,
        updatedAt: now
      });

      return workSpaceId;
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw new Error("Failed to create workspace");
    }
  }
})

export const GetUserWorkSpace = query({
  args: {
    workspaceId: v.id('workspaces')
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.workspaceId);
    return result;
  }
})

export const UpdateMessages = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    message: v.array(v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number()
    }))
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const result = await ctx.db.patch(args.workspaceId, { 
      message: args.message,
      updatedAt: now
    })
    return result;
  }
})

export const UpdateFiles = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    fileData: v.any()
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspaceId, { fileData: args.fileData })
    return result;
  }
})

export const GetAllUserWorkspaces = query({
  args: {
    userId: v.id('users')
  },
  handler: async (ctx, args) => {
    const workspaces = await ctx.db.query('workspaces')
      .filter((q) => q.eq(q.field('user'), args.userId))
      .order('desc')
      .collect();
    return workspaces;
  }
})

export const DeleteWorkspace = mutation({
  args: {
    workspaceId: v.id('workspaces')
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.workspaceId);
    return { success: true };
  }
})
