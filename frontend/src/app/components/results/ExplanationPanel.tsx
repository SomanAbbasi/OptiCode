
import { Analysis, Issue, Optimization } from "../../../../types/analysis";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface ExplanationPanelProps {
  analysis: Analysis;
  issues: Issue[];
  optimizations: Optimization[];
  // Key changes note from the optimized code block
  optimizedNotes: string;
}

function ExplanationRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      {/* Icon circle */}
      <div className="shrink-0 w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

export default function ExplanationPanel({
  analysis,
  issues,
  optimizations,
  optimizedNotes,
}: ExplanationPanelProps) {
  return (
    <Card title="AI Explanation">
      <div className="space-y-5">

        {/* What was detected*/}
        <ExplanationRow
          label="What Was Detected"
          icon={
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        >
          <div className="flex flex-wrap gap-1.5">
            {analysis.detected_patterns.length > 0
              ? analysis.detected_patterns.map((p) => (
                  <Badge key={p} variant="indigo">{p}</Badge>
                ))
              : <p className="text-sm text-gray-400">No patterns detected</p>
            }
          </div>
        </ExplanationRow>

        {/* Why it is inefficient */}
        {issues.length > 0 && (
          <ExplanationRow
            label="Why This Code Is Inefficient"
            icon={
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            }
          >
            <div className="space-y-2">
              {issues.map((issue, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">
                  {issue.reason}
                </p>
              ))}
            </div>
          </ExplanationRow>
        )}

        {/* Recommended approaches*/}
        {optimizations.length > 0 && (
          <ExplanationRow
            label="Recommended Approaches"
            icon={
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          >
            <div className="flex flex-wrap gap-1.5">
              {optimizations.map((opt) => (
                <Badge key={opt.approach} variant="success">
                  {opt.approach}
                </Badge>
              ))}
            </div>
          </ExplanationRow>
        )}

        {/* Key changes made*/}
        {optimizedNotes && (
          <ExplanationRow
            label="Key Changes Made"
            icon={
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              {optimizedNotes}
            </p>
          </ExplanationRow>
        )}

      </div>
    </Card>
  );
}