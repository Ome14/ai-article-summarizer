// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <h3>🧠 AI Summarizer</h3>
      <div>
        <Link to="/">Home</Link>
        <Link to="/tools">Tools</Link>
        <Link to="/history">History</Link>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}
