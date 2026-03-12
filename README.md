<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-EF008F?style=for-the-badge&logo=framer&logoColor=white" />
</p>

<h1 align="center">ChatLo.io</h1>

<p align="center">
  A full-stack real-time chat application built with <strong>WebSockets</strong>, <strong>React</strong>, and <strong>Node.js</strong>.<br/>
  Voice messages · Multiple groups · Live camera · Private DMs · Typing indicators · Dark/light mode
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#%EF%B8%8F-configuration">Configuration</a> •
  <a href="#-message-types">Message Types</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

---

## Features

### Messaging
| Feature | Description |
|---------|-------------|
| **Global Chat** | Broadcast messages to all connected users |
| **Private / Secret Chat** | Direct messages between two users, selectable from the compose menu |
| **Voice Messages** | Record and send audio notes in global, room, or private chats — both sides get a live audio player |
| **Rich Attachments** | Send images, videos, files, polls, and GPS location pins |
| **Live Camera Capture** | Open device camera via `getUserMedia`, preview the feed, capture a photo, and send it |
| **Emoji Picker** | Built-in emoji panel with smooth animation |
| **Typing Indicators** | Real-time "user is typing…" per room with animated dots |

### Groups & Rooms
| Feature | Description |
|---------|-------------|
| **Multiple Groups** | Join and stay in multiple rooms simultaneously — all shown independently in the sidebar |
| **Two-step Group Creation** | Name your group → pick members to invite → create. Invited users receive an interactive invite card |
| **Group Invites (Accept / Dismiss)** | Invite messages render as action cards with **Join Group** and **Dismiss** buttons |
| **Per-room Leave** | Leave any individual room without affecting others |

### UI / UX
| Feature | Description |
|---------|-------------|
| **Dark / Light Mode** | Smooth 300 ms CSS variable transition; preference persisted in `localStorage` |
| **User Profiles** | Avatar (upload or URL), status, banner, and message count |
| **Mute Chats** | Mute any conversation from the header bell icon |
| **Sidebar Search** | Filter chats/users by name in real-time |
| **Responsive** | Desktop three-column layout + mobile bottom-tab navigation |
| **Framer Motion** | Page-level and per-message animations, modal transitions, dropdown fade-slides |

### Backend
| Feature | Description |
|---------|-------------|
| **Rate Limiting** | Sliding-window throttle to prevent spam |
| **Input Sanitization** | Strips HTML, enforces length limits on text and audio (~1.5 MB cap) |
| **Heartbeat** | Ping/pong to detect and clean up dead connections |
| **JWT Auth** | Optional token-based authentication on connection |
| **Timestamps** | ISO timestamps on every message |

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/qzMalekuz/ChatLo.io.git
cd ChatLo.io

# Install backend dependencies
cd BE && npm install

# Install frontend dependencies
cd ../FE && npm install
```

### Run

```bash
# Terminal 1 — Backend
cd BE
# create BE/.env if missing (example below in Configuration)
npm run dev

# Terminal 2 — Frontend
cd FE
npm run dev
```

| Service | URL |
|---------|-----|
| Backend (WebSocket) | `ws://localhost:3000` |
| Frontend (React) | `http://localhost:5173` |

Open **http://localhost:5173** in your browser to start chatting.

---

## 📁 Project Structure

```
ChatLo.io/
├── README.md
├── .gitignore
│
├── BE/                              ← Backend (Node.js + ws)
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   ├── scripts/
│   │   └── generateToken.ts         ← JWT token generator CLI
│   └── src/
│       ├── server.ts                ← WebSocket entry point
│       ├── config/index.ts          ← Env config
│       ├── types/index.ts           ← Shared TypeScript interfaces
│       ├── utils/
│       │   ├── send.ts              ← sendJson / sendError helpers
│       │   ├── validate.ts          ← Sanitization & validation
│       │   └── rateLimit.ts         ← Sliding-window rate limiter
│       ├── middleware/
│       │   ├── auth.ts              ← JWT verification
│       │   └── heartbeat.ts         ← Ping/pong health checks
│       ├── services/
│       │   ├── userService.ts       ← User CRUD (in-memory, multi-room)
│       │   ├── chatService.ts       ← Broadcast & private/voice messaging
│       │   └── roomService.ts       ← Multi-room management (Set-based)
│       └── handlers/
│           ├── connectionHandler.ts ← Connection lifecycle
│           └── messageHandler.ts    ← Message routing & dispatch
│
└── FE/                              ← Frontend (React + Tailwind v4 + Framer Motion)
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx                 ← Entry point
        ├── App.tsx                  ← Layout + dark/light mode toggle
        ├── index.css                ← CSS variable palette + global transition
        ├── types.ts                 ← Frontend types
        ├── context/
        │   └── ChatContext.tsx      ← WebSocket state + multi-room + voice
        └── components/
            ├── ChatsSidebar.tsx     ← Sidebar: all joined rooms, DMs, search
            ├── ChatArea.tsx         ← Messages, voice recorder, camera, attachments
            ├── ProfileModal.tsx     ← User profile editor
            └── Toast.tsx            ← Error notifications
```

---

## Configuration

