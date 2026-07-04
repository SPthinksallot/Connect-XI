import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import useAuthStore from "../../store/useAuthStore";
import { authApi } from "../../api/authApi";
import { Camera, Save, X } from "lucide-react";
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
  const fileRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
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
      onClose();
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
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Modal card */}
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Gradient top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              {preview ? (
                <img src={preview} alt="preview" className="w-24 h-24 rounded-full object-cover ring-4 ring-violet-500/40 shadow-xl" />
              ) : (
                <Avatar name={user?.displayName || user?.username} src={user?.avatar} size="xl" />
              )}
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <p className="text-xs text-slate-500">Click to change avatar</p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Display Name</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Bio</label>
            <input
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Language (for AI)</label>
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="en" className="bg-slate-800">English</option>
              <option value="hi" className="bg-slate-800">Hindi</option>
            </select>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Spinner size="sm" /> : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
