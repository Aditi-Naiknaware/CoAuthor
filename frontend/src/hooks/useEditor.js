import { useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { getSuggestion, editText, summarizeText, uploadContext, clearContext } from "../utils/api";

export function useEditor() {
  const [text, setText] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ragEnabled, setRagEnabled] = useState(false);
  const [contextFiles, setContextFiles] = useState([]);
  const [sessionId] = useState(() => uuidv4());
  const [selectedText, setSelectedText] = useState("");
  const textareaRef = useRef(null);

  const clearError = () => setError("");

  const handleSuggest = useCallback(async (instruction = "Continue writing") => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await getSuggestion(text, instruction, ragEnabled, sessionId);
      setSuggestion(res.data.suggestion);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to get suggestion");
    } finally {
      setLoading(false);
    }
  }, [text, ragEnabled, sessionId]);

  const handleEdit = useCallback(async (instruction) => {
    const sel = selectedText || window.getSelection()?.toString();
    if (!sel) {
      setError("Please select text to edit first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await editText(sel, text, instruction);
      const edited = res.data.edited;
      setText((prev) => prev.replace(sel, edited));
      setSuggestion("");
    } catch (e) {
      setError(e.response?.data?.error || "Failed to edit text");
    } finally {
      setLoading(false);
    }
  }, [selectedText, text]);

  const handleSummarize = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await summarizeText(text);
      setSummary(res.data.summary);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to summarize");
    } finally {
      setLoading(false);
    }
  }, [text]);

  const handleAcceptSuggestion = useCallback(() => {
    setText((prev) => prev + (prev.endsWith(" ") ? "" : " ") + suggestion);
    setSuggestion("");
  }, [suggestion]);

  const handleUploadContext = useCallback(async (file) => {
    setLoading(true);
    setError("");
    try {
      const content = await file.text();
      await uploadContext(content, file.name, sessionId);
      setContextFiles((prev) => [...prev, file.name]);
      setRagEnabled(true);
    } catch (e) {
      setError("Failed to upload context file");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const handleClearContext = useCallback(async () => {
    await clearContext(sessionId);
    setContextFiles([]);
    setRagEnabled(false);
  }, [sessionId]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return {
    text, setText,
    suggestion, setSuggestion,
    summary, setSummary,
    loading, error, clearError,
    ragEnabled, setRagEnabled,
    contextFiles,
    selectedText, setSelectedText,
    textareaRef,
    wordCount, charCount,
    handleSuggest,
    handleEdit,
    handleSummarize,
    handleAcceptSuggestion,
    handleUploadContext,
    handleClearContext,
  };
}
