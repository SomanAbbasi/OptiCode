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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e7eefc_0%,#f7f9ff_42%,#f7fafc_100%)] flex flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/75">
        <div className="mx-auto flex w-full max-w-400 items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] shadow-[0_10px_30px_-12px_rgba(30,64,175,0.8)]">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8 7h8M8 12h8m-8 5h8M4 7h.01M4 12h.01M4 17h.01"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900">
                OptiCode Workspace
              </h1>
              <p className="text-xs font-medium text-slate-500">
                AI Code Optimizer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                status === "idle"
                  ? "bg-slate-300"
                  : status === "loading"
                  ? "bg-amber-400 animate-pulse"
                  : status === "success"
                  ? "bg-emerald-500"
                  : "bg-rose-500"
              }`}
            />
            <span className="text-xs font-semibold text-slate-600 capitalize">
              {status === "idle" ? "Ready" : ""}
              {status === "loading" ? "Analyzing" : ""}
              {status === "success" ? "Complete" : ""}
              {status === "error" ? "Failed" : ""}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-400 flex-1 flex-col px-4 pb-6 pt-4 sm:px-6 lg:pb-8">
        <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(420px,1fr)_minmax(480px,1fr)]">
          <section className="min-h-130 rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)]">
            <div className="h-full overflow-hidden p-4 sm:p-5">
              <EditorPanel
                onAnalyze={handleAnalyze}
                isLoading={status === "loading"}
              />
            </div>
          </section>

          <section className="min-h-130 rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)]">
            <div className="h-full overflow-hidden p-4 sm:p-5">
              <ResultsPanel
                status={status}
                result={result}
                error={error}
                language={selectedLanguage}
              />
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/90 px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
        <p>
          © 2026{" "}
          <a
            href="https://www.somanabbasi.tech/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-slate-700 transition-colors hover:text-blue-600"
          >
            Soman Abbasi
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}