const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔽 이 부분이 반드시 있어야 함
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 테스트용
app.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT NOW() AS now');
        res.json({ status: '✅ 연결 성공', now: rows[0].now });
    } catch (err) {
        res.status(500).json({ error: '❌ DB 연결 실패', detail: err.message });
    }
});

app.listen(4000, () => {
    console.log('🟢 서버 실행 중: http://localhost:4000');
});