import React from "react";
import Modal from "../common/Modal";
import Avatar from "../common/Avatar";
import { Crown, LogOut, Trash2, Users } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import { groupApi } from "../../api/chatApi";
import useChatStore from "../../store/useChatStore";

export default function GroupInfo({ group, onClose }) {
  const { user } = useAuthStore();
  const { setActiveChat } = useChatStore();

  const isAdmin = group.admins?.includes(user._id);
  const isOwner = group.admin === user._id;

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this group?")) return;
    try {
      await groupApi.removeMember(group._id, user._id);
      setActiveChat(null);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this group for everyone? This cannot be undone.")) return;
    try {
      await groupApi.deleteGroup(group._id);
      setActiveChat(null);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Group Info" size="md">
      {/* Group hero */}
      <div className="flex flex-col items-center mb-6 -mt-2">
        <div className="mb-4">
          <Avatar name={group.name} src={group.avatar} size="xl" />
        </div>
        <h2 className="text-xl font-bold text-[#18192A] dark:text-[#F0EEEA] font-display">
          {group.name}
        </h2>
        {group.description && (
          <p className="text-sm text-[#5A6080] dark:text-[#9AA0B8] mt-1.5 text-center max-w-xs leading-relaxed">
            {group.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#9AA0B8] dark:text-[#5B6180]">
          <Users size={12} />
          <span>{group.members?.length || 0} participants</span>
        </div>
      </div>

      {/* Members */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#9AA0B8] dark:text-[#5B6180] uppercase tracking-wider mb-3">
          Members
        </p>
        <div className="rounded-2xl border border-[#E9E6DF] dark:border-[#2A2F45] overflow-hidden divide-y divide-[#E9E6DF] dark:divide-[#2A2F45]">
          {group.members?.map((m) => (
            <div
              key={m._id}
              className="flex items-center justify-between px-4 py-3 bg-[#FAFAF8] dark:bg-[#1A1D27] hover:bg-[#F0EEE8] dark:hover:bg-[#222636] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar name={m.displayName || m.username} src={m.avatar} size="sm" />
                <div>
                  <p className="text-sm font-medium text-[#18192A] dark:text-[#F0EEEA]">
                    {m.displayName || m.username}
                    {m._id === user._id && (
                      <span className="ml-1.5 text-xs text-[#9AA0B8]">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-[#9AA0B8] dark:text-[#5B6180]">@{m.username}</p>
                </div>
              </div>
              {group.admins?.includes(m._id) && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7C5CFF]/10 dark:bg-[#7C5CFF]/20 text-[#7C5CFF]">
                  <Crown size={10} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Admin</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 space-y-2 pt-4 border-t border-[#E9E6DF] dark:border-[#2A2F45]">
        <button
          onClick={handleLeave}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-[#FF5C6B] hover:bg-[#FF5C6B]/10 transition-colors"
        >
          <LogOut size={15} />
          Leave Group
        </button>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-[#FF5C6B] hover:bg-[#FF5C6B]/10 transition-colors"
          >
            <Trash2 size={15} />
            Delete Group
          </button>
        )}
      </div>
    </Modal>
  );
}
