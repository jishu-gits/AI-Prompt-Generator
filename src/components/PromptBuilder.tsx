import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function PromptBuilder() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [persona, setPersona] = useState("");
  const [goldenRule, setGoldenRule] = useState("");
  const [processSteps, setProcessSteps] = useState<string[]>([""]);
  const [additionalGuidelines, setAdditionalGuidelines] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [editingId, setEditingId] = useState<Id<"prompts"> | null>(null);

  const templates = useQuery(api.prompts.getTemplates) || [];
  const createPrompt = useMutation(api.prompts.createPrompt);
  const updatePrompt = useMutation(api.prompts.updatePrompt);
  const seedTemplates = useMutation(api.templates.seedTemplates);

  useEffect(() => {
    if (templates.length === 0) {
      seedTemplates();
    }
  }, [templates.length, seedTemplates]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t._id === templateId);
    if (template) {
      setTitle(`${template.name} - Custom`);
      setSubject(template.subject);
      setPersona(template.personaTemplate);
      setGoldenRule(template.goldenRuleTemplate);
      setProcessSteps(template.processStepsTemplate);
      setSelectedTemplate(templateId);
    }
  };

  const addProcessStep = () => {
    setProcessSteps([...processSteps, ""]);
  };

  const updateProcessStep = (index: number, value: string) => {
    const newSteps = [...processSteps];
    newSteps[index] = value;
    setProcessSteps(newSteps);
  };

  const removeProcessStep = (index: number) => {
    if (processSteps.length > 1) {
      setProcessSteps(processSteps.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !subject.trim() || !persona.trim() || !goldenRule.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const validSteps = processSteps.filter(step => step.trim());
    if (validSteps.length === 0) {
      toast.error("Please add at least one process step");
      return;
    }

    try {
      if (editingId) {
        await updatePrompt({
          id: editingId,
          title: title.trim(),
          subject: subject.trim(),
          persona: persona.trim(),
          goldenRule: goldenRule.trim(),
          processSteps: validSteps,
          additionalGuidelines: additionalGuidelines.trim() || undefined,
        });
        toast.success("Prompt updated successfully!");
        setEditingId(null);
      } else {
        await createPrompt({
          title: title.trim(),
          subject: subject.trim(),
          persona: persona.trim(),
          goldenRule: goldenRule.trim(),
          processSteps: validSteps,
          additionalGuidelines: additionalGuidelines.trim() || undefined,
        });
        toast.success("Prompt created successfully!");
      }
      
      // Reset form
      setTitle("");
      setSubject("");
      setPersona("");
      setGoldenRule("");
      setProcessSteps([""]);
      setAdditionalGuidelines("");
      setSelectedTemplate("");
    } catch (error) {
      toast.error("Failed to save prompt");
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setPersona("");
    setGoldenRule("");
    setProcessSteps([""]);
    setAdditionalGuidelines("");
    setSelectedTemplate("");
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold mb-6">Create Teaching Assistant Prompt</h2>
        
        {/* Template Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start with a template (optional)
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a template...</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name} - {template.description}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Python Debugging Assistant"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Area *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Python, JavaScript, Mathematics"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Persona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Persona *
            </label>
            <textarea
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="Define the AI's role and personality. Example: 'You are a friendly and encouraging Python programming tutor. Your goal is to help students debug their code by guiding them to the solution without giving it away.'"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Golden Rule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Golden Rule *
            </label>
            <textarea
              value={goldenRule}
              onChange={(e) => setGoldenRule(e.target.value)}
              placeholder="The most important constraint. Example: 'Under no circumstances should you ever provide the corrected code or the direct solution. The student must write the final code themselves.'"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Process Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teaching Process Steps *
            </label>
            <div className="space-y-3">
              {processSteps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <span className="flex-shrink-0 w-8 h-10 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => updateProcessStep(index, e.target.value)}
                    placeholder={`Step ${index + 1}: e.g., Acknowledge their effort and validate their attempt`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {processSteps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProcessStep(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addProcessStep}
              className="mt-3 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md border border-blue-200"
            >
              + Add Step
            </button>
          </div>

          {/* Additional Guidelines */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Guidelines (optional)
            </label>
            <textarea
              value={additionalGuidelines}
              onChange={(e) => setAdditionalGuidelines(e.target.value)}
              placeholder="Any extra instructions or specific behaviors you want the AI to follow..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingId ? "Update Prompt" : "Create Prompt"}
            </button>
            {(editingId || title || persona || goldenRule) && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset Form
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
