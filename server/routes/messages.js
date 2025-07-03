// ✅ routes/messages.js
const express = require('express');
const router = express.Router();

const { sendMessage } = require('../controllers/messages');  // ✅ 구조분해 잘 했는지
const { authenticateToken } = require('../middlewares/auth');  // ✅ 미들웨어가 함수인지

router.post('/', authenticateToken, sendMessage);

const { getMessages } = require('../controllers/messages');

// GET /api/messages/:conversationId
router.get('/:conversationId', authenticateToken, getMessages);

module.exports = router;