import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  prompts: defineTable({
    title: v.string(),
    subject: v.string(),
    persona: v.string(),
    goldenRule: v.string(),
    processSteps: v.array(v.string()),
    additionalGuidelines: v.optional(v.string()),
    generatedPrompt: v.string(),
    createdBy: v.id("users"),
  }).index("by_user", ["createdBy"]),
  
  promptTemplates: defineTable({
    name: v.string(),
    subject: v.string(),
    description: v.string(),
    personaTemplate: v.string(),
    goldenRuleTemplate: v.string(),
    processStepsTemplate: v.array(v.string()),
    isDefault: v.boolean(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
