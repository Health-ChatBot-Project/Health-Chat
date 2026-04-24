import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import InfoPanel from "./InfoPanel";
import "./Layout.css";

export default function Layout() {
  const [activeSection, setActiveSection] = useState("overview");
  const sectionRefs = {
    overview: useRef(null),
    "how-it-works": useRef(null),
    "ai-model": useRef(null),
    features: useRef(null),
    "tech-stack": useRef(null),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    Object.values(sectionRefs).forEach((r) => r.current && observer.observe(r.current));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="layout-root">
      <div className="animated-bg">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      <Sidebar activeSection={activeSection} onNav={scrollTo} />

      <main className="layout-main">
        <div className="content-sections">
          <section id="overview" ref={sectionRefs["overview"]} className="info-section">
            <div className="section-badge">Overview</div>
            <h2>Your Personal <span className="gradient-text">Nutrition AI</span></h2>
            <p>
              Healthy AI Assistant is a conversational AI built to guide you through smarter
              food choices, personalized meal strategies, and sustainable healthy habits —
              available 24/7 right in your browser.
            </p>
            <div className="stat-row">
              <div className="stat-card"><span className="stat-num">∞</span><span className="stat-label">Conversations</span></div>
              <div className="stat-card"><span className="stat-num">0ms</span><span className="stat-label">Wait Time</span></div>
              <div className="stat-card"><span className="stat-num">100%</span><span className="stat-label">Free</span></div>
            </div>
          </section>

          <section id="how-it-works" ref={sectionRefs["how-it-works"]} className="info-section">
            <div className="section-badge">How It Works</div>
            <h2>Simple as <span className="gradient-text">1-2-3</span></h2>
            <div className="steps-grid">
              {[
                { n: "01", t: "Ask Anything", d: "Type or speak your question about food, diet, or wellness goals." },
                { n: "02", t: "AI Processes", d: "Llama 3.1 via Groq's lightning-fast inference engine analyzes your query." },
                { n: "03", t: "Get Guidance", d: "Receive clear, science-backed, practical advice in seconds." },
              ].map((s) => (
                <div className="step-card" key={s.n}>
                  <span className="step-num">{s.n}</span>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="ai-model" ref={sectionRefs["ai-model"]} className="info-section">
            <div className="section-badge">AI Model</div>
            <h2>Powered by <span className="gradient-text">Llama 3.1</span></h2>
            <div className="model-card glass-card">
              <div className="model-logo">🦙</div>
              <div className="model-info">
                <h3>Meta Llama 3.1 8B Instant</h3>
                <p>A state-of-the-art open-source language model with 8 billion parameters, optimized for fast, contextual conversations about health and nutrition.</p>
                <div className="model-tags">
                  <span className="tag">8B Parameters</span>
                  <span className="tag">Fast Inference</span>
                  <span className="tag">Groq API</span>
                  <span className="tag">Open Source</span>
                </div>
              </div>
            </div>
          </section>

          <section id="features" ref={sectionRefs["features"]} className="info-section">
            <div className="section-badge">Features</div>
            <h2>Everything You <span className="gradient-text">Need</span></h2>
            <div className="features-grid">
              {[
                { icon: "🎤", t: "Voice Input", d: "Speak naturally — no typing required." },
                { icon: "⚡", t: "Instant Replies", d: "Sub-second response time via Groq." },
                { icon: "🥗", t: "Meal Planning", d: "Get weekly meal ideas tailored to you." },
                { icon: "💪", t: "Fitness Sync", d: "Align diet with your workout goals." },
                { icon: "📱", t: "Mobile Ready", d: "Full-screen chat on any device." },
                { icon: "🔒", t: "Private", d: "No data stored — fully ephemeral." },
              ].map((f) => (
                <div className="feature-tile" key={f.t}>
                  <span className="feature-icon">{f.icon}</span>
                  <h4>{f.t}</h4>
                  <p>{f.d}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="tech-stack" ref={sectionRefs["tech-stack"]} className="info-section">
            <div className="section-badge">Tech Stack</div>
            <h2>Built With <span className="gradient-text">Modern Tools</span></h2>
            <div className="stack-list">
              {[
                { icon: "⚛️", name: "React 18", role: "UI Framework" },
                { icon: "🦙", name: "Llama 3.1", role: "Language Model" },
                { icon: "⚡", name: "Groq API", role: "Fast Inference" },
                { icon: "🎤", name: "Web Speech API", role: "Voice Input" },
                { icon: "🎨", name: "CSS3 + Animations", role: "Styling" },
              ].map((s) => (
                <div className="stack-row" key={s.name}>
                  <span className="stack-icon">{s.icon}</span>
                  <div>
                    <strong>{s.name}</strong>
                    <span className="stack-role">{s.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <ChatArea />
      <InfoPanel />
    </div>
  );
}
