import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createPrompt = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    persona: v.string(),
    goldenRule: v.string(),
    processSteps: v.array(v.string()),
    additionalGuidelines: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create prompts");
    }

    // Generate the complete prompt
    const generatedPrompt = generatePromptText(args);

    return await ctx.db.insert("prompts", {
      ...args,
      generatedPrompt,
      createdBy: userId,
    });
  },
});

export const getUserPrompts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("prompts")
      .withIndex("by_user", (q) => q.eq("createdBy", userId))
      .order("desc")
      .collect();
  },
});

export const getPrompt = query({
  args: { id: v.id("prompts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const prompt = await ctx.db.get(args.id);
    if (!prompt || prompt.createdBy !== userId) {
      throw new Error("Prompt not found or access denied");
    }

    return prompt;
  },
});

export const updatePrompt = mutation({
  args: {
    id: v.id("prompts"),
    title: v.string(),
    subject: v.string(),
    persona: v.string(),
    goldenRule: v.string(),
    processSteps: v.array(v.string()),
    additionalGuidelines: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const { id, ...updateData } = args;
    const existingPrompt = await ctx.db.get(id);
    
    if (!existingPrompt || existingPrompt.createdBy !== userId) {
      throw new Error("Prompt not found or access denied");
    }

    const generatedPrompt = generatePromptText(updateData);

    await ctx.db.patch(id, {
      ...updateData,
      generatedPrompt,
    });
  },
});

export const deletePrompt = mutation({
  args: { id: v.id("prompts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const prompt = await ctx.db.get(args.id);
    if (!prompt || prompt.createdBy !== userId) {
      throw new Error("Prompt not found or access denied");
    }

    await ctx.db.delete(args.id);
  },
});

export const getTemplates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("promptTemplates").collect();
  },
});

function generatePromptText(args: {
  persona: string;
  goldenRule: string;
  processSteps: string[];
  additionalGuidelines?: string;
}) {
  let prompt = `# Teaching Assistant Instructions\n\n`;
  
  prompt += `## Your Role\n${args.persona}\n\n`;
  
  prompt += `## Golden Rule\n${args.goldenRule}\n\n`;
  
  prompt += `## Your Teaching Process\nWhen a student asks for help with their code, follow these steps:\n\n`;
  
  args.processSteps.forEach((step, index) => {
    prompt += `${index + 1}. ${step}\n`;
  });
  
  if (args.additionalGuidelines) {
    prompt += `\n## Additional Guidelines\n${args.additionalGuidelines}\n`;
  }
  
  prompt += `\n## Remember\n- Your goal is to help students learn, not to solve problems for them\n- Guide them to discover solutions through questioning and hints\n- Encourage good debugging practices\n- Be patient and supportive throughout the process`;
  
  return prompt;
}