All backend settings live in `BE/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | WebSocket server port |
| `JWT_SECRET` | `default-secret` | JWT signing key |
| `AUTH_ENABLED` | `false` | Require JWT to connect |
| `RATE_LIMIT_WINDOW_MS` | `10000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX_MESSAGES` | `10` | Max messages per window |
| `MAX_MESSAGE_LENGTH` | `500` | Max characters per message |
| `MAX_USERNAME_LENGTH` | `20` | Max characters for usernames |
| `HEARTBEAT_INTERVAL_MS` | `30000` | Ping interval (ms) |
| `MAX_RAW_MESSAGE_BYTES` | `2100000` | Max incoming raw message size before parse |
| `MAX_STATUS_LENGTH` | `100` | Max characters for profile status |
| `MAX_ROOM_NAME_LENGTH` | `32` | Max room name length |
| `WS_MAX_CONNECTIONS_PER_IP` | `25` | Simultaneous WebSocket connections per IP |
| `WS_MAX_CONNECTIONS_PER_USER` | `3` | Simultaneous sessions for one authenticated username |
| `WS_MAX_PAYLOAD_BYTES` | `2000000` | WebSocket frame payload limit (`ws` server) |
| `WS_ALLOWED_ORIGINS` | `` | Comma-separated allowed WS origins; empty allows all |

Example `BE/.env`:

```env
PORT=3000
JWT_SECRET=default-secret
AUTH_ENABLED=false
RATE_LIMIT_WINDOW_MS=10000
RATE_LIMIT_MAX_MESSAGES=10
MAX_MESSAGE_LENGTH=500
MAX_USERNAME_LENGTH=20
HEARTBEAT_INTERVAL_MS=30000
MAX_RAW_MESSAGE_BYTES=2100000
MAX_STATUS_LENGTH=100
MAX_ROOM_NAME_LENGTH=32
WS_MAX_CONNECTIONS_PER_IP=25
WS_MAX_CONNECTIONS_PER_USER=3
WS_MAX_PAYLOAD_BYTES=2000000
WS_ALLOWED_ORIGINS=
```

Frontend optional env (in `FE/.env`):

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_WS_URL` | `ws://localhost:3000` | Overrides auto-detected WebSocket URL |

---

## Message Types

All messages follow: `{ "type": "...", "payload": { ... } }`

### Client → Server

| Type | Payload | Description |
|------|---------|-------------|
| `CHAT` | `{ text }` | Global message |
| `SET_USERNAME` | `{ username }` | Change display name |
| `UPDATE_PROFILE` | `{ status?, avatarUrl? }` | Update profile |
| `PRIVATE_CHAT` | `{ to, text }` | Direct message |
| `ROOM_JOIN` | `{ room }` | Join a room (multi-room supported) |
| `ROOM_LEAVE` | `{ room? }` | Leave a specific room (or all if omitted) |
| `ROOM_CHAT` | `{ text, room? }` | Message a specific room |
| `GET_USERS` | `{}` | Request online users |
| `ROOM_MEMBERS` | `{ room }` | Request room members |
| `TYPING_START` | `{ room? }` | Started typing |
| `TYPING_STOP` | `{ room? }` | Stopped typing |
| `VOICE_CHAT` | `{ audioData, duration }` | Global voice message (base64) |
| `ROOM_VOICE` | `{ audioData, duration, room? }` | Room voice message |
| `PRIVATE_VOICE` | `{ to, audioData, duration }` | Private voice message |

### Server → Client

| Type | When |
|------|------|
| `CHAT` | Global message received |
| `USER_JOINED` / `USER_LEFT` | User connected/disconnected |
| `USERNAME_CHANGED` | Someone changed their name |
| `USER_UPDATED` | Profile update broadcast |
| `PRIVATE_CHAT` | DM received |
| `ROOM_NOTIFICATION` | Room join/leave event |
| `ROOM_CHAT` | Room message (includes `room` field) |
| `VOICE_CHAT` / `ROOM_VOICE` / `PRIVATE_VOICE` | Voice message received |
| `USER_LIST` | Response to `GET_USERS` |
| `ROOM_MEMBERS` | Response to `ROOM_MEMBERS` |
| `TYPING_START` / `TYPING_STOP` | Typing indicator |
| `ERROR` | Validation/rate limit error |

---

## Tech Stack

### Backend
| Technology | Role |
|-----------|------|
| **Node.js** | Runtime |
| **TypeScript** | Type safety |
| **ws** | Raw WebSocket server |
| **Express** | HTTP upgrade & static routes |
| **jsonwebtoken** | Optional JWT authentication |
| **dotenv** | Environment configuration |

### Frontend
| Technology | Role |
|-----------|------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling with CSS variable design tokens |
| **Framer Motion** | Animations, modal transitions, message enter/exit |
| **Vite** | Dev server & bundler |
| **MediaRecorder API** | Voice message recording |
| **getUserMedia API** | Live camera capture |

---

## Scripts

### Backend (`BE/`)

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start backend with `ts-node` |
| Build | `npm run build` | Compile to `dist/` |
| Start | `npm start` | Run compiled build |
| Token | `npm run generate-token -- <name>` | Generate JWT |

### Frontend (`FE/`)

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Vite dev server (port 5173) |
| Build | `npm run build` | Production build |
| Preview | `npm run preview` | Preview production build |

---

<p align="center">
  Made with ❤️ using WebSockets + React
</p>
