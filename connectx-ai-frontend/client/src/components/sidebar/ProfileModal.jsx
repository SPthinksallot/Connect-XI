import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import useAuthStore from "../../store/useAuthStore";
import { authApi } from "../../api/authApi";
import { Camera, Save, X, CheckCircle, Languages, User } from "lucide-react";
import Avatar from "../common/Avatar";
import Spinner from "../common/Spinner";

export default function ProfileModal({ onClose }) {
  const { user, updateUser } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [lang, setLang] = useState(user?.preferredLanguage || "en");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("displayName", displayName);
      formData.append("bio", bio);
      formData.append("preferredLanguage", lang);
      if (file) formData.append("avatar", file);
      const { data } = await authApi.updateProfile(formData);
      updateUser(data.data.user);
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Card */}
      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Gradient border effect */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#7C5CFF] via-[#FF5CAA] to-[#7C5CFF] opacity-25" />
        
        <div className="relative bg-white dark:bg-[#1A1D27] border border-[#D8D3C6] dark:border-[#2A2F45] rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-0.5 bg-gradient-to-r from-[#7C5CFF] via-[#FF5CAA] to-[#7C5CFF]" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#E9E6DF] dark:border-[#2A2F45]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#7C5CFF]/10 dark:bg-[#7C5CFF]/20 flex items-center justify-center">
                <User size={14} className="text-[#7C5CFF]" />
              </div>
              <h2 className="text-base font-bold text-[#18192A] dark:text-[#F0EEEA] font-display">
                Profile Settings
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#5A6080] dark:text-[#9AA0B8] hover:bg-[#EDE9E0] dark:hover:bg-[#222636] hover:text-[#18192A] dark:hover:text-[#F0EEEA] transition-all"
              aria-label="Close profile"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileRef.current?.click()}
                role="button"
                aria-label="Change avatar"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-[#7C5CFF]/30 shadow-lg shadow-[#7C5CFF]/20"
                  />
                ) : (
                  <Avatar name={user?.displayName || user?.username} src={user?.avatar} size="xl" />
                )}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <p className="text-xs text-[#9AA0B8] dark:text-[#5B6180]">Tap to change photo</p>
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider">
                Display Name
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="input-base"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider">
                Bio
              </label>
              <input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about yourself…"
                className="input-base"
              />
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#5A6080] dark:text-[#9AA0B8] uppercase tracking-wider flex items-center gap-1.5">
                <Languages size={12} />
                AI Language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="input-base appearance-none cursor-pointer"
              >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 Hindi</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="fr">🇫🇷 French</option>
              </select>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="w-full btn-primary rounded-2xl py-3 gap-2"
            >
              {saving ? (
                <Spinner size="sm" />
              ) : saved ? (
                <><CheckCircle size={16} /> Saved!</>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
