
import { Issue } from "../../../../types/analysis";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface IssuesListProps {
  issues: Issue[];
}

function getBadgeVariant(
  type: string
): "high" | "medium" | "low" | "default" {
  const t = type.toLowerCase();
  if (t === "high" || t === "critical") return "high";
  if (t === "medium" || t === "performance") return "medium";
  if (t === "low" || t === "style") return "low";
  return "default";
}

function getBorderColor(type: string): string {
  const t = type.toLowerCase();
  if (t === "high" || t === "critical") return "border-l-red-400";
  if (t === "medium" || t === "performance") return "border-l-amber-400";
  return "border-l-blue-400";
}

export default function IssuesList({ issues }: IssuesListProps) {
  return (
    <Card
      title="Issues Detected"
      headerAction={
        // Shows total count of issues found
        <span className="text-xs font-medium text-gray-400">
          {issues.length} {issues.length === 1 ? "issue" : "issues"} found
        </span>
      }
    >
      {/* Empty state — shown when no issues found */}
      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          {/* Checkmark icon */}
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-400">No issues detected</p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue, index) => (
            <div
              key={index}
              className={`
                bg-gray-50 rounded-lg p-3
                border-l-4 border border-gray-100
                ${getBorderColor(issue.type)}
              `}
            >
              {/* Issue header — type badge */}
              <div className="flex items-center justify-between mb-2">
                <Badge variant={getBadgeVariant(issue.type)}>
                  {issue.type}
                </Badge>
              </div>

              {/* Issue description */}
              <p className="text-sm text-gray-700 font-medium mb-1">
                {issue.description}
              </p>

              {/* Reason — why this is a problem */}
              <p className="text-xs text-gray-500 leading-relaxed">
                {issue.reason}
              </p>

            </div>
          ))}
        </div>
      )}
    </Card>
  );
}