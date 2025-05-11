// src/components/History.js
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("lastSummaries") || "[]");
    setHistory(stored);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("lastSummaries");
    setHistory([]);
    toast.info("🗑️ History cleared");
  };

  return (
    <div className="card">
      <h2>📜 Last 5 Summaries</h2>
      {history.length === 0 ? (
        <p>No saved summaries.</p>
      ) : (
        <>
          <button onClick={clearHistory} style={{ marginBottom: "10px" }}>
            🗑️ Clear History
          </button>
          {history.map((item, index) => (
            <div key={index} className="history-entry">
              <h4>{item.title}</h4>
              <p>{item.summary}</p>
              <small>🕓 {new Date(item.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
