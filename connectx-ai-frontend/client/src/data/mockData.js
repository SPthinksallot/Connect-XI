// Mock data — stands in for API/Socket responses during UI development.
// Swap each of these for real fetch/socket calls once the backend is wired up.

export const currentUser = {
  id: "u1",
  username: "aarav.sh",
  displayName: "Aarav Sharma",
  avatar: null,
  initials: "AS",
  status: "online",
  preferredLanguage: "en",
};

export const contacts = [
  {
    id: "u2",
    displayName: "Priya Verma",
    initials: "PV",
    status: "online",
    lastSeen: null,
    isGroup: false,
  },
  {
    id: "u3",
    displayName: "Rohan Mehta",
    initials: "RM",
    status: "offline",
    lastSeen: "2026-06-19T01:40:00Z",
    isGroup: false,
  },
  {
    id: "g1",
    displayName: "Capstone Team",
    initials: "CT",
    status: null,
    isGroup: true,
    memberCount: 5,
  },
  {
    id: "u4",
    displayName: "Neha Kulkarni",
    initials: "NK",
    status: "online",
    lastSeen: null,
    isGroup: false,
  },
  {
    id: "u5",
    displayName: "Dev Patel",
    initials: "DP",
    status: "offline",
    lastSeen: "2026-06-18T22:10:00Z",
    isGroup: false,
  },
];

export const chats = [
  {
    id: "c1",
    contactId: "u2",
    lastMessage: { text: "Bhej do woh design file jab free ho", sender: "u2", createdAt: "2026-06-19T03:12:00Z" },
    unreadCount: 2,
  },
  {
    id: "c2",
    contactId: "g1",
    lastMessage: { text: "Demo day is confirmed for the 24th", sender: "u4", createdAt: "2026-06-19T02:55:00Z" },
    unreadCount: 0,
  },
  {
    id: "c3",
    contactId: "u3",
    lastMessage: { text: "Sounds good, talk tomorrow", sender: "u1", createdAt: "2026-06-18T19:30:00Z" },
    unreadCount: 0,
  },
  {
    id: "c4",
    contactId: "u4",
    lastMessage: { text: "Pushed the embedding service, can you review?", sender: "u4", createdAt: "2026-06-18T17:05:00Z" },
    unreadCount: 0,
  },
  {
    id: "c5",
    contactId: "u5",
    lastMessage: { text: "Voice note · 0:42", sender: "u5", contentType: "audio", createdAt: "2026-06-17T11:20:00Z" },
    unreadCount: 0,
  },
];

// Active conversation thread for chat c1 (Priya), includes a Hindi message
// to demonstrate the translation toggle, and trailing context for smart replies.
export const activeThreadMessages = [
  {
    id: "m1",
    chatId: "c1",
    sender: "u2",
    contentType: "text",
    text: "Hey! Kal ka design review kaisa raha?",
    translatedText: { en: "Hey! How did yesterday's design review go?" },
    status: "read",
    createdAt: "2026-06-19T02:40:00Z",
  },
  {
    id: "m2",
    chatId: "c1",
    sender: "u1",
    contentType: "text",
    text: "Pretty good actually — the AI rail concept landed well with the panel.",
    status: "read",
    createdAt: "2026-06-19T02:42:00Z",
  },
  {
    id: "m3",
    chatId: "c1",
    sender: "u2",
    contentType: "text",
    text: "Amazing! Did they have notes on the smart-reply chips?",
    translatedText: null,
    status: "read",
    createdAt: "2026-06-19T02:43:00Z",
  },
  {
    id: "m4",
    chatId: "c1",
    sender: "u1",
    contentType: "image",
    mediaUrl: "placeholder",
    text: "",
    status: "read",
    createdAt: "2026-06-19T02:50:00Z",
  },
  {
    id: "m5",
    chatId: "c1",
    sender: "u2",
    contentType: "text",
    text: "Bhej do woh design file jab free ho",
    translatedText: { en: "Send over that design file whenever you're free" },
    status: "delivered",
    createdAt: "2026-06-19T03:12:00Z",
  },
];

export const smartReplySuggestions = [
  "Sure, sending it now!",
  "Give me 10 minutes",
  "Already on its way 👍",
];

export const chatSummaryExample = {
  range: "Last 24 hours",
  bullets: [
    "Priya confirmed the design review went well; panel liked the AI rail concept.",
    "Action item: share the Figma file with Priya.",
    "No blockers reported for this week's sprint.",
  ],
};
