import os
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage


class LLMService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not set in environment variables.")

        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0.7,
            openai_api_key=api_key,
        )

    def get_suggestion(self, text: str, instruction: str, context_docs: list) -> str:
        """Generate a writing continuation or suggestion."""
        context_block = ""
        if context_docs:
            context_block = "\n\nRelevant reference material:\n" + "\n---\n".join(
                [d["content"] for d in context_docs]
            )

        system_prompt = (
            "You are CoAuthor, an intelligent writing assistant. "
            "Your job is to help users write better by providing suggestions, continuations, "
            "and improvements. Be concise, contextually aware, and match the user's writing style."
            + context_block
        )

        user_prompt = f"""Instruction: {instruction}

Current text:
\"\"\"
{text}
\"\"\"

Provide a helpful writing suggestion or continuation based on the instruction. 
Return only the suggested text, no explanations."""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ]

        response = self.llm.invoke(messages)
        return response.content.strip()

    def edit_text(self, selected_text: str, full_text: str, instruction: str) -> str:
        """Edit or rewrite a selected portion of text."""
        system_prompt = (
            "You are CoAuthor, an intelligent writing assistant. "
            "Edit the provided text according to the instruction. "
            "Preserve the author's voice and intent while improving the writing."
        )

        user_prompt = f"""Instruction: {instruction}

Full document context:
\"\"\"
{full_text[:1000]}...
\"\"\"

Text to edit:
\"\"\"
{selected_text}
\"\"\"

Return only the edited version of the selected text. No explanations."""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ]

        response = self.llm.invoke(messages)
        return response.content.strip()

    def summarize(self, text: str) -> str:
        """Summarize the document."""
        system_prompt = (
            "You are CoAuthor, an intelligent writing assistant. "
            "Provide a clear, concise summary of the provided document."
        )

        user_prompt = f"""Summarize the following document in 3-5 sentences:

\"\"\"
{text}
\"\"\"

Summary:"""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ]

        response = self.llm.invoke(messages)
        return response.content.strip()
