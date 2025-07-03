// server/routes/chatroom.js
const express = require('express');
const router = express.Router();
const chatroomController = require('../controllers/chatroom');
const { authenticateToken } = require('../middlewares/auth'); // ✅ 수정

// 채팅방 생성 (로그인 필요)
router.post('/', authenticateToken, chatroomController.createRoom);

// 채팅방 목록 조회 (토큰 없이도 가능하게 할 수 있음)
router.get('/', chatroomController.getRooms);

module.exports = router;