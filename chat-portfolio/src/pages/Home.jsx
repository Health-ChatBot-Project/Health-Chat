import React, { useEffect, useState } from "react";
import "./Home.css";

function Home() {
  const images = [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061", // healthy food
    "https://images.unsplash.com/photo-1554284126-aa88f22d8b74", // exercise
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", // salad
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438", // gym
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${images[index]})`,
      }}
    >
      <div className="overlay"></div>

      <div className="home-card">
        <h1 className="home-title">🌱 Healthy Living Assistant</h1>

        <p className="home-text">
          Your personal AI-powered nutrition assistant that helps you eat
          healthier, plan meals, and improve your lifestyle with simple,
          practical guidance.
        </p>

        <div className="home-features">
          <div className="feature-card">🥗 Meal Suggestions</div>
          <div className="feature-card">💪 Weight Loss Tips</div>
          <div className="feature-card">🍎 Healthy Eating Advice</div>
        </div>

        <div className="home-footer">
          Chat with the assistant using the 💬 button at the bottom right
        </div>
      </div>
    </div>
  );
}

export default Home;