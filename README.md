# Social Media Content Analyser

I built the Social Media Content Analyser as a full-stack Next.js 16 (App Router) application in TypeScript, keeping the UI on the client, but handling file processing and API keys securely on the server.

I used react dropzone to handle document upload, which supports both drag-and-drop and file picker input. I also implemented client side validation for file type (PDF, PNG, JPG) and a 10MB size limit, with inline error feedback.

For text extraction, I have a single /api/extract-text endpoint that branches by mime type. PDFs are parsed with pdf-parse and images are run through tesseract.js OCR. It returns the text together with counts of words and characters.

I added an AI engagement analysis step to the brief: /api/analyze calls the Groq API (openai/gpt-oss-20b) with an enforced JSON schema (response_format: json_object) and returns a structured object (score, tone, strengths, weaknesses, suggestions, hashtags, optimised rewrite) that maps directly to typed React components.

UX wise, I added loading states for the latency heavy OCR and LLM steps, a light/dark theme toggle with persistence, and try/catch boundaries across both API routes and the client to gracefully surface errors like unsupported files or missing keys.


**Live Application:** [https://unthinkable-project-gamma.vercel.app/](https://unthinkable-project-gamma.vercel.app/)




## Features

- **Drag-and-drop upload** — powered by `react-dropzone`, with a file picker fallback
- **Client-side validation** — restricts uploads to PDF, PNG, and JPG, with a 10MB size cap and inline error messages
- **Text extraction** — a single `/api/extract-text` endpoint that branches by MIME type:
  - PDFs are parsed with `pdf-parse`
  - Images are run through `tesseract.js` OCR
  - Returns the extracted text plus word/character counts
- **AI engagement analysis** — `/api/analyze` sends the extracted text to the Groq API (`openai/gpt-oss-20b`) with a strict JSON response schema, returning:
  - Engagement score
  - Tone
  - Strengths and weaknesses
  - Improvement suggestions
  - Suggested hashtags
  - An optimized rewrite of the content
- **Light/dark theme** with persistence across sessions
- **Loading states** for the latency-heavy OCR and LLM steps, plus error handling across both API routes and the client

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| File upload | react-dropzone |
| PDF parsing | pdf-parse |
| OCR | tesseract.js |
| AI analysis | Groq SDK (`openai/gpt-oss-20b`) |
| Icons | lucide-react |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com/keys)

### Installation

```bash
git clone https://github.com/vasundhararai1803/unthinkable-project.git
cd unthinkable-project
npm install
```

### Environment variables

Create a `.env` (or `.env.local`) file in the project root:

```
GROQ_API_KEY=your_groq_api_key_here
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # run ESLint
```

## How It Works

1. **Upload** a PDF or image through the drop zone (max 10MB, PDF/PNG/JPG only).
2. **Extraction** — the file is sent to `POST /api/extract-text`, which parses PDFs with `pdf-parse` or runs OCR on images with `tesseract.js`, returning the raw text along with word and character counts.
3. **Analysis** — the extracted text is sent to `POST /api/analyze`, which calls the Groq API with a JSON-schema-constrained prompt and returns a structured breakdown of the content's social media performance.
4. **Results** are rendered in the dashboard: score, tone, strengths, weaknesses, suggestions, hashtags, and a ready-to-use optimized version of the post.

## Project Structure

```
app/
  api/
    extract-text/route.ts   # PDF/image → text (pdf-parse, tesseract.js)
    analyze/route.ts        # text → structured engagement analysis (Groq)
  layout.tsx
  page.tsx
components/
  FileUpload.tsx            # drag-and-drop + validation
  TextPreview.tsx           # extracted text preview
  AnalysisDashboard.tsx     # renders the AI analysis
  ThemeToggle.tsx           # light/dark mode toggle
```

## Notes

- Files are processed in-memory on the server and are not persisted to disk or a database.
- OCR and LLM calls can take a few seconds depending on file size and content length — loading states are shown throughout.
- If `GROQ_API_KEY` is not set, `/api/analyze` will return a clear configuration error instead of failing silently.
