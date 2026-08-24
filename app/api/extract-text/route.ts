import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';
    
    if (file.type === 'application/pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (file.type.startsWith('image/')) {
      const { data } = await Tesseract.recognize(buffer, 'eng');
      text = data.text;
    } else {
      return NextResponse.json({ success: false, error: 'Unsupported file type' }, { status: 400 });
    }

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characterCount = text.length;

    return NextResponse.json({
      success: true,
      text,
      metadata: {
        wordCount,
        characterCount,
        fileType: file.type
      }
    });

  } catch (error) {
    console.error('Extraction error:', error);
    return NextResponse.json({ success: false, error: 'Failed to extract text from file' }, { status: 500 });
  }
}
