// server/controllers/chatroom.js
const db = require('../config/db');

exports.createRoom = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ message: '채팅방 이름을 입력하세요.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO chat_rooms (name, created_by) VALUES (?, ?)',
            [name, userId]
        );

        res.status(201).json({
            message: '채팅방 생성 완료',
            roomId: result.insertId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '채팅방 생성 실패', error: err.message });
    }
};