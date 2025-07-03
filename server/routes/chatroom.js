// server/routes/chatroom.js
const express = require('express');
const router = express.Router();
const chatroomController = require('../controllers/chatroom');
const authenticateToken = require('../middlewares/auth');

// 채팅방 생성 (로그인 필요)
router.post('/', authenticateToken, chatroomController.createRoom);

module.exports = router;