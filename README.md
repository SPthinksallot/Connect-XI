# ConnectX AI — Modern AI-Powered Messaging Platform

![ConnectX AI Banner](https://via.placeholder.com/1200x400/6E5BFF/ffffff?text=ConnectX+AI)

ConnectX AI is a full-stack, real-time messaging application featuring AI-powered smart replies, chat summarization, language translation, and voice-to-text functionality. Built for a final-year engineering portfolio, it is designed with performance, scalability, and modern UI/UX in mind.

## 🚀 Features

- **Real-Time Messaging:** Instant delivery and read receipts via Socket.io.
- **Group Chats:** Create groups, add members, and manage admins.
- **Media Sharing:** Send images, videos, audio, and documents (powered by Cloudinary).
- **AI Smart Replies:** Context-aware reply suggestions (powered by OpenRouter/GPT-4o Mini).
- **AI Chat Summarization:** Summarize long conversations in bullet points.
- **AI Translation:** Seamless English-Hindi translation of messages.
- **Voice Notes:** Record audio with real-time Web Speech API transcription.
- **Semantic Search:** Search across users and message content.
- **Push Notifications:** Web Push API support.
- **Modern UI/UX:** Built with Tailwind CSS, supporting dark/light themes.

## 🛠 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Zustand, Socket.io-client, React Router.
- **Backend:** Node.js, Express, Socket.io, JWT Authentication.
- **Database:** MongoDB (Mongoose), MongoDB Atlas Search.
- **AI & Services:** OpenRouter API, Cloudinary, Web Push API, Web Speech API.
- **DevOps:** Docker & Docker Compose.

## 🏗 Architecture

```mermaid
graph TD
    Client[Client Browser (React + Zustand)]
    CDN[Vercel CDN / Static Hosting]
    API[Express REST API]
    Socket[Socket.io Server]
    DB[(MongoDB Atlas)]
    Cloudinary[Cloudinary]
    OpenRouter[OpenRouter AI]

    Client <-->|HTTPS| CDN
    Client <-->|REST| API
    Client <-->|WebSockets| Socket
    API <-->|Mongoose| DB
    Socket <-->|Mongoose| DB
    API -->|Uploads| Cloudinary
    API <-->|Prompts & Completions| OpenRouter
```

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- Docker & Docker Compose (optional)
- MongoDB URI
- Cloudinary API Keys
- OpenRouter API Key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/connectx-ai.git
cd connectx-ai
```

### 2. Environment Variables
Copy `.env.example` to `.env` in the `backend/` directory and fill in your keys:
```bash
cd backend
cp .env.example .env
```

### 3. Run with Docker Compose
```bash
# From the root directory
docker-compose up --build
```
- Frontend will be available at `http://localhost:5173`
- Backend API at `http://localhost:5000`

### 4. Run Manually

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd connectx-ai-frontend/client
npm install
npm run dev
```

## 🔒 Security Best Practices Implemented
- JWT access (short-lived) and refresh tokens (httpOnly cookies).
- Password hashing with bcrypt (12 salt rounds).
- Rate limiting for Auth and AI routes.
- Helmet.js for security headers.
- MongoDB injection sanitization.
- Socket.io JWT handshake validation.

## 📝 License
This project is open-source and available under the MIT License.
