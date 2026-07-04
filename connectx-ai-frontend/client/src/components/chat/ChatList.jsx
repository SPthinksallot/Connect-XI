import React, { useState } from "react";
import ChatListItem from "./ChatListItem";
import { Search, Users, MessageSquarePlus } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import useChatStore from "../../store/useChatStore";
import { chatApi } from "../../api/chatApi";
import { authApi } from "../../api/authApi";
import Spinner from "../common/Spinner";
import Avatar from "../common/Avatar";
import { ChatListSkeleton } from "../common/SkeletonLoader";

export default function ChatList({ onCreateGroup }) {
  const { user } = useAuthStore();
  const { chats, activeChatId, setActiveChat, addChat, chatsLoading } = useChatStore();
  const [query, setQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (q) => {
    setQuery(q);
    if (!q.trim()) { setUserResults([]); return; }
    setSearching(true);
    try {
      const { data } = await authApi.searchUsers(q);
      setUserResults(data.data.users || []);
    } catch (err) { 
      console.error('Search error:', err);
      setUserResults([]); 
    }
    finally { setSearching(false); }
  };

  const startChat = async (userId) => {
    try {
      const { data } = await chatApi.createOrGetChat(userId);
      const chat = data.data.chat;
      addChat(chat);
      setActiveChat(chat._id, "Chat");
      setQuery("");
      setUserResults([]);
    } catch (err) { console.error(err); }
  };

  const filtered = query
    ? chats.filter((c) => {
        const name = c.name || c.participants?.find((p) => (p._id || p) !== user?._id)?.displayName || "";
        return name.toLowerCase().includes(query.toLowerCase());
      })
    : chats;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111318] transition-colors duration-300">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-[#18192A] dark:text-[#F0EEEA] font-display tracking-tight">Chats</h1>
          <button
            onClick={onCreateGroup}
            id="create-group-btn"
            title="New Group"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#7C5CFF]/10 dark:bg-[#7C5CFF]/15 hover:bg-[#7C5CFF]/20 text-[#7C5CFF] hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Users size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0B8] dark:text-[#5B6180] group-focus-within:text-[#7C5CFF] transition-colors duration-200" strokeWidth={2.5} />
          <input
            id="chat-search"
            type="text"
            placeholder="Search messages or people..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-[#F5F3EF] dark:bg-[#1A1D27] border border-transparent rounded-2xl text-[15px] text-[#18192A] dark:text-[#F0EEEA] placeholder-[#9AA0B8] dark:placeholder-[#5B6180] focus:border-[#7C5CFF] focus:ring-2 focus:ring-[#7C5CFF]/20 focus:bg-white dark:focus:bg-[#111318] outline-none transition-all duration-200"
          />
          {searching && <Spinner size="sm" className="absolute right-3.5 top-1/2 -translate-y-1/2" />}
        </div>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4 space-y-1">
        {userResults.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#9AA0B8] dark:text-[#5B6180] px-2 mb-2 uppercase tracking-wider">People</p>
            <div className="space-y-1">
              {userResults.map((u) => (
                <button
                  key={u._id}
                  onClick={() => startChat(u._id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F5F3EF] dark:hover:bg-[#1A1D27] transition-colors text-left"
                >
                  <Avatar name={u.displayName || u.username} src={u.avatar} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-[#18192A] dark:text-[#F0EEEA]">{u.displayName || u.username}</p>
                    <p className="text-xs text-[#9AA0B8] dark:text-[#5B6180]">@{u.username}</p>
                  </div>
                </button>
              ))}
            </div>
            {filtered.length > 0 && (
              <div className="h-px bg-[#E9E6DF] dark:bg-[#2A2F45] my-3 mx-2" />
            )}
          </div>
        )}

        {query && filtered.length > 0 && (
          <p className="text-xs font-semibold text-[#9AA0B8] dark:text-[#5B6180] px-2 mb-2 uppercase tracking-wider">Conversations</p>
        )}

        {chatsLoading ? (
          <ChatListSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4 animate-fade-in">
            <div className="w-12 h-12 bg-[#7C5CFF]/10 text-[#7C5CFF] rounded-2xl flex items-center justify-center mb-3">
              <MessageSquarePlus size={24} />
            </div>
            <p className="text-sm font-medium text-[#18192A] dark:text-[#F0EEEA] mb-1">
              {query ? "No results found" : "No conversations yet"}
            </p>
            <p className="text-xs text-[#9AA0B8] dark:text-[#5B6180]">
              {query ? "Try searching for a different name" : "Search for someone above to start chatting"}
            </p>
          </div>
        ) : (
          filtered.map((chat) => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              isActive={activeChatId === chat._id}
              onSelect={setActiveChat}
              currentUserId={user?._id}
            />
          ))
        )}
      </div>
    </div>
  );
}
