'use client';

import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

interface TextPreviewProps {
  text?: string;
  metadata?: {
    wordCount: number;
    characterCount: number;
  } | null;
}

export default function TextPreview({ text, metadata }: TextPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!text && !metadata) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-[12px] shadow-sm h-full min-h-[200px] flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            Extracted Text
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-[13px]">
          Waiting for extraction...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-[12px] shadow-sm overflow-hidden flex flex-col min-h-[350px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          <h3 className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">Extracted Text</h3>
        </div>
        <div className="flex items-center gap-3">
          {metadata && (
            <div className="hidden sm:flex items-center gap-1.5 text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
              <span>{metadata.wordCount} words</span>
              <span className="text-neutral-300 dark:text-neutral-600">•</span>
              <span>{metadata.characterCount} chars</span>
            </div>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 text-[12px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-[4px] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        <textarea
          className="w-full h-full min-h-[300px] p-4 bg-white dark:bg-neutral-900 text-[13px] text-neutral-800 dark:text-neutral-200 font-mono leading-relaxed resize-none focus:outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
          value={text || ''}
          readOnly
          placeholder="Extracted text will appear here..."
        />
      </div>
    </div>
  );
}
