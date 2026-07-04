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
  const { isAuthenticated, fetchMe } = useAuthStore();
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
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#F5F3EF] dark:bg-[#0A0B10] transition-colors duration-300">
      {/* ── App Sidebar (Nav) ── */}
      <Sidebar />

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat List */}
        <div className={`
          flex-col w-full md:w-[360px] lg:w-[400px] shrink-0 border-r border-[#D8D3C6] dark:border-[#2A2F45] bg-[#FFFFFF] dark:bg-[#111318]
          transition-all duration-300
          ${activeChatId ? "hidden md:flex" : "flex"}
        `}>
          <ChatList onCreateGroup={() => setShowCreateGroup(true)} />
        </div>

        {/* Right Panel: Chat Window / Empty State */}
        <div className={`
          flex-1 flex-col bg-[#F7F6F4] dark:bg-[#111318]/50
          transition-all duration-300
          ${!activeChatId ? "hidden md:flex" : "flex"}
        `}>
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
