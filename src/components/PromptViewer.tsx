import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface PromptViewerProps {
  promptId: Id<"prompts">;
}

export function PromptViewer({ promptId }: PromptViewerProps) {
  const prompt = useQuery(api.prompts.getPrompt, { id: promptId });

  if (!prompt) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-white">{prompt.title}</h2>
          <button
            onClick={() => copyToClipboard(prompt.generatedPrompt)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Prompt
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full">
            {prompt.subject}
          </span>
          <span>Created {new Date(prompt._creationTime).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Persona */}
          <div>
            <h3 className="font-semibold text-white mb-2">AI Persona</h3>
            <p className="text-gray-300 bg-gray-700 p-3 rounded-md">{prompt.persona}</p>
          </div>

          {/* Golden Rule */}
          <div>
            <h3 className="font-semibold text-white mb-2">Golden Rule</h3>
            <p className="text-gray-300 bg-yellow-900/30 p-3 rounded-md border-l-4 border-yellow-500">
              {prompt.goldenRule}
            </p>
          </div>

          {/* Process Steps */}
          <div>
            <h3 className="font-semibold text-white mb-2">Teaching Process</h3>
            <ol className="space-y-2">
              {prompt.processSteps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Additional Guidelines */}
          {prompt.additionalGuidelines && (
            <div>
              <h3 className="font-semibold text-white mb-2">Additional Guidelines</h3>
              <p className="text-gray-300 bg-gray-700 p-3 rounded-md">{prompt.additionalGuidelines}</p>
            </div>
          )}
        </div>
      </div>

      {/* Generated Prompt Preview */}
      <div className="border-t border-gray-700 bg-gray-700 p-6">
        <h3 className="font-semibold text-white mb-3">Generated Prompt</h3>
        <div className="bg-gray-900 border border-gray-600 rounded-md p-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono">
            {prompt.generatedPrompt}
          </pre>
        </div>
      </div>
    </div>
  );
}
