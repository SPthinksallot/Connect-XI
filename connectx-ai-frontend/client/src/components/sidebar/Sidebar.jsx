import React, { useState } from "react";
import {
  MessageSquare, Bell, Sun, Moon, LogOut, Settings,
} from "lucide-react";
import Avatar from "../common/Avatar";
import YaapIcon from "../common/YaapIcon";
import useAuthStore from "../../store/useAuthStore";
import { useTheme } from "../../context/ThemeContext";
import ProfileModal from "./ProfileModal";

const NavButton = ({ icon: Icon, label, active, onClick, danger = false }) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`group relative flex flex-col items-center gap-1 w-full py-3 px-2 rounded-2xl transition-all duration-200
      ${active
        ? "bg-[#7C5CFF]/15 dark:bg-[#7C5CFF]/20 text-[#7C5CFF]"
        : danger
          ? "text-[#9AA0B8] dark:text-[#5B6180] hover:bg-[#FF5C6B]/10 hover:text-[#FF5C6B]"
          : "text-[#9AA0B8] dark:text-[#5B6180] hover:bg-[#EDE9E0] dark:hover:bg-[#222636] hover:text-[#18192A] dark:hover:text-[#F0EEEA]"
      }`}
  >
    {active && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#7C5CFF] rounded-r-full" />
    )}
    <Icon size={19} strokeWidth={active ? 2.5 : 2} />
    {/* Tooltip */}
    <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium
      bg-[#18192A] dark:bg-[#F0EEEA] text-white dark:text-[#18192A]
      rounded-lg whitespace-nowrap opacity-0 pointer-events-none
      group-hover:opacity-100 transition-opacity delay-300 z-50 shadow-lg">
      {label}
    </span>
  </button>
);

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [active, setActive] = useState("chats");

  return (
    <>
      <aside
        className="
          w-[72px] shrink-0 flex flex-col items-center py-4 justify-between
          bg-white dark:bg-[#111318]
          border-r border-[#E9E6DF] dark:border-[#2A2F45]
          transition-colors duration-300
        "
        aria-label="Navigation sidebar"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-5 w-full px-2">
          <button
            onClick={() => setActive("chats")}
            title="Yaap"
            aria-label="Yaap home"
            className="w-11 h-11 bg-gradient-to-br from-[#7C5CFF] to-[#FF5CAA] rounded-2xl flex items-center justify-center shadow-lg shadow-[#7C5CFF]/30 text-white hover:scale-105 active:scale-95 transition-transform duration-200 mb-2 shrink-0"
          >
            <YaapIcon size={22} className="text-white" />
          </button>

          {/* Main nav */}
          <div className="flex flex-col gap-1 w-full">
            <NavButton
              icon={MessageSquare}
              label="Chats"
              active={active === "chats"}
              onClick={() => setActive("chats")}
            />
            <NavButton
              icon={Bell}
              label="Notifications"
              active={active === "notifications"}
              onClick={() => setActive("notifications")}
            />
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {/* Theme toggle */}
          <NavButton
            icon={theme === "dark" ? Sun : Moon}
            label={theme === "dark" ? "Light Mode" : "Dark Mode"}
            onClick={toggleTheme}
          />

          {/* Logout */}
          <NavButton
            icon={LogOut}
            label="Sign Out"
            danger
            onClick={logout}
          />

          {/* Divider */}
          <div className="w-8 h-px bg-[#E9E6DF] dark:bg-[#2A2F45] my-2" />

          {/* Avatar / Profile */}
          <button
            onClick={() => setShowProfile(true)}
            title="My Profile"
            aria-label="Open profile"
            className="group relative w-full flex items-center justify-center py-2 hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            <Avatar name={user?.displayName || user?.username} src={user?.avatar} size="sm" />
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium
              bg-[#18192A] dark:bg-[#F0EEEA] text-white dark:text-[#18192A]
              rounded-lg whitespace-nowrap opacity-0 pointer-events-none
              group-hover:opacity-100 transition-opacity delay-300 z-50 shadow-lg">
              {user?.displayName || user?.username || "Profile"}
            </span>
          </button>
        </div>
      </aside>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}
