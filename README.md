# Social Media Content Analyzer

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-orange?style=flat)

**Social Media Content Analyzer** is a modern, AI-powered web application designed to help creators and marketers extract text from documents or images and instantly receive actionable engagement insights to supercharge their social media strategy.

## 🚀 Core Technical Architecture

- **Framework**: Next.js 14 (App Router) with TypeScript for robust, full-stack React development.
- **Styling**: Tailwind CSS combined with `lucide-react` for a responsive, modern, and highly polished UI.
- **Document Extraction Pipeline**: 
  - `pdf-parse`: High-speed vector parsing for `.pdf` documents.
  - `tesseract.js`: Optical Character Recognition (OCR) for `.png`, `.jpg`, and `.jpeg` images.
- **AI Engine:** Groq API (`groq-sdk`) using `llama-3.1-8b-instant` for ultra-fast, structured JSON sentiment and engagement scoring.

---

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js 18.x or later installed on your machine.
- A valid [Groq API Key](https://console.groq.com/keys).

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UNTHINKABLE
   ```

2. **Install dependencies**
   1. Ensure you have Node.js 18+ installed.
   2. Clone this repository and navigate to the root directory.
   3. Install dependencies: `npm install`
   4. Copy the `.env.local` template and add your API keys:
      - Provide your `GROQ_API_KEY` in `.env.local`.
   5. Start the development server: `npm run dev`

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🌍 Deployment Guide

This project is optimized for modern serverless environments.

### Vercel (Recommended)
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project into [Vercel](https://vercel.com/).
3. Add your `GROQ_API_KEY` to the **Environment Variables** in the Vercel project settings.
4. Click **Deploy**. Vercel will automatically detect the Next.js framework and build the app.

### Render
1. Connect your repository to [Render](https://render.com/).
2. Create a new "Web Service".
3. Set the Build Command to `npm run build` and the Start Command to `npm run start`.
4. Add the `GROQ_API_KEY` in the Environment tab and deploy.

---

## 🧠 Technical Approach

The technical architecture centers around a Next.js 14 App Router, keeping the frontend interactive while safely handling API keys server-side. For document extraction, the application dynamically handles both vector-based PDFs (using `pdf-parse`) and image-based text (using `tesseract.js` OCR) in a unified `/api/extract-text` endpoint. 

The core intelligence is powered by the **Groq API** via the `/api/analyze` endpoint. By strictly enforcing a JSON response schema (`response_format: { type: 'json_object' }`), we guarantee that the `llama-3.1-8b-instant` model returns structured, predictable data that perfectly maps to the TypeScript interfaces powering the `AnalysisDashboard` component. This architecture ensures high-speed insights while maintaining a robust, type-safe data pipeline from the server down to the UI components.

UX is prioritized through a responsive, modern App Router interface built with Tailwind CSS. Stateful loading indicators bridge the gap during latency-heavy tasks (like OCR processing or LLM generation). Furthermore, comprehensive try/catch boundaries gracefully handle edge cases—such as corrupted files or API rate limits—ensuring a resilient and intuitive user experience at all times.
