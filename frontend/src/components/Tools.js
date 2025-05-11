// src/components/Tools.js
import React, { useState } from "react";
import { fetchArticleContent, summarizeText } from "../api";
import { toast } from "react-toastify";

export default function Tools() {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveToHistory = (title, summary) => {
    const last = JSON.parse(localStorage.getItem("lastSummaries") || "[]");
    const newEntry = {
      title,
      summary,
      timestamp: Date.now()
    };
    const updated = [newEntry, ...last].slice(0, 5);
    localStorage.setItem("lastSummaries", JSON.stringify(updated));
  };

  const handleUrlSummarize = async () => {
    if (!url.trim()) return setError("Please enter a valid URL.");
    setLoading(true);
    try {
      const content = await fetchArticleContent(url);
      const result = await summarizeText(content);
      setSummary(result);
      toast.success("✅ URL summarized successfully!");
      saveToHistory(`From URL: ${url}`, result);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.detail || "❌ Could not summarize.");
    }
    setLoading(false);
  };

  const handleTextSummarize = async () => {
    if (!text.trim()) return setError("Please enter text.");
    if (text.length > 5000) return setError("Text exceeds 5000 characters.");
    setLoading(true);
    try {
      const result = await summarizeText(text);
      setSummary(result);
      toast.success("✅ Text summarized successfully!");
      saveToHistory(text.substring(0, 50) + "...", result);
      setError("");
    } catch {
      setError("❌ Could not summarize.");
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>🛠️ Summarization Tools</h2>

      <div className="section">
        <h4>🔗 Summarize Article by URL</h4>
        <input
          type="text"
          placeholder="Enter article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input"
        />
        <button onClick={handleUrlSummarize}>Summarize URL</button>
      </div>

      <div className="section">
        <h4>📝 Summarize Custom Text</h4>
        <textarea
          rows={6}
          maxLength={5000}
          placeholder="Enter text (max 5000 chars)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input"
        />
        <button onClick={handleTextSummarize}>Summarize Text</button>
      </div>

      {loading && <p className="loading">⏳ Summarizing...</p>}
      {error && <p className="error">{error}</p>}
      {summary && (
        <div className="summary-box">
          <h5>📌 Summary:</h5>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
