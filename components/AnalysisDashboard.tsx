'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Hash, 
  Copy, 
  Check, 
  BarChart3, 
  TrendingUp
} from 'lucide-react';

export interface AnalysisData {
  engagementScore: number;
  tone: string;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  suggestedHashtags: string[];
  optimizedVersion: string;
}

interface AnalysisDashboardProps {
  data?: AnalysisData | null;
}

const ScoreBar = ({ score }: { score: number }) => {
  let colorClass = "bg-emerald-500";
  let textClass = "text-emerald-700";
  let label = "High Engagement";
  
  if (score <= 40) {
    colorClass = "bg-rose-500";
    textClass = "text-rose-700";
    label = "Needs Work";
  } else if (score <= 70) {
    colorClass = "bg-amber-500";
    textClass = "text-amber-700";
    label = "Moderate";
  }

  return (
    <div className="flex flex-col gap-1.5 w-full sm:max-w-[200px]">
      <div className="flex items-end justify-between">
        <span className={`text-[12px] font-medium ${textClass}`}>{label}</span>
        <span className="text-[13px] font-semibold text-neutral-900">{score}<span className="text-neutral-400 font-normal">/100</span></span>
      </div>
      <div className="h-1.5 w-full bg-neutral-200/60 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
};

export default function AnalysisDashboard({ data }: AnalysisDashboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data) {
    return (
      <div className="bg-white border border-neutral-200/60 rounded-[12px] shadow-sm h-full min-h-[600px] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-neutral-50 border border-neutral-200/60 rounded-[8px] flex items-center justify-center mb-4">
          <BarChart3 className="w-5 h-5 text-neutral-400" />
        </div>
        <h3 className="text-[14px] font-medium text-neutral-900 mb-1">No Analysis Data</h3>
        <p className="text-[13px] text-neutral-500 max-w-[250px] leading-relaxed">
          Run an analysis on your extracted text to view engagement insights.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200/60 rounded-[12px] shadow-sm overflow-hidden h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards">
      
      {/* Header Overview */}
      <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[15px] font-semibold text-neutral-900 flex items-center gap-2">
            Analysis Results
          </h2>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-white border border-neutral-200 text-neutral-600 text-[11px] font-medium uppercase tracking-wider shadow-sm">
              Tone: {data.tone}
            </span>
          </div>
        </div>
        <ScoreBar score={data.engagementScore} />
      </div>

      <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-6">
        
        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Strengths
            </h3>
            <ul className="flex flex-col gap-2.5">
              {data.strengths.map((strength, i) => (
                <li key={i} className="text-[13px] text-neutral-700 leading-relaxed pl-3 border-l-[2px] border-emerald-500/40">
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Weaknesses
            </h3>
            <ul className="flex flex-col gap-2.5">
              {data.weaknesses.map((weakness, i) => (
                <li key={i} className="text-[13px] text-neutral-700 leading-relaxed pl-3 border-l-[2px] border-amber-500/40">
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-100" />

        {/* Recommendations */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            Actionable Steps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.improvementSuggestions.map((suggestion, i) => (
              <div key={i} className="bg-neutral-50/50 border border-neutral-200/60 p-3 rounded-[8px] flex items-start gap-2.5">
                <span className="text-[11px] font-mono text-neutral-400 mt-0.5">{i + 1}.</span>
                <p className="text-[13px] text-neutral-700 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-neutral-100" />

        {/* Optimized Rewrite */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Optimized Version
            </h3>
            <button
              onClick={() => handleCopy(data.optimizedVersion)}
              className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-[4px] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-neutral-900" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-neutral-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-neutral-900 rounded-[8px] p-4 text-[13px] text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto shadow-inner">
            {data.optimizedVersion}
          </div>
        </div>

        {/* Hashtags */}
        {data.suggestedHashtags && data.suggestedHashtags.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              {data.suggestedHashtags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => handleCopy(tag)}
                  className="px-2 py-1 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-600 text-[11px] font-medium rounded-[4px] transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Hash className="w-3 h-3 text-neutral-400" />
                  {tag.replace('#', '')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
