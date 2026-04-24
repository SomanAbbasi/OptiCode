
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

function EmptyState() {
  return (
    <div className="
      flex flex-col items-center justify-center
      h-full min-h-[500px] gap-4
      bg-white rounded-xl border border-dashed border-gray-200
    ">
      {/* Icon */}
      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
        <svg
          className="w-7 h-7 text-indigo-400"
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

      {/* Text */}
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-gray-700">
          Ready to Analyze
        </p>
        <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
          Paste your code on the left and click Analyze Code to get started
        </p>
      </div>

      {/* Hint pills */}
      <div className="flex flex-wrap justify-center gap-2 max-w-[260px]">
        {[
          "Complexity Analysis",
          "Issue Detection",
          "Optimized Code",
          "Algorithm Suggestions",
        ].map((hint) => (
          <span
            key={hint}
            className="text-xs bg-gray-50 border border-gray-200 text-gray-400 px-2.5 py-1 rounded-full"
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
    <div className="space-y-4">
      {[
        "w-1/3",  
        "w-1/2", 
        "w-2/5",  
        "w-1/3",  
        "w-1/2",  
      ].map((width, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
        >
          {/* Fake card header */}
          <div className={`h-4 bg-gray-100 rounded ${width} mb-4`} />
          {/* Fake card content lines */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-4/5" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

//  Error state  shown when API or network fails 
function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5">
      {/* Header */}
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

//  Main ResultsPanel export
export default function ResultsPanel({
  status,
  result,
  error,
  language,
}: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* Idle — nothing submitted yet */}
      {status === "idle" && <EmptyState />}

      {/* Loading — API call in progress */}
      {status === "loading" && <LoadingSkeleton />}

      {/* Error — API or network failure */}
      {status === "error" && error && (
        <ErrorCard message={error} />
      )}

      {/* Success — render all result components */}
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
            language={language}
          />
        </>
      )}

    </div>
  );
}