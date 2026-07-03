import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import Spinner from "../common/Spinner";

export default function LoginForm({ onSwitchToRegister, onSwitchToPhone }) {
  const { login, loading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    clearError();
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div className="relative">
        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          id="login-email"
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-ink-700 border border-paper-200 dark:border-ink-600 rounded-xl text-ink-900 dark:text-paper-50 placeholder-ink-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          id="login-password"
          name="password"
          type={showPass ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          className="w-full pl-10 pr-12 py-3 bg-white dark:bg-ink-700 border border-paper-200 dark:border-ink-600 rounded-xl text-ink-900 dark:text-paper-50 placeholder-ink-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all shadow-sm"
        />
        <button
          type="button"
          onClick={() => setShowPass((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-paper-50 transition-colors"
        >
          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-coral-500 text-sm bg-coral-500/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Demo hint */}
      <p className="text-xs text-ink-500 text-center">
        Demo: use any registered email & password
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        id="login-submit-btn"
        className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Spinner size="sm" /> : (
          <><Zap size={16} /> Sign In <ArrowRight size={16} /></>
        )}
      </button>

      {/* Switch to Phone */}
      <div className="flex items-center justify-center gap-2 text-sm text-ink-400">
        <button
          type="button"
          onClick={onSwitchToPhone}
          className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          Use Phone OTP instead
        </button>
      </div>

      {/* Switch to Register */}
      <p className="text-center text-sm text-ink-400 pt-2 border-t border-ink-700">
        No account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          Create one free
        </button>
      </p>
    </form>
  );
}
