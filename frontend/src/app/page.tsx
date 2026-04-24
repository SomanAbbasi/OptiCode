"use client";
import { useState } from "react";
import { Language } from "../../types/analysis";
import EditorPanel from "./components/editor/EditorPanel";
import { useAnalyzer } from "@/hooks/useAnalyzer"; 
import SummaryCard from "./components/results/SummaryCard";
import IssuesList from "./components/results/IssuesList";
import OptimizationList from "./components/results/OptimizationList";
import ExplanationPanel from "./components/results/ExplanationPanel";
import OptimizedCode from "./components/results/OptimizedCode";


export default function Home() {
  const { status, result, error, analyze } = useAnalyzer();

  // Track selected language so OptimizedCode knows the file extension
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("python");

  function handleAnalyze(code: string, language: Language) {
    setSelectedLanguage(language);
    analyze(code, language);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Left — Editor */}
          <EditorPanel
            onAnalyze={handleAnalyze}
            isLoading={status === "loading"}
          />

          {/* Right — Results */}
          <div className="space-y-4">

            {/* Error state */}
            {status === "error" && error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-medium text-red-600">Error</p>
                <p className="text-sm text-red-500 mt-1">{error}</p>
              </div>
            )}

            {/* Loading skeletons */}
            {status === "loading" && (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
                  >
                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
                    <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            )}

            {/* All five result components */}
            {status === "success" && result && (
              <>
                <SummaryCard
                  analysis={result.analysis}
                  syntaxCheck={result.syntax_check}
                />
                <IssuesList
                  issues={result.issues}
                />
                <OptimizationList
                  optimizations={result.optimizations}
                />
                <ExplanationPanel
                  analysis={result.analysis}
                  issues={result.issues}
                  optimizations={result.optimizations}
                  optimizedNotes={
                    result.optimized_code.notes ??
                    result.optimized_code.description ??
                    ""
                  }
                />
                <OptimizedCode
                  optimizedCode={result.optimized_code}
                  language={selectedLanguage}
                />
              </>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}