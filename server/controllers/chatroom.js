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
// 모든 채팅방 목록 조회
exports.getRooms = async (req, res) => {
    try {
        const [rooms] = await db.query(`
            SELECT r.id, r.name, r.created_at, u.username AS created_by
            FROM chat_rooms r
            JOIN users u ON r.created_by = u.id
            ORDER BY r.created_at DESC
    `   );

        res.status(200).json({ rooms });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '채팅방 목록 조회 실패', error: err.message });
    }
};