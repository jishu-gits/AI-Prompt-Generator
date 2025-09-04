"use client";
import { useAuth } from "./contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn, signUp } = useAuth();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // Client-side password validation for sign-up
    if (flow === "signUp" && password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setSubmitting(false);
      return;
    }
    
    try {
      if (flow === "signIn") {
        await signIn(email, password);
        toast.success("Signed in successfully!");
      } else {
        await signUp(email, password);
        toast.success("Account created successfully!");
      }
    } catch (error: any) {
      let toastTitle = "";
      
      // Enhanced error handling with more specific messages
      if (error.code === "auth/user-not-found") {
        toastTitle = "No account found with this email. Try signing up instead.";
      } else if (error.code === "auth/email-already-in-use") {
        toastTitle = "An account with this email already exists. Try signing in instead.";
      } else if (error.code === "auth/weak-password") {
        toastTitle = "Password must be at least 8 characters long";
      } else if (error.code === "auth/invalid-email") {
        toastTitle = "Invalid email address";
      } else if (error.code === "auth/wrong-password") {
        toastTitle = "Invalid password. Please try again.";
      } else {
        toastTitle = flow === "signIn"
          ? "Could not sign in, did you mean to sign up?"
          : "Could not sign up, did you mean to sign in?";
      }
      
      toast.error(toastTitle);
    } finally {
      setSubmitting(false);
    }
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
    </div>
  );
}
