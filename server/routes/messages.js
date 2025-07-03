const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getMessages,
    markAsRead,
    updateMessage,
    deleteMessage
} = require('../controllers/messages'); // ✅ 구조분해로 한 번에 import
const { authenticateToken } = require('../middlewares/auth');  // ✅ 토큰 인증 미들웨어

// 메시지 전송
router.post('/', authenticateToken, sendMessage);

// 메시지 목록 조회
router.get('/:conversationId', authenticateToken, getMessages);

// 메시지 읽음 처리
router.patch('/:messageId/read', authenticateToken, markAsRead);

// 메시지 수정
router.patch('/:messageId', authenticateToken, updateMessage);

// 메시지 삭제
router.delete('/:messageId', authenticateToken, deleteMessage);

module.exports = router;