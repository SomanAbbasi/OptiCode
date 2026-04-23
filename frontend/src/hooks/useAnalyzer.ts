
"use client";

import { useState } from "react";
import { AnalyzerState,AnalysisResult,Language } from "../../types/analysis"; 
import { analyzeCode } from "@/services/analyzerService";

interface UseAnalyzerReturn {
  status: AnalyzerState["status"];   // idle | loading | success | error
  result: AnalysisResult | null;     // populated when status is success
  error: string | null;              // populated when status is error
  analyze: (code: string, language: Language) => Promise<void>;
  reset: () => void;                 // clears result and goes back to idle
}

export function useAnalyzer(): UseAnalyzerReturn {

  const [state, setState] = useState<AnalyzerState >({
    status: "idle",
    result: null,
    error:  null,
  });

  // Called by EditorPanel when user clicks Analyze
  async function analyze(code: string, language: Language): Promise<void> {

    setState({ status: "loading", result: null, error: null });

    try {
      const result = await analyzeCode({ code, language });

      setState({ status: "success", result, error: null });

    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";

      setState({ status: "error", result: null, error: message });
    }
  }

  // Called when user wants to start a new analysis
  function reset(): void {
    setState({ status: "idle", result: null, error: null });
  }

  return {
    status: state.status,
    result: state.result,
    error:  state.error,
    analyze,
    reset,
  };
}