import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });
  }, []);

  const sendMessage = () => {
    if (message.trim() === '') return;
    socket.emit('send_message', message);
    setMessage('');
  };

  return (
      <div style={{ padding: 20 }}>
        <h2>💬 실시간 채팅</h2>
        <div style={{ border: '1px solid #ccc', height: 200, overflowY: 'scroll', marginBottom: 10 }}>
          {chat.map((msg, i) => <div key={i}>{msg}</div>)}
        </div>
        <input value={message} onChange={e => setMessage(e.target.value)} />
        <button onClick={sendMessage}>보내기</button>
      </div>
  );
}

export default App;