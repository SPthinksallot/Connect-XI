import React, { useState } from "react";
import Modal from "../common/Modal";
import { Users, Camera, X } from "lucide-react";
import { groupApi } from "../../api/chatApi";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import Spinner from "../common/Spinner";
import Avatar from "../common/Avatar";
import { authApi } from "../../api/authApi";

export default function CreateGroupModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const { addChat, setActiveChat } = useChatStore();
  const { user } = useAuthStore();

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const { data } = await authApi.searchUsers(q);
      setSearchResults(data.data.users || []);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  };

  const toggleMember = (u) => {
    if (selectedMembers.find(m => m._id === u._id)) {
      setSelectedMembers(selectedMembers.filter(m => m._id !== u._id));
    } else {
      setSelectedMembers([...selectedMembers, u]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const { data } = await groupApi.createGroup({
        name,
        description,
        memberIds: selectedMembers.map(m => m._id)
      });
      addChat(data.data.group);
      setActiveChat(data.data.group._id, "Group");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Group" size="md">
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-paper-100 dark:bg-ink-700 flex items-center justify-center shrink-0 border border-paper-300 dark:border-ink-600 border-dashed transition-colors">
              <Camera size={24} className="text-ink-400 dark:text-ink-500" />
            </div>
            <div className="flex-1 space-y-2">
                <input
                    placeholder="Group Subject"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-paper-300 dark:border-ink-600 focus:border-violet-500 py-2 text-ink-900 dark:text-paper-50 outline-none transition-colors"
                />
            </div>
        </div>
        <input
            placeholder="Group Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white dark:bg-ink-900 border border-paper-200 dark:border-ink-700 rounded-xl px-3 py-2 text-sm text-ink-900 dark:text-paper-50 outline-none focus:border-violet-500 transition-colors shadow-sm"
        />

        {/* Selected Members */}
        {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {selectedMembers.map(m => (
                    <div key={m._id} className="flex items-center gap-1 bg-violet-600/20 text-violet-300 px-2 py-1 rounded-full text-xs border border-violet-500/20">
                        <Avatar name={m.displayName || m.username} size="xs" src={m.avatar} />
                        <span>{m.displayName || m.username}</span>
                        <button onClick={() => toggleMember(m)} className="ml-1 hover:text-coral-500"><X size={12} /></button>
                    </div>
                ))}
            </div>
        )}

        {/* Search Members */}
        <div className="relative">
            <input
                placeholder="Search people to add..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-700 rounded-xl px-3 py-2 text-sm text-ink-900 dark:text-paper-50 outline-none focus:border-violet-500 transition-colors shadow-sm"
            />
            {searching && <Spinner size="sm" className="absolute right-3 top-2.5" />}
            
            {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-600 rounded-xl max-h-40 overflow-y-auto z-10 shadow-xl">
                    {searchResults.map(u => (
                        <button
                            key={u._id}
                            onClick={() => toggleMember(u)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-paper-100 dark:hover:bg-ink-700 transition-colors text-left"
                        >
                            <Avatar name={u.displayName || u.username} size="sm" src={u.avatar} />
                            <div>
                                <p className="text-sm text-ink-900 dark:text-paper-50">{u.displayName || u.username}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Action */}
        <div className="flex justify-end pt-4 mt-4 border-t border-paper-200 dark:border-ink-700">
            <button
                onClick={handleCreate}
                disabled={!name.trim() || loading}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
                {loading ? <Spinner size="sm" /> : <Users size={16} />}
                Create Group
            </button>
        </div>
      </div>
    </Modal>
  );
}
