import React, { useRef } from "react";

export default function ContextUploader({ contextFiles, onUpload, onClear, loading }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
    e.target.value = "";
  };

  return (
    <div className="context-uploader">
      <div className="context-header">
        <span>📚 Reference Docs</span>
        {contextFiles.length > 0 && (
          <button className="clear-btn" onClick={onClear} disabled={loading}>
            Clear All
          </button>
        )}
      </div>

      {contextFiles.length === 0 ? (
        <p className="no-docs">No documents uploaded yet.</p>
      ) : (
        <ul className="doc-list">
          {contextFiles.map((name, i) => (
            <li key={i} className="doc-item">
              📄 {name}
            </li>
          ))}
        </ul>
      )}

      <button
        className="upload-btn"
        onClick={() => fileRef.current.click()}
        disabled={loading}
      >
        + Upload .txt file
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".txt,.md"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
