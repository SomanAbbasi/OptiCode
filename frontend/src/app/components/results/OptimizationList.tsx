
import { Optimization } from "../../../../types/analysis";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface OptimizationListProps {
  optimizations: Optimization[];
}

function getComplexityVariant(
  complexity: string
): "error" | "medium" | "low" | "success" {
  if (complexity.includes("n^3") || complexity.includes("2^n")) return "error";
  if (complexity.includes("n^2")) return "medium";
  if (complexity.includes("n log") || complexity.includes("n)")) return "low";
  return "success";
}

function OptimizationItem({
  optimization,
  index,
}: {
  optimization: Optimization;
  index: number;
}) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">

      <div className="flex items-center gap-3">
        {/* Numbered circle */}
        <span className="
          shrink-0 w-6 h-6 rounded-full
          bg-indigo-100 text-indigo-600
          text-xs font-bold
          flex items-center justify-center
        ">
          {index + 1}
        </span>
        <h4 className="text-sm font-semibold text-gray-800">
          {optimization.approach}
        </h4>
      </div>

      {/* Explanation text */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {optimization.explanation}
      </p>

      {/*  Before → After complexity comparison*/}
      <div className="flex items-center gap-2">

        {/* Before badge */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">Before</span>
          <Badge variant={getComplexityVariant(optimization.complexity_before)}>
            {optimization.complexity_before}
          </Badge>
        </div>

        {/* Arrow */}
        <svg
          className="w-4 h-4 text-gray-300 mt-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>

        {/* After badge */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">After</span>
          <Badge variant={getComplexityVariant(optimization.complexity_after)}>
            {optimization.complexity_after}
          </Badge>
        </div>

      </div>

      {/*  Conditions — when this optimization applies  */}
      <div className="bg-white rounded-lg border border-gray-200 px-3 py-2">
        <p className="text-xs font-medium text-gray-400 mb-1">
          Applicable When
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          {optimization.conditions}
        </p>
      </div>

    </div>
  );
}

export default function OptimizationList({
  optimizations,
}: OptimizationListProps) {
  return (
    <Card
      title="Optimization Suggestions"
      headerAction={
        <span className="text-xs font-medium text-gray-400">
          {optimizations.length}{" "}
          {optimizations.length === 1 ? "suggestion" : "suggestions"}
        </span>
      }
    >
      {/* Empty state */}
      {optimizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-400">No optimizations suggested</p>
        </div>
      ) : (
        <div className="space-y-3">
          {optimizations.map((opt, index) => (
            <OptimizationItem
              key={index}
              optimization={opt}
              index={index}
            />
          ))}
        </div>
      )}
    </Card>
  );
}