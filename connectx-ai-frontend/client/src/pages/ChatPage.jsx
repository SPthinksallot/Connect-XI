import React, { useEffect, useState } from "react";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import EmptyState from "../components/chat/EmptyState";
import Sidebar from "../components/sidebar/Sidebar";
import CreateGroupModal from "../components/group/CreateGroupModal";
import useChatStore from "../store/useChatStore";
import { useSocket } from "../hooks/useSocket";
import { useNotifications } from "../hooks/useNotifications";
import useAuthStore from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

export default function ChatPage() {
  const { isAuthenticated, user, fetchMe } = useAuthStore();
  const { activeChatId, fetchChats } = useChatStore();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  // Initialize socket connection and notifications
  useSocket();
  useNotifications();

  useEffect(() => {
    if (isAuthenticated) {
        fetchMe();
        fetchChats();
    }
  }, [isAuthenticated, fetchChats, fetchMe]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-paper-50 dark:bg-ink-950 text-ink-900 dark:text-paper-50 overflow-hidden font-body transition-colors duration-300">
      {/* App Sidebar (Nav) */}
      <Sidebar />

      {/* Bento Grid Layout */}
      <div className="flex-1 p-3 gap-3 grid grid-cols-12 grid-rows-12">
        {/* Chat List - Left Bento Box */}
        <div className={`col-span-12 md:col-span-4 lg:col-span-3 row-span-12 bg-white/80 dark:bg-ink-900/50 backdrop-blur-xl border border-paper-200 dark:border-ink-800/50 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${activeChatId ? "hidden md:flex" : "flex"} flex-col`}>
          <ChatList onCreateGroup={() => setShowCreateGroup(true)} />
        </div>

        {/* Chat Window - Right Bento Box */}
        <div className={`col-span-12 md:col-span-8 lg:col-span-9 row-span-12 bg-white/90 dark:bg-ink-900/30 backdrop-blur-xl border border-paper-200 dark:border-ink-800/50 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${!activeChatId ? "hidden md:flex" : "flex"} flex-col`}>
          {activeChatId ? (
            <ChatWindow />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {showCreateGroup && (
          <CreateGroupModal isOpen={true} onClose={() => setShowCreateGroup(false)} />
      )}
    </div>
  );
}
