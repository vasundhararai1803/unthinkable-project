import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { extractedText } = body;

    if (!extractedText || typeof extractedText !== 'string' || extractedText.trim() === '') {
      return NextResponse.json({ success: false, error: 'extractedText is required and must not be empty' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return NextResponse.json({ success: false, error: 'Missing or invalid GROQ_API_KEY in .env.local' }, { status: 401 });
    }

    const prompt = `You are an expert Social Media Content Analyst. Analyze the following text and return a JSON object with this exact shape, containing actionable insights for social media:
{
  "engagementScore": number (1-100),
  "tone": string,
  "strengths": string[],
  "weaknesses": string[],
  "improvementSuggestions": string[],
  "suggestedHashtags": string[],
  "optimizedVersion": string
}

You MUST return a raw JSON object containing: engagementScore, tone, strengths, weaknesses, improvementSuggestions, suggestedHashtags, and optimizedVersion. Do NOT include markdown code blocks (\`\`\`json).

Text to analyze:
"${extractedText}"`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      response_format: { type: 'json_object' },
    });

    const responseText = chatCompletion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error("No response text returned from Groq");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback: strip potential backticks before parsing
      const cleanedText = responseText.replace(/```json|```/g, "").trim();
      parsedData = JSON.parse(cleanedText);
    }

    return NextResponse.json({
      success: true,
      analysis: parsedData
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    
    // Handle specific API errors
    if (error.status === 429) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }
    
    if (error.status === 401 || (error.message && error.message.toLowerCase().includes('api key'))) {
      return NextResponse.json({ success: false, error: 'Invalid or missing API key.' }, { status: 401 });
    }

    return NextResponse.json({ success: false, error: error.message || 'Failed to analyze content' }, { status: 500 });
  }
}
