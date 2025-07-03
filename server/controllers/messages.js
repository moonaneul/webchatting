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
exports.markAsRead = async (req, res) => {
    const messageId = req.params.messageId;
    const userId = req.user.id;

    try {
        // 메시지가 존재하는지 확인
        const [messages] = await db.query('SELECT * FROM messages WHERE id = ?', [messageId]);
        if (messages.length === 0) {
            return res.status(404).json({ message: '메시지를 찾을 수 없습니다.' });
        }

        // 이미 읽은 메시지면 무시 (선택사항)
        if (messages[0].is_read === 1) {
            return res.status(200).json({ message: '이미 읽은 메시지입니다.' });
        }

        // 메시지를 읽음으로 표시
        await db.query('UPDATE messages SET is_read = 1 WHERE id = ?', [messageId]);

        res.status(200).json({ message: '메시지를 읽음 처리했습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류', error: err.message });
    }
};

// 메시지 수정
exports.updateMessage = async (req, res) => {
    const messageId = req.params.messageId;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: '내용이 필요합니다.' });
    }

    try {
        // 수정하려는 메시지가 사용자 본인의 것인지 확인
        const [rows] = await db.query('SELECT * FROM messages WHERE id = ?', [messageId]);
        const message = rows[0];

        if (!message) {
            return res.status(404).json({ message: '메시지를 찾을 수 없습니다.' });
        }

        if (message.sender_id !== userId) {
            return res.status(403).json({ message: '수정 권한이 없습니다.' });
        }

        await db.query(
            `UPDATE messages 
             SET content = ?, is_edited = 1, edited_at = NOW() 
             WHERE id = ?`,
            [content, messageId]
        );

        res.status(200).json({ message: '메시지가 수정되었습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '메시지 수정 실패', error: err.message });
    }
};