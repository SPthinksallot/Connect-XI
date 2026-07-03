import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import PhoneLoginForm from "../components/auth/PhoneLoginForm";
import { MessageSquare } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function LoginPage() {
  const { isAuthenticated, accessToken } = useAuthStore();
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState("email"); // "email" or "phone"

  // Check if user is already logged in
  if (isAuthenticated || accessToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-body transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30 text-white animate-[bounce_2s_infinite]">
            <MessageSquare size={32} strokeWidth={2.5} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-ink-900 dark:text-paper-50 font-display tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-ink-500 max-w-xs mx-auto">
          Sign in to your account to continue your conversations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-ink-800/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-paper-200 dark:border-ink-700/50 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />
          {loginMode === "email" ? (
            <LoginForm 
              onSwitchToRegister={() => navigate("/register")}
              onSwitchToPhone={() => setLoginMode("phone")}
            />
          ) : (
            <PhoneLoginForm
              onSwitchToRegister={() => navigate("/register")}
              onSwitchToEmail={() => setLoginMode("email")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
