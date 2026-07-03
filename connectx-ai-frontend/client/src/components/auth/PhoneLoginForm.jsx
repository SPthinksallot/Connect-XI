import { useState, useEffect } from "react";
import { Smartphone, Check, ArrowRight, Zap, User } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import Spinner from "../common/Spinner";

export default function PhoneLoginForm({ onSwitchToRegister, onSwitchToEmail }) {
  const { requestOtp, verifyOtp, loading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1); // 1 = phone + name input, 2 = otp input
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    clearError();
    
    if (phone.length < 10 || name.trim().length < 3) {
      return;
    }

    const result = await requestOtp(phone);
    if (result.success) {
      setStep(2);
      setCountdown(60);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearError();
    
    if (otp.length !== 6) {
      return;
    }

    await verifyOtp(phone, otp, name.trim());
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    clearError();
    const result = await requestOtp(phone);
    if (result.success) {
      setOtp("");
      setCountdown(60);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp("");
    clearError();
  };

  return (
    <div className="space-y-4">
      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="relative">
            <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              id="phone-input"
              name="phone"
              type="tel"
              placeholder="Phone number (e.g., +1234567890)"
              value={phone}
              onChange={(e) => {
                clearError();
                setPhone(e.target.value);
              }}
              required
              autoComplete="tel"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-ink-700 border border-paper-200 dark:border-ink-600 rounded-xl text-ink-900 dark:text-paper-50 placeholder-ink-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              id="name-input"
              name="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                clearError();
                setName(e.target.value);
              }}
              required
              minLength={3}
              autoComplete="name"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-ink-700 border border-paper-200 dark:border-ink-600 rounded-xl text-ink-900 dark:text-paper-50 placeholder-ink-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all shadow-sm"
            />
          </div>

          {error && (
            <p className="text-coral-500 text-sm bg-coral-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <p className="text-xs text-ink-500 text-center">
            Enter phone with country code and your name
          </p>

          <button
            type="submit"
            disabled={loading || phone.length < 10 || name.trim().length < 3}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner size="sm" /> : (
              <>
                <Zap size={16} /> Send OTP <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-sm text-ink-400">
            <button
              type="button"
              onClick={onSwitchToEmail}
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Use Email instead
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-500/10 rounded-full mb-2">
              <Smartphone size={20} className="text-violet-400" />
            </div>
            <p className="text-sm text-ink-300">
              Enter the 6-digit code sent to
            </p>
            <p className="font-semibold text-ink-900 dark:text-paper-50">{phone}</p>
            <p className="text-xs text-ink-400 mt-1">for {name}</p>
          </div>

          <div className="relative">
            <input
              id="otp-input"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                clearError();
                const value = e.target.value.replace(/\D/g, "");
                setOtp(value);
              }}
              required
              autoComplete="one-time-code"
              className="w-full px-4 py-3 bg-white dark:bg-ink-700 border border-paper-200 dark:border-ink-600 rounded-xl text-ink-900 dark:text-paper-50 text-center text-2xl font-mono tracking-widest placeholder-ink-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all shadow-sm"
            />
          </div>

          {error && (
            <p className="text-coral-500 text-sm bg-coral-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner size="sm" /> : (
              <>
                <Check size={16} /> Verify & Login <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleBack}
              className="text-ink-400 hover:text-ink-600 dark:hover:text-paper-50 transition-colors"
            >
              ← Change number
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || loading}
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-sm text-ink-400 pt-2 border-t border-paper-200 dark:border-ink-700">
        No account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          Create one free
        </button>
      </p>
    </div>
  );
}
