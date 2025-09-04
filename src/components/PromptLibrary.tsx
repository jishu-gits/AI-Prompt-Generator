import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import { PromptViewer } from "./PromptViewer";
import { Id } from "../../convex/_generated/dataModel";

export function PromptLibrary() {
  const prompts = useQuery(api.prompts.getUserPrompts) || [];
  const deletePrompt = useMutation(api.prompts.deletePrompt);
  const [selectedPromptId, setSelectedPromptId] = useState<Id<"prompts"> | null>(null);

  const handleDelete = async (id: Id<"prompts">) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      try {
        await deletePrompt({ id });
        toast.success("Prompt deleted successfully");
        if (selectedPromptId === id) {
          setSelectedPromptId(null);
        }
      } catch (error) {
        toast.error("Failed to delete prompt");
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No prompts yet</h3>
          <p className="text-gray-400">Create your first teaching assistant prompt to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prompts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-white">My Prompts ({prompts.length})</h2>
          {prompts.map((prompt) => (
            <div
              key={prompt._id}
              className={`bg-gray-800 rounded-lg border p-4 cursor-pointer transition-all ${
                selectedPromptId === prompt._id
                  ? "border-blue-500 shadow-md"
                  : "border-gray-700 hover:border-gray-600 hover:shadow-sm"
              }`}
              onClick={() => setSelectedPromptId(prompt._id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-white">{prompt.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(prompt.generatedPrompt);
                    }}
                    className="text-blue-400 hover:text-blue-300 p-1"
                    title="Copy prompt"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(prompt._id);
                    }}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete prompt"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full">
                  {prompt.subject}
                </span>
                <span>{new Date(prompt._creationTime).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-300 mt-2 line-clamp-2">{prompt.persona}</p>
            </div>
          ))}
        </div>

        {/* Prompt Viewer */}
        <div className="lg:sticky lg:top-24">
          {selectedPromptId ? (
            <PromptViewer promptId={selectedPromptId} />
          ) : (
            <div className="bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 p-8 text-center">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-gray-400">Select a prompt to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
