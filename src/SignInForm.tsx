"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get("password") as string;
    
    // Client-side password validation for sign-up
    if (flow === "signUp" && password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setSubmitting(false);
      return;
    }
    
    formData.set("flow", flow);
    void signIn("password", formData).catch((error) => {
      let toastTitle = "";
      
      // Enhanced error handling with more specific messages
      if (error.message.includes("Invalid password")) {
        toastTitle = "Invalid password. Please try again.";
      } else if (error.message.includes("User not found") || error.message.includes("No account found")) {
        toastTitle = flow === "signIn" 
          ? "No account found with this email. Try signing up instead."
          : "An account with this email already exists. Try signing in instead.";
      } else if (error.message.includes("User already exists") || error.message.includes("already exists")) {
        toastTitle = "An account with this email already exists. Try signing in instead.";
      } else if (error.message.includes("Password must be at least 8 characters")) {
        toastTitle = "Password must be at least 8 characters long";
      } else {
        toastTitle = flow === "signIn"
          ? "Could not sign in, did you mean to sign up?"
          : "Could not sign up, did you mean to sign in?";
      }
      
      toast.error(toastTitle);
      setSubmitting(false);
    });
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-form-field"
        onSubmit={handleSubmit}
      >
        <input
          className="auth-input-field"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <div>
          <input
            className="auth-input-field"
            type="password"
            name="password"
            placeholder={flow === "signUp" ? "Password (min 8 characters)" : "Password"}
            minLength={flow === "signUp" ? 8 : undefined}
            required
          />
          {flow === "signUp" && (
            <p className="text-xs text-gray-400 mt-1">
              Password must be at least 8 characters long
            </p>
          )}
        </div>
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="text-center text-sm text-gray-400">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow border-gray-700" />
        <span className="mx-4 text-gray-400">or</span>
        <hr className="my-4 grow border-gray-700" />
      </div>
      <button className="auth-button" onClick={() => void signIn("anonymous")}>
        Sign in anonymously
      </button>
    </div>
  );
}
