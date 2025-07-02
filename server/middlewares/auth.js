// 로그인한 사용자만 접근할 수 있도록 요청에 포함된 JWT 토큰을 검증하는 역할

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: '토큰이 필요합니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded; // 이후 라우터에서 user 정보 사용 가능
        next();
    } catch (err) {
        return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

module.exports = authenticateToken;