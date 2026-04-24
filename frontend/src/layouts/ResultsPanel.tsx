"use client";

import { useMemo, useState } from "react";
import { AnalysisResult, AnalyzerStatus, Language } from "../../types/analysis";
import SummaryCard from "@/app/components/results/SummaryCard";
import IssuesList from "@/app/components/results/IssuesList";
import OptimizationList from "@/app/components/results/OptimizationList";
import ExplanationPanel from "@/app/components/results/ExplanationPanel";
import OptimizedCode from "@/app/components/results/OptimizedCode";


interface ResultsPanelProps {
  status: AnalyzerStatus;
  result: AnalysisResult | null;
  error: string | null;
  language: Language; // passed to OptimizedCode for file extension
}

type ResultsTab = "analysis" | "optimized";

function EmptyState() {
  return (
    <div className="
      flex flex-col items-center justify-center
      h-full min-h-125 gap-4
      bg-white rounded-xl border border-dashed border-slate-300
    ">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
        <svg
          className="w-7 h-7 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-slate-700">
          Ready to Analyze
        </p>
        <p className="text-xs text-slate-500 max-w-55 leading-relaxed">
          Paste your code on the left and click Analyze Code to get started
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-65">
        {[
          "Complexity Analysis",
          "Issue Detection",
          "Optimized Code",
          "Algorithm Suggestions",
        ].map((hint) => (
          <span
            key={hint}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-1 rounded-full"
          >
            {hint}
          </span>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 pt-2">
      {[
        "w-1/3",  
        "w-1/2", 
        "w-2/5",  
        "w-1/3",  
        "w-1/2",  
      ].map((width, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse"
        >
          <div className={`h-4 bg-slate-100 rounded ${width} mb-4`} />
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-4/5" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-red-600">
          Analysis Failed
        </p>
      </div>
      {/* Error message */}
      <p className="text-sm text-red-500 leading-relaxed">{message}</p>
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
        active
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-500 hover:text-slate-700"
      }`}
      type="button"
    >
      {label}
    </button>
  );
}

export default function ResultsPanel({
  status,
  result,
  error,
  language,
}: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<ResultsTab>("analysis");

  const canShowOptimizedTab = useMemo(() => {
    return status === "success" && Boolean(result?.optimized_code?.code);
  }, [result, status]);

  const showTabs = status === "success" && result;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-1.5">
        <div className="flex items-center gap-1.5">
          <TabButton
            active={activeTab === "analysis"}
            label="Code Analysis Summary"
            onClick={() => setActiveTab("analysis")}
          />
          <TabButton
            active={activeTab === "optimized"}
            label="Optimized Code"
            onClick={() => setActiveTab("optimized")}
          />
        </div>
        <span className="text-xs font-medium text-slate-500 pr-2 hidden sm:block">
          {showTabs ? "Result ready" : "Waiting for input"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
      {status === "idle" && <EmptyState />}
      {status === "loading" && <LoadingSkeleton />}
      {status === "error" && error && (
        <ErrorCard message={error} />
      )}

      {status === "success" && result && (
        <>
          {activeTab === "analysis" && (
            <div className="space-y-4 pb-1">
              <SummaryCard
                analysis={result.analysis}
                syntaxCheck={result.syntax_check}
              />
              <IssuesList issues={result.issues} />
              <OptimizationList optimizations={result.optimizations} />
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
            </div>
          )}

          {activeTab === "optimized" && canShowOptimizedTab && (
            <OptimizedCode
              optimizedCode={result.optimized_code}
              language={language}
            />
          )}
        </>
      )}
      </div>
    </div>
  );
}