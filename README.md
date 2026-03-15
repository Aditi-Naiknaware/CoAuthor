# CoAuthor — Human-AI Collaborative Writing Assistant

> A full-stack AI writing assistant powered by GPT-3.5 Turbo, LangChain, and FAISS built as a portfolio project for a Master's in Computer Science.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![LangChain](https://img.shields.io/badge/LangChain-0.2-green)
![FAISS](https://img.shields.io/badge/FAISS-CPU-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## Overview

CoAuthor is a collaborative writing tool that pairs a rich text editor with an AI backend to help users:

- **Continue** their writing with contextually aware suggestions
- **Edit** selected text based on natural language instructions
- **Summarize** their full document in a click
- **Upload reference documents** and have the AI retrieve relevant passages using **RAG (Retrieval-Augmented Generation)**

The backend is built with **Flask + LangChain + OpenAI**, and the frontend is a **React** single-page application.

---

## Project Structure

```
coauthor/
├── backend/
│   ├── app.py                  # Flask API server
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment variable template
│   └── services/
│       ├── llm_service.py      # LangChain + GPT-3.5 Turbo logic
│       └── rag_service.py      # FAISS vector store + OpenAI embeddings
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx             # Root component
│       ├── App.css             # Global styles
│       ├── index.js            # React entry point
│       ├── hooks/
│       │   └── useEditor.js    # Editor state + API calls
│       ├── components/
│       │   ├── Toolbar.jsx     # AI action controls
│       │   ├── SuggestionPanel.jsx  # Displays AI output
│       │   └── ContextUploader.jsx  # Upload reference docs
│       └── utils/
│           └── api.js          # Axios API client
│
├── .gitignore
└── README.md
```

---

##  Tech Stack

| Layer | Technology |
|---|---|
| LLM | GPT-3.5 Turbo (OpenAI API) |
| Orchestration | LangChain |
| Vector Store | FAISS  |
| Embeddings | OpenAI  |
| Backend | Flask (Python) |
| Frontend | React 18 |
| HTTP Client | Axios |
| Styling | Custom CSS|

---



### Prerequisites

- Python 3.10+
- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/account/api-keys)


---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/coauthor.git
cd coauthor
```

---

### 2. Set Up the Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Open .env and add your OpenAI API key:
# OPENAI_API_KEY=sk-...

# Start the Flask server
python app.py
```

The backend will run at **http://localhost:5000**

---

### 3. Set Up the Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start the React dev server
npm start
```

The frontend will open at **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/suggest` | Get an AI writing suggestion |
| `POST` | `/api/edit` | Edit selected text with an instruction |
| `POST` | `/api/summarize` | Summarize the full document |
| `POST` | `/api/upload-context` | Index a reference document into FAISS |
| `POST` | `/api/rag-search` | Search the FAISS index |
| `POST` | `/api/clear-context` | Clear the session's vector store |
| `GET`  | `/health` | Health check |

### Example: Get a Suggestion

```bash
curl -X POST http://localhost:5000/api/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The Roman Empire fell due to several key factors.",
    "instruction": "Continue writing",
    "use_rag": false,
    "session_id": "user-123"
  }'
```

**Response:**
```json
{
  "suggestion": "Among the most significant were economic troubles, military pressures from Germanic tribes, and the gradual erosion of civic virtue that had once defined Roman society...",
  "sources": []
}
```

---

## How RAG Works

1. **Upload** a `.txt` or `.md` reference document via the sidebar
2. The backend **chunks** the document using `RecursiveCharacterTextSplitter` (500 tokens, 50 overlap)
3. Each chunk is **embedded** using OpenAI's `text-embedding-ada-002` model
4. Embeddings are stored in a **per-session FAISS index** (in memory)
5. When you request a suggestion with RAG enabled, the current text is used as a **query** to retrieve the top-3 most similar chunks
6. Retrieved chunks are **injected into the LLM prompt** as context

```
User text → FAISS similarity search → Top-3 chunks → LLM prompt → Suggestion
```

---


## ✨ Features

- **Smart Suggestions** — AI continues your writing based on context
- **Text Editing** — Select any text and give a natural language edit instruction
- **Summarization** — One-click document summary
- **RAG Context** — Upload reference documents and have the AI cite them
- **Quick Actions** — Pre-built prompts: Continue, Improve, Expand, Shorten, Creative, Formal
- **Word/Char Counter** — Live stats in the editor footer
- **Session Isolation** — Each browser tab gets its own UUID-based vector store session

---

## 📄 License

MIT License. Free to use, modify, and distribute.

---

## 🙋 Author

Built by **Aditi Naiknaware** as part of the MS Computer Science program at San Diego State University.

- 🔗 [LinkedIn](https://www.linkedin.com/in/anaiknaware)
- 🐙 [GitHub](https://github.com/Aditi-Naiknaware)
