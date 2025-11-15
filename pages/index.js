
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");

  async function send() {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text })
    });
    const data = await res.json();
    setReply(data.text);
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Apptivate AI Marketing</h1>
      <textarea rows={4} style={{ width: "100%" }} value={text} onChange={e => setText(e.target.value)} />
      <button onClick={send} style={{ marginTop: 10 }}>Send</button>
      <pre style={{ marginTop: 20 }}>{reply}</pre>
    </div>
  );
}
