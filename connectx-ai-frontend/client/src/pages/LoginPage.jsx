import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import PhoneLoginForm from "../components/auth/PhoneLoginForm";
import YaapIcon from "../components/common/YaapIcon";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { Zap, Shield, Globe, MessageSquare } from "lucide-react";

const FEATURES = [
  { icon: Zap, text: "AI-powered smart replies" },
  { icon: Globe, text: "Real-time translation" },
  { icon: Shield, text: "End-to-end encrypted" },
  { icon: MessageSquare, text: "Instant group messaging" },
];

export default function LoginPage() {
  const { isAuthenticated, accessToken } = useAuthStore();
  const [loginMode, setLoginMode] = useState("email");

  if (isAuthenticated || accessToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#F5F3EF] dark:bg-[#0A0B10] transition-colors duration-300">
      
      {/* ── Left Brand Panel ─────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[48%] p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7C5CFF 0%, #5130D4 50%, #FF5CAA 100%)",
        }}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-white/8 blur-2xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-black/10 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <YaapIcon size={22} className="text-white" />
            </div>
            <span className="text-white font-display font-bold text-2xl tracking-tight">Yaap</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-5xl font-display font-bold text-white leading-tight mb-4">
              Messages that<br />
              <span className="text-white/70">feel alive.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">
              The next-gen messaging platform powered by AI. Smart, fast, and beautifully designed.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3 mt-8">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-white" />
                </div>
                <span className="text-white/85 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            © 2025 Yaap · Built for the next generation
          </p>
        </div>

        {/* Floating circles decoration */}
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full border border-white/10 animate-float" />
        <div className="absolute bottom-32 right-20 w-16 h-16 rounded-full border border-white/15" />
      </div>

      {/* ── Right Form Panel ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16 relative">
        
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#7C5CFF] to-[#FF5CAA] rounded-2xl flex items-center justify-center shadow-xl shadow-[#7C5CFF]/30 mb-3">
            <YaapIcon size={28} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-[#18192A] dark:text-[#F0EEEA]">Yaap</span>
        </div>

        <div className="w-full max-w-[400px] animate-slide-up">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-[#18192A] dark:text-[#F0EEEA] mb-2">
              Welcome back
            </h2>
            <p className="text-[#5A6080] dark:text-[#9AA0B8]">
              Sign in to continue your conversations
            </p>
          </div>

          {/* Login mode tabs */}
          <div className="flex gap-1 p-1 bg-[#EDE9E0] dark:bg-[#1A1D27] rounded-2xl mb-6">
            <button
              onClick={() => setLoginMode("email")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200
                ${loginMode === "email"
                  ? "bg-white dark:bg-[#222636] text-[#7C5CFF] shadow-sm"
                  : "text-[#5A6080] dark:text-[#9AA0B8] hover:text-[#18192A] dark:hover:text-[#F0EEEA]"
                }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMode("phone")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200
                ${loginMode === "phone"
                  ? "bg-white dark:bg-[#222636] text-[#7C5CFF] shadow-sm"
                  : "text-[#5A6080] dark:text-[#9AA0B8] hover:text-[#18192A] dark:hover:text-[#F0EEEA]"
                }`}
            >
              Phone OTP
            </button>
          </div>

          {/* Form card */}
          <div className="bg-white dark:bg-[#1A1D27] border border-[#E9E6DF] dark:border-[#2A2F45] rounded-3xl p-7 shadow-sm dark:shadow-black/30">
            {loginMode === "email" ? (
              <LoginForm
                onSwitchToPhone={() => setLoginMode("phone")}
              />
            ) : (
              <PhoneLoginForm
                onSwitchToEmail={() => setLoginMode("email")}
              />
            )}
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-[#9AA0B8] dark:text-[#5B6180] mt-6">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#7C5CFF] hover:text-[#6645F0] font-semibold transition-colors"
            >
              Create one free →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
