// ✅ routes/messages.js
const express = require('express');
const router = express.Router();

const { sendMessage } = require('../controllers/message');  // ✅ 구조분해 잘 했는지
const { authenticateToken } = require('../middlewares/auth');  // ✅ 미들웨어가 함수인지

router.post('/', authenticateToken, sendMessage);

module.exports = router;