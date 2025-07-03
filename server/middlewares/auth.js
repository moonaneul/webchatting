// /middlewares/auth.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '토큰이 필요합니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

// ✅ 객체로 export (나중에 더 추가해도 유연하게 사용 가능)
module.exports = {
    authenticateToken
};