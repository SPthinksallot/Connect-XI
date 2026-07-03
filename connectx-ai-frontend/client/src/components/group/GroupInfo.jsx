import React from "react";
import Modal from "../common/Modal";
import Avatar from "../common/Avatar";
import { Users, LogOut, Trash2 } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import { groupApi } from "../../api/chatApi";
import useChatStore from "../../store/useChatStore";

export default function GroupInfo({ group, onClose }) {
  const { user } = useAuthStore();
  const { setActiveChat } = useChatStore();

  const isAdmin = group.admins?.includes(user._id);

  const handleLeave = async () => {
    if (confirm("Are you sure you want to leave this group?")) {
      try {
        await groupApi.removeMember(group._id, user._id);
        setActiveChat(null);
        onClose();
      } catch (err) {
         console.error(err);
      }
    }
  };

  const handleDelete = async () => {
      if (confirm("Are you sure you want to delete this group for everyone? This cannot be undone.")) {
          try {
              await groupApi.deleteGroup(group._id);
              setActiveChat(null);
              onClose();
          } catch(err) {
              console.error(err);
          }
      }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Group Info" size="md">
      <div className="flex flex-col items-center mb-6">
        <Avatar name={group.name} src={group.avatar} size="xl" className="mb-4" />
        <h2 className="text-xl font-bold text-paper-50">{group.name}</h2>
        {group.description && <p className="text-ink-400 text-sm mt-2 text-center max-w-sm">{group.description}</p>}
        <p className="text-ink-500 text-xs mt-2">{group.members?.length} participants</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ink-300 uppercase tracking-wider mb-2">Members</h3>
          <div className="bg-ink-800 rounded-xl overflow-hidden border border-ink-700">
            {group.members?.map(m => (
              <div key={m._id} className="flex items-center justify-between px-4 py-3 border-b border-ink-700 last:border-0">
                <div className="flex items-center gap-3">
                  <Avatar name={m.displayName || m.username} src={m.avatar} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-paper-50">{m.displayName || m.username} {m._id === user._id && "(You)"}</p>
                    <p className="text-xs text-ink-500">@{m.username}</p>
                  </div>
                </div>
                {group.admins?.includes(m._id) && (
                  <span className="text-[10px] font-bold text-mint-500 bg-mint-500/10 px-2 py-1 rounded border border-mint-500/20">ADMIN</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-2">
           <button 
                onClick={handleLeave}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-coral-500 hover:bg-coral-500/10 rounded-xl transition-colors font-medium text-sm"
            >
               <LogOut size={16} /> Leave Group
           </button>
           {isAdmin && group.admin === user._id && (
               <button 
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-coral-500 hover:bg-coral-500/10 rounded-xl transition-colors font-medium text-sm"
                >
                   <Trash2 size={16} /> Delete Group
               </button>
           )}
        </div>
      </div>
    </Modal>
  );
}
