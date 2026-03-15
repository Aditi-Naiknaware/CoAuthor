import React from "react";
import { useEditor } from "./hooks/useEditor";
import Toolbar from "./components/Toolbar";
import SuggestionPanel from "./components/SuggestionPanel";
import ContextUploader from "./components/ContextUploader";
import "./App.css";

export default function App() {
  const {
    text, setText,
    suggestion, setSuggestion,
    summary, setSummary,
    loading, error, clearError,
    ragEnabled, setRagEnabled,
    contextFiles,
    textareaRef,
    wordCount, charCount,
    handleSuggest,
    handleEdit,
    handleSummarize,
    handleAcceptSuggestion,
    handleUploadContext,
    handleClearContext,
  } = useEditor();

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">✍</span>
          <span className="logo-text">CoAuthor</span>
        </div>
        <p className="tagline">Human-AI Collaborative Writing Assistant</p>
      </header>

      <div className="workspace">
        {/* Left sidebar */}
        <aside className="sidebar">
          <Toolbar
            onSuggest={handleSuggest}
            onEdit={handleEdit}
            onSummarize={handleSummarize}
            loading={loading}
            ragEnabled={ragEnabled}
            onToggleRag={setRagEnabled}
          />
          <ContextUploader
            contextFiles={contextFiles}
            onUpload={handleUploadContext}
            onClear={handleClearContext}
            loading={loading}
          />
        </aside>

        {/* Editor */}
        <main className="editor-area">
          {error && (
            <div className="error-banner">
              ⚠ {error}
              <button onClick={clearError}>✕</button>
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="editor"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing here… or paste your draft and let CoAuthor help you improve it."
            spellCheck
          />

          <div className="editor-footer">
            <span>{wordCount} words · {charCount} chars</span>
            {loading && <span className="loading-indicator">⏳ Thinking…</span>}
          </div>

          <SuggestionPanel
            suggestion={suggestion}
            onAccept={handleAcceptSuggestion}
            onDiscard={() => setSuggestion("")}
            summary={summary}
            onClearSummary={() => setSummary("")}
          />
        </main>
      </div>
    </div>
  );
}
