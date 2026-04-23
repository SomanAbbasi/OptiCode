"use client";
import { useState } from "react";

import { Language } from "../../types/analysis";
import EditorPanel from "./components/editor/EditorPanel";

import { useAnalyzer } from "@/hooks/useAnalyzer"; 

export default function Home() {
  const { status, result, error, analyze } = useAnalyzer();

  function handleAnalyze(code: string, language: Language) {
    analyze(code, language);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Editor Panel */}
        <EditorPanel
          onAnalyze={handleAnalyze}
          isLoading={status === "loading"}
        />

        {/* Status indicator */}
        <div className="text-sm font-mono text-gray-500">
          Status: <span className="text-indigo-600 font-semibold">{status}</span>
        </div>

        {/* Error message */}
        {status === "error" && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">Error</p>
            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
        )}

        {/* Raw JSON result — proof the full flow works */}
        {status === "success" && result && (
          <div className="bg-gray-950 rounded-xl p-4 overflow-auto max-h-96">
            <pre className="text-xs text-gray-100 font-mono">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </main>
  );
}