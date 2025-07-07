import React, { useState, useEffect, useRef } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [inputName, setInputName] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    if (name) {
      ws.current = new WebSocket("wss://chat-server-i90b.onrender.com");

      ws.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "history") {
          setMessages(msg.data);
        } else if (msg.type === "new") {
          setMessages((prev) => [...prev, msg.data]);
        }
      };

      return () => ws.current.close();
    }
  }, [name]);

  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        name,
        text: input,
      };
      ws.current.send(JSON.stringify(message));
      setInput("");
    }
  };

  if (!name) {
    return (
      <div style={styles.container}>
        <h2>Enter your name to start chatting</h2>
        <input
          type="text"
          placeholder="Your name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          style={styles.input}
        />
        <button onClick={() => setName(inputName)} style={styles.button}>
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div style={styles.chatBox}>
      <h2>Welcome, {name}</h2>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={styles.message}>
            <strong style={{ color: "#007bff" }}>{msg.name}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "100px auto",
    textAlign: "center",
  },
  chatBox: {
    maxWidth: 600,
    margin: "0 auto",
    padding: 20,
    fontFamily: "sans-serif",
  },
  messages: {
    height: 400,
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: 10,
    marginBottom: 10,
  },
  message: {
    marginBottom: 8,
  },
  inputBox: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default App;

