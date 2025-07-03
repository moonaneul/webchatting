const express = require('express');
const router = express.Router();
const conversationsController = require('../controllers/conversations');
const { authenticateToken } = require('../middlewares/auth');

// POST /api/conversations - 대화 생성 (로그인 필요)
router.post('/', authenticateToken, conversationsController.createConversation);

// GET /api/conversations - 대화 목록 조회 (사용자별)
router.get('/', authenticateToken, conversationsController.getUserConversations);

module.exports = router;