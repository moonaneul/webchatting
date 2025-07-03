// server/controllers/messages.js
const db = require('../config/db');

exports.sendMessage = async (req, res) => {
    const { conversation_id, content, message_type = 'text' } = req.body;
    const sender_id = req.user.id;

    if (!conversation_id || !content) {
        return res.status(400).json({ message: 'conversation_id와 content는 필수입니다.' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO messages (conversation_id, sender_id, content, message_type)
             VALUES (?, ?, ?, ?)`,
            [conversation_id, sender_id, content, message_type]
        );

        res.status(201).json({
            message: '메시지 전송 성공',
            message_id: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '메시지 전송 실패', error: err.message });
    }
};
exports.getMessages = async (req, res) => {
    const conversation_id = req.params.conversationId;
    const user_id = req.user.id;

    try {
        // 해당 대화방에 속해있는지 확인 (보안)
        const [conversations] = await db.query(
            `SELECT * FROM conversations 
             WHERE id = ? AND (user1_id = ? OR user2_id = ?)`,
            [conversation_id, user_id, user_id]
        );

        if (conversations.length === 0) {
            return res.status(403).json({ message: '이 대화방에 접근 권한이 없습니다.' });
        }

        // 메시지 가져오기
        const [messages] = await db.query(
            `SELECT m.*, u.username AS sender_username
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.conversation_id = ?
             ORDER BY m.created_at ASC`,
            [conversation_id]
        );

        res.status(200).json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '메시지 조회 실패', error: err.message });
    }
};