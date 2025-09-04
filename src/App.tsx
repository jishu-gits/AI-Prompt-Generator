import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { PromptBuilder } from "./components/PromptBuilder";
import { PromptLibrary } from "./components/PromptLibrary";
import { useState } from "react";

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"builder" | "library">("builder");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900">
        <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm h-16 flex justify-between items-center border-b border-gray-700 shadow-sm px-4">
          <h2 className="text-xl font-semibold text-blue-400">Teaching Assistant Prompt Generator</h2>
          <div></div>
        </header>
        <main className="flex-1 p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm h-16 flex justify-between items-center border-b border-gray-700 shadow-sm px-4">
        <h2 className="text-xl font-semibold text-blue-400">Teaching Assistant Prompt Generator</h2>
        {user && <SignOutButton />}
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-400 mb-4">AI Teaching Assistant Prompt Generator</h1>
            {user ? (
              <p className="text-xl text-gray-300 mb-6">
                Create prompts that guide students to discover solutions rather than giving direct answers
              </p>
            ) : (
              <p className="text-xl text-gray-300 mb-6">Sign in to start creating teaching prompts</p>
            )}
          </div>

          {!user ? (
            <div className="max-w-md mx-auto">
              <SignInForm />
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit mx-auto">
                  <button
                    onClick={() => setActiveTab("builder")}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      activeTab === "builder"
                        ? "bg-gray-700 text-blue-400 shadow-sm"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    Prompt Builder
                  </button>
                  <button
                    onClick={() => setActiveTab("library")}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      activeTab === "library"
                        ? "bg-gray-700 text-blue-400 shadow-sm"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    My Prompts
                  </button>
                </div>
              </div>

              {activeTab === "builder" ? <PromptBuilder /> : <PromptLibrary />}
            </>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
