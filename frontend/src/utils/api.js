import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

export const getSuggestion = (text, instruction, useRag = false, sessionId = "default") =>
  api.post("/api/suggest", { text, instruction, use_rag: useRag, session_id: sessionId });

export const editText = (selectedText, fullText, instruction) =>
  api.post("/api/edit", { selected_text: selectedText, full_text: fullText, instruction });

export const summarizeText = (text) =>
  api.post("/api/summarize", { text });

export const uploadContext = (content, filename, sessionId = "default") =>
  api.post("/api/upload-context", { content, filename, session_id: sessionId });

export const clearContext = (sessionId = "default") =>
  api.post("/api/clear-context", { session_id: sessionId });

export default api;
