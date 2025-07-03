const db = require('../config/db');

// 대화 생성
exports.createConversation = async (req, res) => {
    const user1_id = req.user.id;
    const { user2_id } = req.body;

    if (!user2_id) {
        return res.status(400).json({ message: '상대 사용자 ID가 필요합니다.' });
    }

    try {
        const [existing] = await db.query(
            'SELECT * FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
            [user1_id, user2_id, user2_id, user1_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: '이미 존재하는 대화입니다.' });
        }

        const [result] = await db.query(
            'INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)',
            [user1_id, user2_id]
        );

        res.status(201).json({ message: '대화가 생성되었습니다.', conversationId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '대화 생성 실패', error: err.message });
    }
};

// 대화 목록 조회
exports.getUserConversations = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.query(
            `
                SELECT c.id, c.created_at, u1.username AS user1, u2.username AS user2
                FROM conversations c
                         JOIN users u1 ON c.user1_id = u1.id
                         JOIN users u2 ON c.user2_id = u2.id
                WHERE c.user1_id = ? OR c.user2_id = ?
                ORDER BY c.updated_at DESC
            `,
            [userId, userId]
        );

        res.status(200).json({ conversations: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '대화 목록 조회 실패', error: err.message });
    }
};