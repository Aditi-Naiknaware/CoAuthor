import os
from typing import List, Dict
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document


class RAGService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not set in environment variables.")

        self.embeddings = OpenAIEmbeddings(openai_api_key=api_key)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
        )
        # session_id -> FAISS index
        self._stores: Dict[str, FAISS] = {}

    def add_document(self, content: str, metadata: dict, session_id: str = "default") -> int:
        """Chunk and index a document into the FAISS store for a session."""
        chunks = self.text_splitter.split_text(content)
        docs = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]

        if session_id in self._stores:
            self._stores[session_id].add_documents(docs)
        else:
            self._stores[session_id] = FAISS.from_documents(docs, self.embeddings)

        return len(self._stores[session_id].index_to_docstore_id)

    def search(self, query: str, session_id: str = "default", k: int = 3) -> List[Dict]:
        """Search for relevant chunks in the session's FAISS store."""
        if session_id not in self._stores:
            return []

        results = self._stores[session_id].similarity_search_with_score(query, k=k)
        return [
            {
                "content": doc.page_content,
                "source": doc.metadata.get("source", "unknown"),
                "score": float(score),
            }
            for doc, score in results
        ]

    def clear_session(self, session_id: str = "default"):
        """Remove the FAISS index for a session."""
        if session_id in self._stores:
            del self._stores[session_id]
