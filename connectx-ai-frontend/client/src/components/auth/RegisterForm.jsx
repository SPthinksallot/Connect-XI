import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, AtSign } from "lucide-react";
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
  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2
    : 3;
  const strengthColors = ["", "#FF5C6B", "#FFB347", "#22D3A0"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Display Name */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider">
          Display Name
        </label>
        <div className="relative">
          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0B8] dark:text-[#5B6180] pointer-events-none" />
          <input
            name="displayName"
            placeholder="Jane Smith"
            value={form.displayName}
            onChange={handleChange}
            className="input-base pl-10"
            autoComplete="name"
          />
        </div>
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider">
          Username
        </label>
        <div className="relative">
          <AtSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0B8] dark:text-[#5B6180] pointer-events-none" />
          <input
            name="username"
            placeholder="janesmith"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
            className="input-base pl-10"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider">
          Email
        </label>
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0B8] dark:text-[#5B6180] pointer-events-none" />
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="input-base pl-10"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0B8] dark:text-[#5B6180] pointer-events-none" />
          <input
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className="input-base pl-10 pr-11"
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

        {/* Password strength */}
        {form.password.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: strength >= i ? strengthColors[strength] : "#E9E6DF",
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-medium" style={{ color: strengthColors[strength] }}>
              {strengthLabels[strength]}
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {displayError && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FF5C6B]/8 border border-[#FF5C6B]/20 rounded-xl">
          <AlertCircle size={14} className="text-[#FF5C6B] shrink-0" />
          <p className="text-sm text-[#FF5C6B]">{displayError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        id="register-submit-btn"
        className="btn-primary w-full rounded-2xl py-3 mt-2 text-base"
      >
        {loading ? <Spinner size="sm" /> : "Create Account"}
      </button>
    </form>
  );
}
