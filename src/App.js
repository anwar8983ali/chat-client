import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://chat-server-i90b.onrender.com");

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "history") setMessages(msg.data);
      else if (msg.type === "new") setMessages((prev) => [...prev, msg.data]);
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    const newMsg = { sender: "You", text };
    ws.current.send(JSON.stringify(newMsg));
    setText("");
  };

  return (
    <div className="chat-container">
      <h2>Real-Time Chat</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className="chat-msg">
            <b>{msg.sender}</b>: {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
