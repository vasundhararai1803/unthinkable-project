'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import TextPreview from '@/components/TextPreview';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import { UploadCloud, FileText, BarChart2, ArrowRight } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [extractionMetadata, setExtractionMetadata] = useState<{wordCount: number, characterCount: number, fileType: string} | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleExtract = async () => {
    if (!selectedFile) return;

    setIsExtracting(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setExtractedText(data.text);
        setExtractionMetadata(data.metadata);
      } else {
        alert(data.error || 'Failed to extract text');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during extraction');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!extractedText) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ extractedText }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze content');
      }
      
      if (data.success) {
        setAnalysisData(data.analysis);
      } else {
        alert(data.error || 'Failed to analyze text');
      }
    } catch (error: any) {
      console.error('Analyze error:', error);
      alert(error.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          New Analysis
        </h1>
        <p className="text-[13px] text-neutral-500">
          Upload a document or image to extract text and generate engagement insights.
        </p>
      </div>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
        {/* Left Side: Input / Upload & Preview */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-[12px] shadow-sm border border-neutral-200/60 overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <h2 className="text-[13px] font-medium text-neutral-700 flex items-center gap-2">
                Source File
              </h2>
            </div>
            <div className="p-4">
              <FileUpload 
                onFileSelect={setSelectedFile} 
                onExtract={handleExtract}
                isExtracting={isExtracting}
              />
            </div>
          </div>
          
          <TextPreview text={extractedText} metadata={extractionMetadata} />
          
          {extractedText && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`w-full flex items-center justify-center gap-2 text-[14px] font-medium py-2.5 px-4 rounded-[8px] transition-all ${
                isAnalyzing
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm ring-1 ring-inset ring-neutral-900/10'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing content...
                </>
              ) : (
                'Run Analysis'
              )}
            </button>
          )}
        </div>

        {/* Right Side: Results / Analytics */}
        <div className="h-full min-h-[600px]">
          <AnalysisDashboard data={analysisData} />
        </div>
      </section>
    </div>
  );
}
