// routes/user.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

router.get('/me', verifyToken, (req, res) => {
    res.json({ message: '인증된 사용자 정보입니다.', user: req.user });
});

module.exports = router;