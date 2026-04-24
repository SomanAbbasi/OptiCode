"use client";
import { useState } from "react";
import { Language } from "../../types/analysis";
import EditorPanel from "./components/editor/EditorPanel";
import { useAnalyzer } from "@/hooks/useAnalyzer"; 

import ResultsPanel from "@/layouts/ResultsPanel";

export default function Home() {
  const { status, result, error, analyze } = useAnalyzer();

  // Tracked here so ResultsPanel can pass it to OptimizedCode
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("python");

  function handleAnalyze(code: string, language: Language) {
    setSelectedLanguage(language);
    analyze(code, language);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="
        bg-white border-b border-gray-200
        px-6 py-4
        flex items-center justify-between
        sticky top-0 z-10
      ">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          {/* Logo icon */}
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-none">
              OptiCode
            </h1>
            <p className="text-xs text-gray-400 leading-none mt-0.5">
              AI Code Optimizer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`
            w-2 h-2 rounded-full
            ${status === "idle"    ? "bg-gray-300"    : ""}
            ${status === "loading" ? "bg-amber-400 animate-pulse" : ""}
            ${status === "success" ? "bg-emerald-400" : ""}
            ${status === "error"   ? "bg-red-400"     : ""}
          `} />
          <span className="text-xs text-gray-400 capitalize hidden sm:block">
            {status === "idle"    ? "Ready"     : ""}
            {status === "loading" ? "Analyzing" : ""}
            {status === "success" ? "Complete"  : ""}
            {status === "error"   ? "Failed"    : ""}
          </span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">

        {/* Left panel — Editor */}
        <div className="
          border-r border-gray-200
          p-6 overflow-y-auto
          lg:h-[calc(100vh-57px)]
        ">
          <EditorPanel
            onAnalyze={handleAnalyze}
            isLoading={status === "loading"}
          />
        </div>

        {/* Right panel — Results */}
        <div className="
          p-6 overflow-y-auto
          lg:h-[calc(100vh-57px)]
        ">
          <ResultsPanel
            status={status}
            result={result}
            error={error}
            language={selectedLanguage}
          />
        </div>

      </main>

    </div>
  );
}