import React, { useState } from "react";
import ChatListItem from "./ChatListItem";
import { Search, Plus, Users } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import useChatStore from "../../store/useChatStore";
import { chatApi } from "../../api/chatApi";
import { authApi } from "../../api/authApi";
import Spinner from "../common/Spinner";
import Avatar from "../common/Avatar";

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-ink-900 dark:text-paper-50 tracking-tight">Chats</h1>
          <button
            onClick={onCreateGroup}
            id="create-group-btn"
            title="New Group"
            className="p-2.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:scale-105 transition-all duration-200"
          >
            <Users size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 dark:text-ink-500" strokeWidth={2} />
          <input
            id="chat-search"
            type="text"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-paper-100 dark:bg-ink-800/50 border border-paper-200 dark:border-ink-700/50 rounded-2xl text-sm text-ink-900 dark:text-paper-50 placeholder-ink-400 dark:placeholder-ink-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200"
          />
          {searching && <Spinner size="sm" className="absolute right-3 top-1/2 -translate-y-1/2" />}
        </div>
      </div>

      {/* User search results */}
      {userResults.length > 0 && (
        <div className="px-3 pb-2 shrink-0">
          <p className="text-xs text-ink-500 px-1 mb-2 font-medium uppercase tracking-wider">People</p>
          <div className="space-y-1">
            {userResults.map((u) => (
              <button
                key={u._id}
                onClick={() => startChat(u._id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-paper-200 dark:hover:bg-ink-800/50 transition-colors text-left"
              >
                <Avatar name={u.displayName || u.username} src={u.avatar} size="sm" />
                <div>
                  <p className="text-sm font-medium text-ink-900 dark:text-paper-50">{u.displayName || u.username}</p>
                  <p className="text-xs text-ink-500">@{u.username}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-ink-700 mt-3 pt-3">
            <p className="text-xs text-ink-500 px-1 mb-2 font-medium uppercase tracking-wider">Conversations</p>
          </div>
        </div>
      )}

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4 space-y-1">
        {chatsLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-ink-500 text-sm">
            <Plus size={28} className="mx-auto mb-2 opacity-40" />
            <p>{query ? "No results found" : "No conversations yet"}</p>
            <p className="text-xs mt-1">Search for someone to start chatting</p>
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
