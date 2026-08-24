# Social Media Content Analyzer

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)
![Groq](https://img.shields.io/badge/AI-Groq-orange?style=flat)

**Social Media Content Analyzer** is an AI-powered web application that extracts text from documents or images and returns actionable engagement insights to help improve social media posts.

## Core Technical Architecture

- **Framework**: Next.js 16 (App Router) with TypeScript.
- **Styling**: Tailwind CSS v4 with `lucide-react` icons. Supports light and dark themes.
- **Document Extraction Pipeline**:
  - `pdf-parse`: text extraction for `.pdf` documents.
  - `tesseract.js`: Optical Character Recognition (OCR) for `.png`, `.jpg`, and `.jpeg` images.
- **AI Engine**: Groq API (`groq-sdk`) using the `openai/gpt-oss-20b` model with JSON mode for structured engagement scoring.

---

## Local Setup Instructions

### Prerequisites
- Node.js 18.x or later.
- A valid [Groq API Key](https://console.groq.com/keys).

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root and add your Groq API key:
   ```
   GROQ_API_KEY=your_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port shown in the terminal) to view the application.

---

## Deployment Guide

This project runs on modern serverless environments.

### Vercel (Recommended)
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project into [Vercel](https://vercel.com/).
3. Add your `GROQ_API_KEY` to the **Environment Variables** in the Vercel project settings.
4. Click **Deploy**. Vercel automatically detects the Next.js framework.

### Render
1. Connect your repository to [Render](https://render.com/).
2. Create a new "Web Service".
3. Set the Build Command to `npm run build` and the Start Command to `npm run start`.
4. Add the `GROQ_API_KEY` in the Environment tab and deploy.

---

## Technical Approach

The application is built on the Next.js App Router, keeping the UI interactive on the client while handling the API key securely on the server. Document extraction is unified in a single `/api/extract-text` endpoint that branches by MIME type: vector-based PDFs are parsed with `pdf-parse`, while image files are run through `tesseract.js` OCR.

The engagement analysis runs in `/api/analyze` against the Groq API. By enforcing a JSON response schema (`response_format: { type: 'json_object' }`), the `openai/gpt-oss-20b` model returns structured, predictable data that maps directly to the TypeScript interfaces powering the `AnalysisDashboard` component, giving a type-safe pipeline from server to UI.

UX is handled through a responsive interface with light/dark theme support. Stateful loading indicators cover latency-heavy tasks such as OCR and LLM generation, and try/catch boundaries in both API routes and the client gracefully surface errors like unsupported files or missing API keys.
