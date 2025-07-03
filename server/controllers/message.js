// server/controllers/message.js
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