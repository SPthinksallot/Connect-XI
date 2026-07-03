import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import Spinner from "../common/Spinner";

export default function RegisterForm({ onSwitchToLogin }) {
  const { register, loading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ username: "", email: "", password: "", displayName: "" });
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    clearError();
    setLocalError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    await register(form);
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display Name */}
      <div className="relative">
        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          name="displayName"
          placeholder="Display name"
          value={form.displayName}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-ink-700 border border-paper-200 dark:border-ink-600 rounded-xl text-ink-900 dark:text-paper-50 placeholder-ink-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Username */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm font-medium">@</span>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="username"
          className="w-full pl-8 pr-4 py-3 bg-white dark:bg-ink-700 border border-paper-200 dark:border-ink-600 rounded-xl text-ink-900 dark:text-paper-50 placeholder-ink-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
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
          name="password"
          type={showPass ? "text" : "password"}
          placeholder="Password (min. 6 chars)"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
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
      {displayError && (
        <p className="text-coral-500 text-sm bg-coral-500/10 px-3 py-2 rounded-lg">{displayError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        id="register-submit-btn"
        className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Spinner size="sm" /> : (
          <><Zap size={16} /> Create Account <ArrowRight size={16} /></>
        )}
      </button>

      {/* Switch */}
      <p className="text-center text-sm text-ink-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
