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
      <div className="space-y-5">
        {/* Basic Info */}
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F3EF] dark:bg-[#111318] flex items-center justify-center shrink-0 border border-[#D8D3C6] dark:border-[#2A2F45] border-dashed transition-colors hover:bg-[#EDE9E0] dark:hover:bg-[#1A1D27] cursor-pointer">
            <Camera size={24} className="text-[#9AA0B8] dark:text-[#5B6180]" />
          </div>
          <div className="flex-1 space-y-2">
            <input
              placeholder="Group Subject"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-[#E9E6DF] dark:border-[#2A2F45] focus:border-[#7C5CFF] py-2 text-lg font-medium text-[#18192A] dark:text-[#F0EEEA] placeholder-[#9AA0B8] dark:placeholder-[#5B6180] outline-none transition-colors"
            />
          </div>
        </div>
        
        <input
          placeholder="Group Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-base"
        />

        {/* Selected Members */}
        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map(m => (
              <div key={m._id} className="flex items-center gap-1.5 bg-[#7C5CFF]/10 text-[#7C5CFF] px-2.5 py-1.5 rounded-full text-xs font-medium border border-[#7C5CFF]/20 animate-scale-in">
                <Avatar name={m.displayName || m.username} size="xs" src={m.avatar} />
                <span>{m.displayName || m.username}</span>
                <button onClick={() => toggleMember(m)} className="ml-1 hover:text-[#FF5C6B] hover:bg-[#FF5C6B]/10 rounded-full p-0.5 transition-colors"><X size={12} /></button>
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
            className="input-base"
          />
          {searching && <Spinner size="sm" className="absolute right-3 top-3" />}
          
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1A1D27] border border-[#D8D3C6] dark:border-[#2A2F45] rounded-2xl max-h-48 overflow-y-auto z-10 shadow-2xl shadow-black/10 dark:shadow-black/50 animate-slide-down">
              {searchResults.map(u => (
                <button
                  key={u._id}
                  onClick={() => toggleMember(u)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F3EF] dark:hover:bg-[#222636] transition-colors text-left"
                >
                  <Avatar name={u.displayName || u.username} size="sm" src={u.avatar} />
                  <div>
                    <p className="text-sm font-medium text-[#18192A] dark:text-[#F0EEEA]">{u.displayName || u.username}</p>
                    <p className="text-xs text-[#9AA0B8] dark:text-[#5B6180]">@{u.username}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex justify-end pt-5 mt-5 border-t border-[#E9E6DF] dark:border-[#2A2F45]">
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="btn-primary"
          >
            {loading ? <Spinner size="sm" /> : <Users size={16} />}
            Create Group
          </button>
        </div>
      </div>
    </Modal>
  );
}
