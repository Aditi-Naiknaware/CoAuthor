import React, { useState } from "react";

const INSTRUCTIONS = [
  { label: "✨ Continue", value: "Continue writing in the same style" },
  { label: "🔧 Improve", value: "Improve the clarity and flow" },
  { label: "📖 Expand", value: "Expand on the last paragraph with more detail" },
  { label: "✂️ Shorten", value: "Make this more concise" },
  { label: "🎨 Creative", value: "Make this more creative and engaging" },
  { label: "📝 Formal", value: "Make this more formal and professional" },
];

export default function Toolbar({ onSuggest, onEdit, onSummarize, loading, ragEnabled, onToggleRag }) {
  const [customInstruction, setCustomInstruction] = useState("");
  const [activeTab, setActiveTab] = useState("suggest");

  const handleAction = () => {
    const instruction = customInstruction.trim() || "Continue writing";
    if (activeTab === "suggest") onSuggest(instruction);
    else onEdit(instruction);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-tabs">
        <button
          className={`tab-btn ${activeTab === "suggest" ? "active" : ""}`}
          onClick={() => setActiveTab("suggest")}
        >
          Suggest
        </button>
        <button
          className={`tab-btn ${activeTab === "edit" ? "active" : ""}`}
          onClick={() => setActiveTab("edit")}
        >
          Edit Selection
        </button>
        <button className="tab-btn summarize-btn" onClick={onSummarize} disabled={loading}>
          Summarize
        </button>
      </div>

      <div className="quick-actions">
        {INSTRUCTIONS.map((inst) => (
          <button
            key={inst.value}
            className="quick-btn"
            onClick={() => {
              setCustomInstruction(inst.value);
              if (activeTab === "suggest") onSuggest(inst.value);
              else onEdit(inst.value);
            }}
            disabled={loading}
          >
            {inst.label}
          </button>
        ))}
      </div>

      <div className="custom-instruction">
        <input
          type="text"
          placeholder={
            activeTab === "suggest"
              ? "Custom instruction (e.g. write in a more poetic tone)..."
              : "Edit instruction (e.g. make this a bullet list)..."
          }
          value={customInstruction}
          onChange={(e) => setCustomInstruction(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAction()}
        />
        <button className="run-btn" onClick={handleAction} disabled={loading}>
          {loading ? <span className="spinner" /> : "→"}
        </button>
      </div>

      <label className="rag-toggle">
        <input type="checkbox" checked={ragEnabled} onChange={(e) => onToggleRag(e.target.checked)} />
        <span>Use reference docs (RAG)</span>
      </label>
    </div>
  );
}
