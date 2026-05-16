const router = require('express').Router();
const { nanoid } = require('nanoid');
const Room = require('../models/Room');
const ChatMessage = require('../models/ChatMessage');
const { protect } = require('../middleware/auth');

// POST /api/rooms/create
router.post('/create', protect, async (req, res) => {
  try {
    const { name, language } = req.body;
    const roomId = nanoid(8);
    const room = await Room.create({
      roomId,
      name: name || 'Untitled Room',
      createdBy: req.user.username,
      currentLanguage: language || 'javascript',
    });
    res.status(201).json({ room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rooms/:roomId
router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({ room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rooms/:roomId/chat
router.get('/:roomId/chat', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ roomId: req.params.roomId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rooms/:roomId/save
router.post('/:roomId/save', protect, async (req, res) => {
  try {
    const { code, language, label } = req.body;
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // Save version snapshot
    room.versions.push({ code, language, savedBy: req.user.username, label: label || 'Snapshot' });
    // Keep last 20 versions
    if (room.versions.length > 20) room.versions = room.versions.slice(-20);
    room.currentCode = code;
    room.currentLanguage = language;
    await room.save();
    res.json({ message: 'Saved', versions: room.versions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rooms/:roomId/versions
router.get('/:roomId/versions', protect, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({ versions: room.versions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
