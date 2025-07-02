const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 사용자 존재 확인
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
        }

        const user = users[0];

        // 비밀번호 비교
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
        }

        // JWT 발급
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        res.status(200).json({ message: '로그인 성공', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류', error: err.message });
    }
};
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: '이름, 이메일, 비밀번호는 필수입니다.' });
    }

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: '이미 존재하는 사용자명 또는 이메일입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: '회원가입 성공' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류', error: err.message });
    }
};