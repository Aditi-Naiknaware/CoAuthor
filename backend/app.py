from flask import Flask, request, jsonify, stream_with_context, Response
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

from services.llm_service import LLMService
from services.rag_service import RAGService

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

llm_service = LLMService()
rag_service = RAGService()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/suggest", methods=["POST"])
def suggest():
    """Get AI writing suggestions for the current text."""
    data = request.json
    text = data.get("text", "")
    instruction = data.get("instruction", "Continue writing")
    use_rag = data.get("use_rag", False)
    session_id = data.get("session_id", "default")

    if not text and not instruction:
        return jsonify({"error": "Text or instruction required"}), 400

    context_docs = []
    if use_rag and text:
        context_docs = rag_service.search(text, session_id=session_id)

    result = llm_service.get_suggestion(
        text=text,
        instruction=instruction,
        context_docs=context_docs,
    )

    return jsonify({"suggestion": result, "sources": context_docs})


@app.route("/api/edit", methods=["POST"])
def edit():
    """Edit/rewrite selected text based on instruction."""
    data = request.json
    selected_text = data.get("selected_text", "")
    full_text = data.get("full_text", "")
    instruction = data.get("instruction", "Improve this text")

    if not selected_text:
        return jsonify({"error": "Selected text required"}), 400

    result = llm_service.edit_text(
        selected_text=selected_text,
        full_text=full_text,
        instruction=instruction,
    )
    return jsonify({"edited": result})


@app.route("/api/summarize", methods=["POST"])
def summarize():
    """Summarize the current document."""
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "Text required"}), 400

    result = llm_service.summarize(text)
    return jsonify({"summary": result})


@app.route("/api/upload-context", methods=["POST"])
def upload_context():
    """Upload a reference document to the RAG vector store."""
    data = request.json
    content = data.get("content", "")
    filename = data.get("filename", "document")
    session_id = data.get("session_id", "default")

    if not content:
        return jsonify({"error": "Content required"}), 400

    doc_count = rag_service.add_document(
        content=content,
        metadata={"source": filename},
        session_id=session_id,
    )

    return jsonify({"message": f"Document indexed. Total chunks: {doc_count}"})


@app.route("/api/rag-search", methods=["POST"])
def rag_search():
    """Search the RAG index for relevant passages."""
    data = request.json
    query = data.get("query", "")
    session_id = data.get("session_id", "default")

    if not query:
        return jsonify({"error": "Query required"}), 400

    results = rag_service.search(query, session_id=session_id)
    return jsonify({"results": results})


@app.route("/api/clear-context", methods=["POST"])
def clear_context():
    """Clear the RAG context for a session."""
    data = request.json
    session_id = data.get("session_id", "default")
    rag_service.clear_session(session_id)
    return jsonify({"message": "Context cleared"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
