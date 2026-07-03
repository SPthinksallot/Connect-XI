import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import { MessageSquare } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function RegisterPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
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
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-ink-500 max-w-xs mx-auto">
          Join ConnectX AI and start messaging with intelligence
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-ink-800/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-paper-200 dark:border-ink-700/50 relative overflow-hidden">
          <RegisterForm onSwitchToLogin={() => navigate("/login")} />
        </div>
      </div>
    </div>
  );
}
