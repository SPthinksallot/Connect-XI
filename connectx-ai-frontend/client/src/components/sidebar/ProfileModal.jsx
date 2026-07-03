import React, { useState, useRef } from "react";
import Modal from "../common/Modal";
import useAuthStore from "../../store/useAuthStore";
import { authApi } from "../../api/authApi";
import { Camera, Save } from "lucide-react";
import Avatar from "../common/Avatar";
import Spinner from "../common/Spinner";

export default function ProfileModal({ onClose }) {
  const { user, updateUser, fetchMe } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [lang, setLang] = useState(user?.preferredLanguage || "en");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
      const f = e.target.files[0];
      if (f) {
          setFile(f);
          setPreview(URL.createObjectURL(f));
      }
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
      } catch(err) {
          console.error(err);
      } finally {
          setSaving(false);
      }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Profile Settings" size="sm">
      <div className="flex flex-col items-center mb-8 shrink-0">
          <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              {preview ? (
                  <img src={preview} alt="preview" className="w-28 h-28 rounded-full object-cover ring-4 ring-violet-500/30 shadow-xl shadow-violet-500/20" />
              ) : (
                  <Avatar name={user?.displayName || user?.username} src={user?.avatar} size="xl" />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/80 to-fuchsia-600/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Camera size={28} className="text-white drop-shadow-lg" />
              </div>
          </div>
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <p className="text-xs text-slate-400 mt-3 font-medium">Click to change avatar</p>
      </div>

      <div className="space-y-5 max-h-[50vh] overflow-y-auto scrollbar-thin px-1 pb-2">
          <div>
              <label className="text-sm text-slate-200 font-semibold ml-1 block mb-2">Display Name</label>
              <input 
                value={displayName} 
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-2xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-200 shadow-sm" 
              />
          </div>
          <div>
              <label className="text-sm text-slate-200 font-semibold ml-1 block mb-2">Bio</label>
              <input 
                value={bio} 
                onChange={e => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-2xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-200 shadow-sm" 
              />
          </div>
          <div>
              <label className="text-sm text-slate-200 font-semibold ml-1 block mb-2">Language (for AI)</label>
              <select 
                value={lang} 
                onChange={e => setLang(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-2xl px-4 py-3 text-slate-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-200 appearance-none cursor-pointer shadow-sm" 
              >
                  <option value="en" className="bg-slate-800 text-slate-100">English</option>
                  <option value="hi" className="bg-slate-800 text-slate-100">Hindi</option>
              </select>
          </div>

          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full py-3.5 mt-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-2xl font-bold text-base transition-all duration-200 flex justify-center items-center gap-2.5 shadow-xl shadow-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
              {saving ? <Spinner size="sm" /> : <><Save size={20} /> Save Changes</>}
          </button>
      </div>
    </Modal>
  );
}
