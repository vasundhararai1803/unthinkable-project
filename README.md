# Social Media Content Analyser

I built the Social Media Content Analyser as a full-stack Next.js 16 (App Router) application in TypeScript, keeping the UI on the client, but handling file processing and API keys securely on the server.

I used react dropzone to handle document upload, which supports both drag-and-drop and file picker input. I also implemented client side validation for file type (PDF, PNG, JPG) and a 10MB size limit, with inline error feedback.

For text extraction, I have a single /api/extract-text endpoint that branches by mime type. PDFs are parsed with pdf-parse and images are run through tesseract.js OCR. It returns the text together with counts of words and characters.

I added an AI engagement analysis step to the brief: /api/analyze calls the Groq API (openai/gpt-oss-20b) with an enforced JSON schema (response_format: json_object) and returns a structured object (score, tone, strengths, weaknesses, suggestions, hashtags, optimised rewrite) that maps directly to typed React components.

UX wise, I added loading states for the latency heavy OCR and LLM steps, a light/dark theme toggle with persistence, and try/catch boundaries across both API routes and the client to gracefully surface errors like unsupported files or missing keys.


# Social Media Content Analyzer

**Live Application:** [https://unthinkable-project-gamma.vercel.app/](https://unthinkable-project-gamma.vercel.app/)
