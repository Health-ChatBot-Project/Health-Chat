import React, { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm your Healthy Eating Assistant! Ask me anything 🥗",
    },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  // 🚀 GROQ AI FUNCTION
  const getAIResponse = async (message) => {
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content:
                  "You are a friendly Healthy Eating Assistant. Give short, simple, practical advice about food, diet, and health. Keep responses clear and under 3 sentences.",
              },
              {
                role: "user",
                content: message,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      return (
        data?.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a response."
      );
    } catch (error) {
      console.error("Groq API Error:", error);
      return "Something went wrong. Please try again later ⚠️";
    }
  };

  // 🚀 MAIN SEND FUNCTION
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    // show user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
    ]);

    setInput("");

    // show typing indicator
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Typing..." },
    ]);

    // get AI response
    const aiReply = await getAIResponse(userText);

    // replace typing message with real response
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { sender: "bot", text: aiReply },
    ]);
  };

  return (
    <>
      {/* Floating button */}
      <button className="chat-toggle" onClick={toggleChat}>
        💬
      </button>

      {/* Chat popup */}
      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <span>Healthy Assistant</span>
            <button onClick={toggleChat}>✖</button>
          </div>

          {/* Messages */}
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about food, diet..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;