import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("GROQ_API_KEY is missing in environment variables.");
      return NextResponse.json(
        { error: "API key is not configured. Set GROQ_API_KEY in your .env file." },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });
    const { extractedText } = await req.json();

    if (!extractedText) {
      return NextResponse.json(
        { error: "Extracted text is missing" },
        { status: 400 }
      );
    }

    const prompt = `You are a social media analyzer. Analyze this text and return valid raw JSON matching this format:
{
  "engagementScore": 85,
  "tone": "Professional",
  "strengths": ["Clear CTA", "Good layout"],
  "weaknesses": ["Needs hashtags"],
  "improvementSuggestions": ["Add relevant tags"],
  "suggestedHashtags": ["#tech", "#software"],
  "optimizedVersion": "Better version here"
}`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: extractedText },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content);

    return NextResponse.json({ success: true, analysis });
  } catch (err: any) {
    console.error("Groq API Detailed Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze" },
      { status: 500 }
    );
  }
}
