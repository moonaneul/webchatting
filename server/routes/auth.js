const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// 기존 register 라우터
router.post('/register', authController.register);

// ⬇️ 로그인 라우터 추가
router.post('/login', authController.login);

module.exports = router;