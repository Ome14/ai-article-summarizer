// src/api.js
import axios from "axios";
const BASE = "http://localhost:8000";

export async function getArticles() {
  const res = await axios.get(`${BASE}/crawler/articles`);
  return res.data.articles;
}

export async function fetchArticleContent(url) {
  const res = await axios.get(`${BASE}/articles/fetch-content?url=${encodeURIComponent(url)}`);
  return res.data.content;
}

export async function summarizeText(text) {
  const res = await axios.post(`${BASE}/articles/summarize`, { text });
  return res.data.summary_ar;
}
