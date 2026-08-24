import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Moon } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social Media Content Analyzer",
  description: "Upload documents and images to extract text and get engagement insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900" suppressHydrationWarning>
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-neutral-900 rounded-[6px] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
                Content Analyzer
              </span>
            </div>
            <button className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-900" aria-label="Toggle dark mode">
              <Moon className="w-[18px] h-[18px]" />
            </button>
          </div>
        </header>
        <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
