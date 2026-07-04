import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import Spinner from "../common/Spinner";

const InputField = ({ icon: Icon, error, ...props }) => (
  <div className="relative">
    {Icon && (
      <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0B8] dark:text-[#5B6180] pointer-events-none" />
    )}
    <input
      {...props}
      className={`input-base ${Icon ? "pl-10" : ""} ${error ? "border-[#FF5C6B]! focus:border-[#FF5C6B]! focus:ring-[#FF5C6B]/20!" : ""}`}
    />
  </div>
);

export default function LoginForm({ onSwitchToPhone }) {
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
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider">
          Email
        </label>
        <InputField
          id="login-email"
          icon={Mail}
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          error={!!error}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider">
            Password
          </label>
          <button
            type="button"
            className="text-xs text-[#7C5CFF] hover:text-[#6645F0] font-medium transition-colors"
          >
            Forgot?
          </button>
        </div>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0B8] dark:text-[#5B6180] pointer-events-none" />
          <input
            id="login-password"
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className={`input-base pl-10 pr-11 ${error ? "border-[#FF5C6B]" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AA0B8] hover:text-[#5A6080] dark:hover:text-[#F0EEEA] transition-colors p-0.5"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FF5C6B]/8 border border-[#FF5C6B]/20 rounded-xl">
          <AlertCircle size={14} className="text-[#FF5C6B] shrink-0" />
          <p className="text-sm text-[#FF5C6B]">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        id="login-submit-btn"
        className="btn-primary w-full rounded-2xl py-3 mt-2 text-base"
      >
        {loading ? <Spinner size="sm" /> : "Sign In"}
      </button>

      {/* Phone option */}
      {onSwitchToPhone && (
        <p className="text-center text-xs text-[#9AA0B8] dark:text-[#5B6180]">
          Prefer OTP?{" "}
          <button
            type="button"
            onClick={onSwitchToPhone}
            className="text-[#7C5CFF] font-semibold hover:text-[#6645F0] transition-colors"
          >
            Use Phone instead
          </button>
        </p>
      )}
    </form>
  );
}
