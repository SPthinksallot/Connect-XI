import { Search, Sparkles, Phone, Video, MoreVertical } from "lucide-react";
import Avatar from "../common/Avatar";

export default function ChatWindowHeader({ contact, onSummarize, onSearch }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-200/10 px-5 py-3">
      <div className="flex items-center gap-3">
        <Avatar
          name={contact.displayName}
          initials={contact.initials}
          showStatus={!contact.isGroup}
          status={contact.status}
        />
        <div>
          <p className="font-medium leading-tight">{contact.displayName}</p>
          <p className="text-xs leading-tight text-ink-400">
            {contact.isGroup
              ? `${contact.memberCount} members`
              : contact.status === "online"
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onSearch}
          aria-label="Search in conversation"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 dark:text-paper-200 dark:hover:bg-ink-800"
        >
          <Search className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={onSummarize}
          aria-label="Summarize conversation with AI"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-violet-500 transition-colors hover:bg-violet-500/10"
        >
          <Sparkles className="h-4 w-4" />
          Summarize
        </button>
        <button
          aria-label="Voice call"
          className="hidden h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 sm:flex dark:text-paper-200 dark:hover:bg-ink-800"
        >
          <Phone className="h-4.5 w-4.5" />
        </button>
        <button
          aria-label="Video call"
          className="hidden h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 sm:flex dark:text-paper-200 dark:hover:bg-ink-800"
        >
          <Video className="h-4.5 w-4.5" />
        </button>
        <button
          aria-label="More options"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 dark:text-paper-200 dark:hover:bg-ink-800"
        >
          <MoreVertical className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
