# CodeCollab - Real-Time Collaborative Coding Platform

A full-stack real-time collaborative code editor built with the MERN stack and Socket.io.
Multiple users can join a shared room, write code together, chat, and execute code — all live.

---

## Features

- Create / Join rooms by ID
- Real-time collaborative editing (Monaco Editor)
- Multi-language support (JS, TS, Python, Java, C++, Go, Rust, Ruby)
- Live user presence list
- Real-time chat with typing indicators
- Code execution via Judge0 API
- JWT authentication (login / register)
- Save code sessions to MongoDB
- Version history (up to 20 snapshots)
- Restore previous versions
- Docker Compose support

---

## Architecture

```
Browser (React)
  Monaco Editor --> socket.emit('code-change')
  ChatPanel     --> socket.emit('send-message')
        |
        | WebSocket (Socket.io)
        v
Node.js / Express Server
  roomHandler.js --> io.to(roomId).emit(...)
  REST API       --> /api/auth, /api/rooms, /api/execute
        |                        |
        v                        v
   MongoDB                  Judge0 API
Users, Rooms              Code execution
Chat, History
```

**Event flow (code sync):**
1. User A types in editor → `onChange` fires
2. Client emits `code-change` → server receives
3. Server broadcasts `code-update` to all others in the room
4. Their editors update via `isRemoteUpdate` ref guard (prevents echo loop)

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Configure the backend

```bash
cd server
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

### 2. Configure the frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**

---

## Docker Setup

MongoDB only:
```bash
docker-compose up mongodb -d
```

Full containerized:
```bash
docker-compose up --build
```

---

## Environment Variables

### `server/.env`

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/codingplatform` |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `RAPIDAPI_KEY` | Key for Judge0 on RapidAPI | — |
| `JUDGE0_URL` | Judge0 base URL | `https://judge0-ce.p.rapidapi.com` |

### `client/.env`

| Variable | Description | Default |
|---|---|---|
| `VITE_SERVER_URL` | Backend URL | `http://localhost:5000` |

---

## Socket Events

### Client to Server

| Event | Payload | Description |
|---|---|---|
| `join-room` | `{ roomId, username }` | Join a collaborative room |
| `code-change` | `{ roomId, code }` | Broadcast code update |
| `language-change` | `{ roomId, language }` | Change editor language |
| `cursor-move` | `{ roomId, cursor, username, color }` | Broadcast cursor position |
| `send-message` | `{ roomId, username, message }` | Send chat message |
| `typing` | `{ roomId, username, isTyping }` | Typing indicator |
| `save-code` | `{ roomId, code, language, username }` | Save code snapshot |

### Server to Client

| Event | Payload | Description |
|---|---|---|
| `room-state` | `{ code, language, users }` | Initial state on join |
| `code-update` | `{ code }` | Code changed by another user |
| `language-update` | `{ language }` | Language changed |
| `user-joined` | `{ username, socketId, color, users }` | Someone joined |
| `user-left` | `{ username, socketId, users }` | Someone left |
| `chat-message` | `{ type, username, message, timestamp }` | New chat message |
| `user-typing` | `{ username, isTyping }` | Typing indicator |
| `cursor-update` | `{ socketId, cursor, username, color }` | Cursor position |
| `code-saved` | `{ username, timestamp, versions }` | Code snapshot saved |

---

## REST API

### Auth

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | `{ username, email, password }` | No | Create account |
| POST | `/api/auth/login` | `{ email, password }` | No | Login, returns JWT |
| GET | `/api/auth/me` | — | Bearer | Get current user |

### Rooms

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| POST | `/api/rooms/create` | `{ name?, language? }` | Bearer | Create room |
| GET | `/api/rooms/:roomId` | — | No | Get room info |
| GET | `/api/rooms/:roomId/chat` | — | No | Get chat history (last 100) |
| POST | `/api/rooms/:roomId/save` | `{ code, language, label? }` | Bearer | Save code snapshot |
| GET | `/api/rooms/:roomId/versions` | — | Bearer | List version history |

### Execute

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| POST | `/api/execute` | `{ code, language }` | No | Execute code via Judge0 |

---

## Project Structure

```
coding-platform/
├── server/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── ChatMessage.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   └── execute.js
│   ├── socket/roomHandler.js
│   ├── .env.example
│   ├── Dockerfile
│   └── index.js
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── ChatPanel.jsx
│       │   ├── CodeEditor.jsx
│       │   ├── OutputPanel.jsx
│       │   ├── Toolbar.jsx
│       │   └── UserList.jsx
│       ├── context/AuthContext.jsx
│       ├── pages/
│       │   ├── EditorPage.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       ├── utils/api.js
│       ├── App.jsx
│       ├── main.jsx
│       ├── socket.js
│       └── index.css
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Getting Judge0 (Code Execution)

1. Go to https://rapidapi.com/judge0-official/api/judge0-ce
2. Sign up and subscribe (free tier: 50 req/day)
3. Copy your API key and paste in `server/.env` as `RAPIDAPI_KEY`

---

## License

MIT
