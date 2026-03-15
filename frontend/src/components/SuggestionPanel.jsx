import React from "react";

export default function SuggestionPanel({ suggestion, onAccept, onDiscard, summary, onClearSummary }) {
  if (summary) {
    return (
      <div className="suggestion-panel summary-panel">
        <div className="panel-header">
          <span>📋 Summary</span>
          <button className="discard-btn" onClick={onClearSummary}>✕</button>
        </div>
        <p className="summary-text">{summary}</p>
      </div>
    );
  }

  if (!suggestion) return null;

  return (
    <div className="suggestion-panel">
      <div className="panel-header">
        <span>✨ AI Suggestion</span>
        <div className="panel-actions">
          <button className="accept-btn" onClick={onAccept}>
            ✓ Accept
          </button>
          <button className="discard-btn" onClick={onDiscard}>
            ✕ Discard
          </button>
        </div>
      </div>
      <p className="suggestion-text">{suggestion}</p>
    </div>
  );
}
