import React, { useState, useEffect, useRef } from "react";
import "./ChatArea.css";

const WELCOME_PROMPTS = [
  "What should I eat before a morning workout?",
  "Give me a 3-day meal plan for weight loss",
  "What are high-protein vegetarian foods?",
  "How do I reduce sugar cravings?",
];

export default function ChatArea() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported in this browser");
    const rec = new SR();
    rec.lang = "en-US";
    rec.start();
    setIsListening(true);
    rec.onresult = (e) => setInput((p) => (p + " " + e.results[0][0].transcript).trim());
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
  };

  const getAIResponse = async (message, history) => {
    try {
      const msgs = history.map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text }));
      msgs.push({ role: "user", content: message });

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "You are a friendly Healthy Eating Assistant. Give short, simple, practical advice about food, diet, and health. Keep responses under 4 sentences. Be warm and encouraging." },
            ...msgs,
          ],
        }),
      });
      const data = await res.json();
      return data?.choices?.[0]?.message?.content || "No response.";
    } catch {
      return "Something went wrong ⚠️";
    }
  };

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMsg = { sender: "user", text: msg, id: Date.now() };
    setMessages((prev) => {
      const next = [...prev, userMsg];
      return next;
    });
    setLoading(true);

    setMessages((prev) => [...prev, { sender: "bot", text: "...", loading: true, id: Date.now() + 1 }]);

    const history = messages.filter((m) => !m.loading);
    const reply = await getAIResponse(msg, history);

    setMessages((prev) => [
      ...prev.filter((m) => !m.loading),
      { sender: "bot", text: reply, id: Date.now() + 2 },
    ]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        className={`chat-fab ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!isOpen && <span className="fab-pulse" />}
      </button>

      {/* Chat window */}
      <div className={`chat-window ${isOpen ? "visible" : ""}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">🌿</div>
            <div>
              <div className="chat-header-name">Healthy AI</div>
              <div className="chat-header-status">
                <span className="online-dot" />
                Online · Llama 3.1
              </div>
            </div>
          </div>
          <button className="chat-close" onClick={() => setIsOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <div className="welcome-emoji">🥑</div>
              <h3>How can I help you eat healthier?</h3>
              <p>Ask me anything about nutrition, meal planning, or healthy habits.</p>
              <div className="quick-prompts">
                {WELCOME_PROMPTS.map((p) => (
                  <button key={p} className="quick-prompt" onClick={() => handleSend(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`msg-row ${msg.sender}`}>
              {msg.sender === "bot" && <div className="msg-avatar">🌿</div>}
              <div className={`msg-bubble ${msg.loading ? "loading-bubble" : ""}`}>
                {msg.loading ? (
                  <div className="typing-dots">
                    <span /><span /><span />
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <div className="chat-input-box">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about food, diet, wellness…"
              rows={1}
              disabled={loading}
            />
            <div className="chat-buttons">
              <button
                className={`mic-btn ${isListening ? "listening" : ""}`}
                onClick={handleVoice}
                title="Voice input"
              >
                {isListening && <span className="mic-ring" />}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>
              <button
                className="send-btn"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                title="Send"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
