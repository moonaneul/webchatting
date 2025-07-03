// index.js
const express = require('express');
const cors = require('cors');
const http = require('http'); // ✅ socket.io용 http 모듈
const { Server } = require('socket.io'); // ✅ socket.io 서버 생성자
const db = require('./config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // ✅ Express 앱으로 http 서버 생성
const io = new Server(server, {
    cors: {
        origin: '*', // 프론트엔드 주소로 변경 가능
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
});

// ✅ socket.io 연결
io.on('connection', (socket) => {
    console.log('✅ 유저 연결됨');

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`🔔 유저가 ${roomId} 방에 입장`);
    });

    socket.on('sendMessage', async ({ roomId, senderId, content, messageType = 'text', fileUrl = null }) => {
        try {
            // 1. DB에 저장
            const [result] = await db.query(
                `INSERT INTO messages (conversation_id, sender_id, content, message_type, file_url)
                 VALUES (?, ?, ?, ?, ?)`,
                [roomId, senderId, content, messageType, fileUrl]
            );

            const message = {
                id: result.insertId,
                conversation_id: roomId,
                sender_id: senderId,
                content,
                message_type: messageType,
                file_url: fileUrl,
                created_at: new Date(),
            };

            // 2. 전체 유저에게 전송
            io.to(roomId).emit('receiveMessage', message);
            console.log('📩 메시지 전송됨:', message);

        } catch (err) {
            console.error('❌ 메시지 저장 실패:', err);
            socket.emit('error', { message: '메시지 저장 실패', detail: err.message });
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ 연결 종료:', socket.id);
    });
});

// ✅ 미들웨어
app.use(cors());
app.use(express.json());

// ✅ 라우터
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const conversationRoutes = require('./routes/conversations');
app.use('/api/conversations', conversationRoutes);

const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);

// ✅ 테스트용 API
app.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT NOW() AS now');
        res.json({ status: '✅ 연결 성공', now: rows[0].now });
    } catch (err) {
        res.status(500).json({ error: '❌ DB 연결 실패', detail: err.message });
    }
});

// ✅ 서버 실행 (app → server)
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🟢 서버 실행 중: http://localhost:${PORT}`);
});