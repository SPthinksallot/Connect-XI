import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import YaapIcon from "../components/common/YaapIcon";
import { Navigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { Sparkles } from "lucide-react";

export default function RegisterPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#F5F3EF] dark:bg-[#0A0B10] transition-colors duration-300">

      {/* ── Left Brand Panel ─────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[48%] p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FF5CAA 0%, #7C5CFF 50%, #5130D4 100%)",
        }}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 -left-10 w-64 h-64 rounded-full bg-white/8 blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-black/10 blur-3xl" />
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

        {/* Hero */}
        <div className="relative z-10 space-y-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white/85 text-xs font-semibold mb-4">
              <Sparkles size={12} />
              Free forever
            </div>
            <h1 className="text-5xl font-display font-bold text-white leading-tight">
              Join the<br />
              <span className="text-white/70">conversation.</span>
            </h1>
            <p className="text-white/70 text-lg mt-4 leading-relaxed max-w-md">
              Create your account in seconds and start chatting with AI-powered features that make every message smarter.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {["Smart Replies", "Translate", "AI Summarize", "Voice Notes", "Group Chats"].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-medium rounded-full border border-white/20"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs">© 2025 Yaap</p>
        </div>

        {/* Decoration */}
        <div className="absolute top-1/3 right-10 w-24 h-24 rounded-full border border-white/10 animate-float" />
        <div className="absolute top-1/4 right-20 w-10 h-10 rounded-full border border-white/15" />
      </div>

      {/* ── Right Form Panel ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10 flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FF5CAA] to-[#7C5CFF] rounded-2xl flex items-center justify-center shadow-xl shadow-[#7C5CFF]/30 mb-3">
            <YaapIcon size={28} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-[#18192A] dark:text-[#F0EEEA]">Yaap</span>
        </div>

        <div className="w-full max-w-[400px] animate-slide-up">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-[#18192A] dark:text-[#F0EEEA] mb-2">
              Create account
            </h2>
            <p className="text-[#5A6080] dark:text-[#9AA0B8]">
              Join Yaap and start messaging with intelligence
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white dark:bg-[#1A1D27] border border-[#E9E6DF] dark:border-[#2A2F45] rounded-3xl p-7 shadow-sm dark:shadow-black/30">
            <RegisterForm onSwitchToLogin={() => window.location.href = "/login"} />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-[#9AA0B8] dark:text-[#5B6180] mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#7C5CFF] hover:text-[#6645F0] font-semibold transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
