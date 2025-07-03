// ✅ routes/messages.js
const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsRead } = require('../controllers/messages'); // ✅ 구조분해로 한 번에 가져옴
const { authenticateToken } = require('../middlewares/auth');  // ✅ 미들웨어 함수 확인
const { updateMessage } = require('../controllers/messages');

// 메시지 전송
router.post('/', authenticateToken, sendMessage);

// 메시지 목록 조회
router.get('/:conversationId', authenticateToken, getMessages);

// 메시지 읽음 처리
router.patch('/:messageId/read', authenticateToken, markAsRead);

router.patch('/:messageId', authenticateToken, updateMessage);

module.exports = router;