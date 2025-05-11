// src/components/Home.js
import React, { useEffect, useState } from "react";
import { getArticles, fetchArticleContent, summarizeText } from "../api";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);

  const articlesPerPage = 10;
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (page - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  const handleSummarize = async (article, index) => {
    setLoadingIndex(index);
    try {
      const content = await fetchArticleContent(article.url);
      const summary = await summarizeText(content);
      setSummaries((prev) => ({ ...prev, [index]: summary }));
      setErrors((prev) => ({ ...prev, [index]: "" }));

      const last = JSON.parse(localStorage.getItem("lastSummaries") || "[]");
      const newEntry = { title: article.title, summary, timestamp: Date.now() };
      const updated = [newEntry, ...last].slice(0, 5);
      localStorage.setItem("lastSummaries", JSON.stringify(updated));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [index]: "❌ Failed to summarize" }));
    }
    setLoadingIndex(null);
  };

  return (
    <div className="card">
      <h2>📰 Latest Articles from Saudi Gazette</h2>
      {currentArticles.map((article, index) => {
        const realIndex = startIndex + index;
        return (
          <div
            key={realIndex}
            style={{
              padding: "15px",
              border: "1px solid var(--summary-border)",
              borderRadius: "8px",
              marginBottom: "20px",
              backgroundColor: "var(--card-bg)",
              color: "var(--text-color)",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)"
            }}
          >
            <h4 style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "8px" }}>📝</span> {article.title}
            </h4>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "var(--button-bg)",
                  fontWeight: "bold",
                  textDecoration: "underline"
                }}
              >
                🔗 View Article
              </a>
              <button onClick={() => handleSummarize(article, realIndex)}>
                {loadingIndex === realIndex ? "Summarizing..." : "Summarize"}
              </button>
            </div>

            {errors[realIndex] && <p className="error">{errors[realIndex]}</p>}
            {summaries[realIndex] && (
              <div className="summary-box">
                <h5>📌 Summary:</h5>
                <p>{summaries[realIndex]}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Pagination Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
           Previous Page
        </button>
        <span style={{ fontWeight: "bold" }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={endIndex >= articles.length}>
           Next Page
        </button>
      </div>
    </div>
  );
}
