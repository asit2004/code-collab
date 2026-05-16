const Room = require('../models/Room');
const ChatMessage = require('../models/ChatMessage');

// In-memory store for active users per room
// Structure: { roomId: Map<socketId, { username, color, joinedAt }> }
const activeRooms = new Map();

const USER_COLORS = [
  '#FF6B6B','#4ECDC4','#45B7D1','#96CEB4',
  '#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F',
];

function getUserColor(index) {
  return USER_COLORS[index % USER_COLORS.length];
}

function getRoomUsers(roomId) {
  const room = activeRooms.get(roomId);
  if (!room) return [];
  return Array.from(room.values());
}

const registerSocketHandlers = (io, socket) => {

  // --- JOIN ROOM ---
  socket.on('join-room', async ({ roomId, username }) => {
    try {
      socket.join(roomId);
      socket.currentRoom = roomId;
      socket.username = username;

      // Track user in memory
      if (!activeRooms.has(roomId)) activeRooms.set(roomId, new Map());
      const room = activeRooms.get(roomId);
      const color = getUserColor(room.size);
      room.set(socket.id, { socketId: socket.id, username, color, joinedAt: Date.now() });

      // Load current code from DB
      const dbRoom = await Room.findOne({ roomId });
      const currentCode = dbRoom?.currentCode || '// Start coding here...\n';
      const currentLanguage = dbRoom?.currentLanguage || 'javascript';

      // Send current state to the joining user only
      socket.emit('room-state', {
        code: currentCode,
        language: currentLanguage,
        users: getRoomUsers(roomId),
      });

      // Notify everyone else
      socket.to(roomId).emit('user-joined', {
        username,
        socketId: socket.id,
        color,
        users: getRoomUsers(roomId),
      });

      // System message in chat
      io.to(roomId).emit('chat-message', {
        type: 'system',
        message: `${username} joined the room`,
        timestamp: new Date(),
      });

      console.log(`[ROOM] ${username} joined ${roomId} | users: ${room.size}`);
    } catch (err) {
      socket.emit('error', { message: 'Failed to join room' });
      console.error('[ROOM JOIN ERROR]', err);
    }
  });

  // --- CODE CHANGE ---
  // Broadcast to everyone in the room EXCEPT the sender
  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('code-update', { code });
  });

  // --- LANGUAGE CHANGE ---
  socket.on('language-change', ({ roomId, language }) => {
    socket.to(roomId).emit('language-update', { language });
    // Persist language change
    Room.findOneAndUpdate({ roomId }, { currentLanguage: language }).catch(console.error);
  });

  // --- CURSOR POSITION (for showing other users' cursors) ---
  socket.on('cursor-move', ({ roomId, cursor, username, color }) => {
    socket.to(roomId).emit('cursor-update', {
      socketId: socket.id,
      cursor,
      username,
      color,
    });
  });

  // --- CHAT MESSAGE ---
  socket.on('send-message', async ({ roomId, username, message }) => {
    try {
      const chatMessage = await ChatMessage.create({ roomId, username, message, type: 'message' });
      io.to(roomId).emit('chat-message', {
        type: 'message',
        id: chatMessage._id,
        username,
        message,
        timestamp: chatMessage.createdAt,
      });
    } catch (err) {
      console.error('[CHAT ERROR]', err);
    }
  });

  // --- TYPING INDICATOR ---
  socket.on('typing', ({ roomId, username, isTyping }) => {
    socket.to(roomId).emit('user-typing', { username, isTyping });
  });

  // --- CODE SAVE (via socket for real-time feedback) ---
  socket.on('save-code', async ({ roomId, code, language, username }) => {
    try {
      const room = await Room.findOne({ roomId });
      if (!room) return;
      room.versions.push({ code, language, savedBy: username, label: `Saved by ${username}` });
      if (room.versions.length > 20) room.versions = room.versions.slice(-20);
      room.currentCode = code;
      room.currentLanguage = language;
      await room.save();
      io.to(roomId).emit('code-saved', { username, timestamp: new Date(), versions: room.versions });
    } catch (err) {
      console.error('[SAVE ERROR]', err);
    }
  });

  // --- DISCONNECT ---
  socket.on('disconnect', () => {
    const roomId = socket.currentRoom;
    const username = socket.username;
    if (!roomId) return;

    const room = activeRooms.get(roomId);
    if (room) {
      room.delete(socket.id);
      if (room.size === 0) activeRooms.delete(roomId);
    }

    socket.to(roomId).emit('user-left', {
      username,
      socketId: socket.id,
      users: getRoomUsers(roomId),
    });

    io.to(roomId).emit('chat-message', {
      type: 'system',
      message: `${username} left the room`,
      timestamp: new Date(),
    });

    console.log(`[ROOM] ${username} left ${roomId}`);
  });
};

module.exports = { registerSocketHandlers };
