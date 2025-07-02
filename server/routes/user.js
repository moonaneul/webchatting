// routes/user.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const authenticateToken = require('../middlewares/auth');

router.get('/me', verifyToken, (req, res) => {
    res.json({ message: '인증된 사용자 정보입니다.', user: req.user });
});

router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: '프로필 정보입니다.', user: req.user });
});

module.exports = router;