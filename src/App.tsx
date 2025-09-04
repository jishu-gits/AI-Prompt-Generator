import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { PromptBuilder } from "./components/PromptBuilder";
import { PromptLibrary } from "./components/PromptLibrary";
import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary">Teaching Assistant Prompt Generator</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-8">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [activeTab, setActiveTab] = useState<"builder" | "library">("builder");

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">AI Teaching Assistant Prompt Generator</h1>
        <Authenticated>
          <p className="text-xl text-secondary mb-6">
            Create prompts that guide students to discover solutions rather than giving direct answers
          </p>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-secondary mb-6">Sign in to start creating teaching prompts</p>
        </Unauthenticated>
      </div>

      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mx-auto">
            <button
              onClick={() => setActiveTab("builder")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "builder"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Prompt Builder
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "library"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              My Prompts
            </button>
          </div>
        </div>

        {activeTab === "builder" ? <PromptBuilder /> : <PromptLibrary />}
      </Authenticated>
    </div>
  );
}
