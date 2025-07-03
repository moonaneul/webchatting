// server/controllers/user.js

exports.getMe = async (req, res) => {
    try {
        // 토큰에서 추출된 사용자 정보는 req.user에 있음
        const { id, username } = req.user;

        res.status(200).json({
            message: '사용자 정보 조회 성공',
            user: {
                id,
                username
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류', error: err.message });
    }
};