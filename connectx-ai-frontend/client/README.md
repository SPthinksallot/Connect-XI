# ConnectX AI — Frontend UI Skeleton

React + Tailwind CSS v4 frontend scaffold for ConnectX AI, a real-time
AI-powered messaging platform. This is the **UI layer only** — it runs on
mock data (`src/data/mockData.js`) and has no backend connection yet.

## What's included

- Three-pane messenger layout: chat list, active conversation, message input
- Dark/light theme toggle (persisted, respects system preference)
- Message bubbles with read receipts, image placeholder, and an inline
  **translation toggle** (Hindi → English) — the AI translation feature surfaced at the message level
- **Smart reply chips** above the input (AI Smart Replies feature)
- **Summarize** button in the chat header opens an AI-generated summary panel
- Typing indicator (simulated)
- Fully responsive-ready Tailwind v4 setup with custom design tokens

## Run it

```bash
cd client
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Design tokens

All colors, fonts, and easing curves live in `src/index.css` under `@theme`.
Accent color is violet (`#6E5BFF`); fonts are Space Grotesk (display),
Inter (body), JetBrains Mono (timestamps/metadata).

## Next steps

This skeleton is built to swap mock data for real data with minimal
rewiring:
- `src/data/mockData.js` → replace with API calls / Socket.io events
- `ChatPage.jsx` currently holds state with `useState` → swap for
  Context/Redux + Socket.io listeners once backend is ready
- `MessageInput`'s voice button and `Paperclip` attach button are UI-only;
  wire to MediaRecorder API and file upload endpoint respectively
