import React, { useState, useEffect } from "react";
import "./InfoPanel.css";

const TIPS = [
  { icon: "💧", tip: "Drink a glass of water before every meal to reduce overeating." },
  { icon: "🥦", tip: "Half your plate should be vegetables at lunch and dinner." },
  { icon: "⏱️", tip: "Eating slowly helps your brain register fullness in time." },
  { icon: "🌙", tip: "Avoid eating heavy meals within 2 hours of bedtime." },
  { icon: "🎨", tip: "Eat a rainbow — diverse colors = diverse nutrients." },
  { icon: "🧠", tip: "Omega-3 fatty acids from fish support brain and heart health." },
];

const PROMPTS = [
  { icon: "🥗", text: "Create a 7-day vegetarian meal plan" },
  { icon: "💪", text: "Best pre-workout snacks under 200 calories" },
  { icon: "🍳", text: "Quick high-protein breakfast ideas" },
  { icon: "🛒", text: "Healthy grocery list for a week" },
  { icon: "🍫", text: "How to beat chocolate cravings" },
  { icon: "⚖️", text: "How many calories do I need per day?" },
];

export default function InfoPanel() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className="info-panel">
      <div className="ip-section">
        <div className="ip-label">Daily Tip</div>
        <div className="tip-card">
          <div className="tip-icon">{TIPS[tipIndex].icon}</div>
          <p className="tip-text">{TIPS[tipIndex].tip}</p>
          <div className="tip-dots">
            {TIPS.map((_, i) => (
              <button
                key={i}
                className={`tip-dot ${i === tipIndex ? "active" : ""}`}
                onClick={() => setTipIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="ip-section">
        <div className="ip-label">Try Asking…</div>
        <div className="prompt-list">
          {PROMPTS.map((p) => (
            <div className="prompt-chip" key={p.text}>
              <span className="prompt-icon">{p.icon}</span>
              <span className="prompt-text">{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ip-section">
        <div className="ip-label">Nutrition Focus</div>
        <div className="nutrition-bars">
          {[
            { label: "Protein", pct: 78, color: "#00e676" },
            { label: "Fiber",   pct: 62, color: "#64dd17" },
            { label: "Vitamins",pct: 91, color: "#00bfa5" },
            { label: "Hydration",pct: 55, color: "#1de9b6" },
          ].map((n) => (
            <div className="bar-row" key={n.label}>
              <div className="bar-label-row">
                <span>{n.label}</span>
                <span className="bar-pct">{n.pct}%</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${n.pct}%`, background: n.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
