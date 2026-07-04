import React, { useState } from "react";
import { MessageSquare, Bell, LogOut, Sun, Moon } from "lucide-react";
import Avatar from "../common/Avatar";
import YaapIcon from "../common/YaapIcon";
import useAuthStore from "../../store/useAuthStore";
import { useTheme } from "../../context/ThemeContext";
import ProfileModal from "./ProfileModal";

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="w-20 shrink-0 bg-slate-950 border-r border-slate-800/50 flex flex-col items-center py-6 justify-between">
      {/* Top logo */}
      <div className="flex flex-col items-center gap-5">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30 text-white cursor-pointer hover:scale-105 transition-transform duration-200" title="Yaap">
          <YaapIcon size={28} className="text-white" />
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-3">
          <button className="p-3 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all duration-200">
            <MessageSquare size={20} strokeWidth={2} />
          </button>
          <button className="p-3 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200">
            <Bell size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
        </button>

        <button
          onClick={logout}
          className="p-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200"
          title="Logout"
        >
          <LogOut size={20} strokeWidth={2} />
        </button>

        <button onClick={() => setShowProfile(true)} className="mt-2 hover:scale-105 transition-transform duration-200" title="Profile">
          <Avatar name={user?.displayName || user?.username} src={user?.avatar} size="md" />
        </button>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}
