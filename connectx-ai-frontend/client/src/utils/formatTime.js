/**
 * Format a message timestamp for the chat list (sidebar).
 * Returns "HH:mm" for today, "Yesterday" for yesterday, or "dd/MM/yy" for older.
 */
export const formatChatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  
  const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  if (isYesterday) return "Yesterday";
  
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

/**
 * Format a message bubble timestamp.
 */
export const formatMessageTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

/**
 * Format "last seen" status (Simplified native JS version).
 */
export const formatLastSeen = (dateStr) => {
  if (!dateStr) return "a while ago";
  const date = new Date(dateStr);
  const diffInSeconds = Math.floor((new Date() - date) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

/**
 * Format voice note duration (seconds → "m:ss").
 */
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/**
 * Format file size (bytes → "X.X MB").
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Group messages by date for date dividers.
 */
export const groupMessagesByDate = (messages) => {
  const groups = [];
  let currentDate = null;

  messages.forEach((msg) => {
    const date = new Date(msg.createdAt);
    const now = new Date();
    
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

    let label;
    if (isToday) label = "Today";
    else if (isYesterday) label = "Yesterday";
    else label = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    if (label !== currentDate) {
      currentDate = label;
      groups.push({ type: "date", label, key: label });
    }
    groups.push({ type: "message", data: msg, key: msg._id });
  });

  return groups;
};
