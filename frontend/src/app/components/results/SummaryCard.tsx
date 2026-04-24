

import { Analysis,SyntaxCheck } from "../../../../types/analysis";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
interface SummaryCardProps {
  analysis: Analysis;
  syntaxCheck: SyntaxCheck;
}

function getComplexityVariant(
  complexity: string
): "error" | "medium" | "low" | "success" {
  if (complexity.includes("n^3") || complexity.includes("2^n")) return "error";
  if (complexity.includes("n^2")) return "medium";
  if (complexity.includes("n log") || complexity.includes("n)")) return "low";
  return "success";
}

export default function SummaryCard({
  analysis,
  syntaxCheck,
}: SummaryCardProps) {
  return (
    <Card
      title="Summary"
      headerAction={
        <Badge variant={syntaxCheck.valid ? "success" : "error"}>
          {syntaxCheck.valid ? "Syntax Valid" : "Syntax Error"}
        </Badge>
      }
    >
      <div className="space-y-4">

        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Detected Patterns
          </p>
          {analysis.detected_patterns.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {analysis.detected_patterns.map((pattern) => (
                <Badge key={pattern} variant="indigo">
                  {pattern}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No patterns detected</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">

          {/* Time complexity */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Time Complexity</p>
            <p className={`
              text-lg font-bold font-mono
              ${getComplexityVariant(analysis.time_complexity) === "error"
                ? "text-red-500"
                : getComplexityVariant(analysis.time_complexity) === "medium"
                ? "text-amber-500"
                : getComplexityVariant(analysis.time_complexity) === "low"
                ? "text-blue-500"
                : "text-emerald-500"
              }
            `}>
              {analysis.time_complexity}
            </p>
          </div>

          {/* Space complexity */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Space Complexity</p>
            <p className={`
              text-lg font-bold font-mono
              ${getComplexityVariant(analysis.space_complexity) === "error"
                ? "text-red-500"
                : getComplexityVariant(analysis.space_complexity) === "medium"
                ? "text-amber-500"
                : getComplexityVariant(analysis.space_complexity) === "low"
                ? "text-blue-500"
                : "text-emerald-500"
              }
            `}>
              {analysis.space_complexity}
            </p>
          </div>

        </div>

        {/* Syntax errors list — only shown when invalid */}
        {!syntaxCheck.valid && syntaxCheck.errors.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-red-500 uppercase tracking-wide">
              Syntax Errors
            </p>
            {syntaxCheck.errors.map((err, i) => (
              <div key={i} className="flex items-start gap-2">
                {/* Line number pill */}
                <span className="
                  shrink-0 text-xs font-mono
                  bg-red-100 text-red-500
                  px-1.5 py-0.5 rounded
                ">
                  Line {err.line}
                </span>
                <p className="text-xs text-red-600">{err.message}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </Card>
  );
}