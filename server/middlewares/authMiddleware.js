// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 헤더에 토큰이 없으면 거부
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '인증 토큰이 없습니다.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded; // 사용자 정보(req.user)에 저장
        next(); // 다음 미들웨어 또는 컨트롤러 실행
    } catch (err) {
        return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

module.exports = verifyToken;