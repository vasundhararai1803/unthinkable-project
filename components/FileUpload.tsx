'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, File as FileIcon, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface FileUploadProps {
  onFileSelect?: (file: File | null) => void;
  onExtract?: () => void;
  isExtracting?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUpload({ onFileSelect, onExtract, isExtracting }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);

    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Maximum size is 10MB.');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload a PDF or an image (PNG/JPEG).');
      } else {
        setError(rejection.errors[0]?.message || 'An error occurred during upload.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      if (onFileSelect) onFileSelect(selectedFile);

      // Create object URL for preview if it's an image
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [onFileSelect]);

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (onFileSelect) onFileSelect(null);
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    multiple: false
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (file) {
    const isImage = file.type.startsWith('image/');
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 p-2 border border-neutral-200/60 rounded-[8px] bg-neutral-50/50 shadow-sm">
          <div className="flex-shrink-0 w-8 h-8 rounded-[4px] bg-white border border-neutral-200/60 flex items-center justify-center overflow-hidden">
            {isImage && previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : isImage ? (
              <ImageIcon className="w-4 h-4 text-neutral-500" />
            ) : (
              <FileIcon className="w-4 h-4 text-neutral-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-neutral-800 truncate leading-tight">
              {file.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-neutral-400">{formatFileSize(file.size)}</span>
              <span className="w-0.5 h-0.5 rounded-full bg-neutral-300"></span>
              <span className="text-[10px] font-medium text-neutral-500 tracking-wider">
                {isImage ? 'IMAGE' : 'PDF'}
              </span>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/50 rounded-[4px] transition-colors mr-1"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <button 
          onClick={onExtract}
          disabled={isExtracting}
          className={cn(
            "w-full flex items-center justify-center gap-2 text-[13px] font-medium py-2 px-4 rounded-[6px] transition-all",
            isExtracting 
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200" 
              : "bg-white hover:bg-neutral-50 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-200"
          )}
        >
          {isExtracting ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Extract Text'
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        className={cn(
          "relative border border-dashed rounded-[8px] p-6 text-center cursor-pointer transition-all duration-200 ease-in-out",
          isDragActive ? "border-neutral-400 bg-neutral-100" : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/50 hover:border-neutral-300",
          isDragReject && "border-red-500 bg-red-50"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-white border border-neutral-200/60 shadow-sm">
            <UploadCloud className="w-4 h-4 text-neutral-500" />
          </div>
          
          <div className="space-y-0.5 mt-1">
            <p className="text-[13px] font-medium text-neutral-700">
              Drop file here or <span className="text-neutral-900 underline decoration-neutral-300 underline-offset-2">browse</span>
            </p>
            <p className="text-[11px] text-neutral-400">
              Supports PDF, PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
