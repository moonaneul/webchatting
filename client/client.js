const { io } = require('socket.io-client');

// 서버 주소 (포트 맞게 수정)
const socket = io('http://localhost:4000');

// 방 번호와 유저 ID (테스트용)
const roomId = 1;
const senderId = 5;

// 1. 방에 참여
socket.emit('joinRoom', roomId);
console.log(`🚪 방 ${roomId}에 참가했습니다.`);

// 2. 메시지 수신 리스너
socket.on('receiveMessage', (msg) => {
    console.log('📥 새 메시지 도착:', msg);
});

// 3. 일정 시간 후 메시지 전송 (3초 후)
setTimeout(() => {
    const message = {
        roomId,
        senderId,
        content: '👋 안녕하세요! (Node.js 테스트)',
    };

    socket.emit('sendMessage', message);
    console.log('✉️ 메시지 전송:', message);
}, 3000);