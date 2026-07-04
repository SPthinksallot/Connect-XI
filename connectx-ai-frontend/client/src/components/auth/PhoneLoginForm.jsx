import { useState, useEffect, useRef } from "react";
import { Smartphone, User, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import Spinner from "../common/Spinner";

// 6 individual digit boxes for OTP entry
function OtpInput({ value, onChange }) {
  const inputs = useRef([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  const handleKey = (e, i) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) {
        next[i] = "";
        onChange(next.join(""));
      } else if (i > 0) {
        next[i - 1] = "";
        onChange(next.join(""));
        inputs.current[i - 1]?.focus();
      }
    }
  };

  const handleChange = (e, i) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    const next = [...digits];
    next[i] = char;
    onChange(next.join(""));
    if (i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    const idx = Math.min(pasted.length, 5);
    inputs.current[idx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          autoFocus={i === 0}
          className="w-11 h-13 text-center text-xl font-bold font-mono
            bg-[#EDE9E0] dark:bg-[#222636]
            border-2 border-[#D8D3C6] dark:border-[#2A2F45]
            text-[#18192A] dark:text-[#F0EEEA]
            rounded-2xl outline-none
            focus:border-[#7C5CFF] focus:ring-2 focus:ring-[#7C5CFF]/20
            transition-all duration-150"
          style={{ height: "52px" }}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function PhoneLoginForm({ onSwitchToEmail }) {
  const { requestOtp, verifyOtp, loading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    clearError();
    if (phone.length < 10 || name.trim().length < 3) return;
    const result = await requestOtp(phone);
    if (result.success) {
      setStep(2);
      setOtpSent(true);
      setCountdown(60);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearError();
    if (otp.length !== 6) return;
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

  return (
    <div className="space-y-5">
      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <Smartphone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0B8] dark:text-[#5B6180] pointer-events-none" />
              <input
                id="phone-input"
                name="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => { clearError(); setPhone(e.target.value); }}
                required
                autoComplete="tel"
                className="input-base pl-10"
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider">
              Your Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0B8] dark:text-[#5B6180] pointer-events-none" />
              <input
                id="name-input"
                name="name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => { clearError(); setName(e.target.value); }}
                required
                minLength={3}
                autoComplete="name"
                className="input-base pl-10"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FF5C6B]/8 border border-[#FF5C6B]/20 rounded-xl">
              <AlertCircle size={14} className="text-[#FF5C6B] shrink-0" />
              <p className="text-sm text-[#FF5C6B]">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || phone.length < 10 || name.trim().length < 3}
            className="btn-primary w-full rounded-2xl py-3 text-base"
          >
            {loading ? <Spinner size="sm" /> : "Send OTP →"}
          </button>

          {onSwitchToEmail && (
            <p className="text-center text-xs text-[#9AA0B8]">
              <button
                type="button"
                onClick={onSwitchToEmail}
                className="text-[#7C5CFF] font-semibold hover:text-[#6645F0] transition-colors"
              >
                Use Email instead
              </button>
            </p>
          )}
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          {/* Back */}
          <button
            type="button"
            onClick={() => { setStep(1); setOtp(""); clearError(); }}
            className="flex items-center gap-1.5 text-sm text-[#9AA0B8] hover:text-[#5A6080] dark:hover:text-[#F0EEEA] transition-colors"
          >
            <ArrowLeft size={14} />
            Change number
          </button>

          {/* Instructions */}
          <div className="text-center space-y-1">
            {otpSent && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#22D3A0]/10 border border-[#22D3A0]/20 rounded-full text-[#22D3A0] text-xs font-semibold mb-2">
                <CheckCircle size={11} />
                OTP sent to {phone}
              </div>
            )}
            <p className="text-sm text-[#5A6080] dark:text-[#9AA0B8]">
              Enter the 6-digit code sent to
            </p>
            <p className="font-bold text-[#18192A] dark:text-[#F0EEEA]">{phone}</p>
          </div>

          {/* OTP boxes */}
          <OtpInput value={otp} onChange={setOtp} />

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FF5C6B]/8 border border-[#FF5C6B]/20 rounded-xl">
              <AlertCircle size={14} className="text-[#FF5C6B] shrink-0" />
              <p className="text-sm text-[#FF5C6B]">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn-primary w-full rounded-2xl py-3 text-base"
          >
            {loading ? <Spinner size="sm" /> : "Verify & Continue →"}
          </button>

          {/* Resend */}
          <p className="text-center text-xs text-[#9AA0B8]">
            Didn't get it?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || loading}
              className="text-[#7C5CFF] font-semibold hover:text-[#6645F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
