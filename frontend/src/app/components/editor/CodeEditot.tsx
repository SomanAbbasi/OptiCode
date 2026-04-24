
"use client";

import Button from "../ui/Button";

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  language: string;
  disabled?: boolean; // locked while analysis is running
  onClear?: () => void;
  showClearButton?: boolean;
  onAnalyze?: () => void;
  isAnalyzeDisabled?: boolean;
  isAnalyzeLoading?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  disabled = false,
  onClear,
  showClearButton = false,
  onAnalyze,
  isAnalyzeDisabled = false,
  isAnalyzeLoading = false,
}: CodeEditorProps) {
  const lines = value.split("\n");
  const lineCount = Math.max(lines.length, 20);

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Code Editor
          <span className="ml-2 normal-case text-blue-600 font-semibold">
            {language}
          </span>
        </label>

        <div className="flex items-center gap-2">
          {showClearButton && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
              type="button"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}

          <Button
            variant="primary"
            size="md"
            loading={isAnalyzeLoading}
            disabled={isAnalyzeDisabled}
            onClick={onAnalyze}
          >
            {isAnalyzeLoading ? "Analyzing..." : "Analyze Code"}
          </Button>
        </div>
      </div>

      <div className="
        flex flex-1 min-h-105
        bg-[#071024] rounded-2xl border border-slate-900/70
        overflow-hidden font-mono text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
      ">

        <div className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700/80 bg-slate-900/90 px-3 py-2 text-[11px] text-slate-300 backdrop-blur">
            <span className="font-semibold tracking-wide uppercase">Source</span>
            <span className="text-slate-400">{lines.length} lines</span>
          </div>

          <div className="flex min-h-95">
            <div className="
              select-none py-4 px-3
              text-right text-slate-500
              border-r border-slate-800/80
              min-w-14 bg-slate-950/40
            ">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1} className="leading-6 text-xs">
                  {i + 1}
                </div>
              ))}
            </div>

            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              spellCheck={false}
              placeholder={`Paste your ${language} code here...`}
              className="
                flex-1 min-h-95 px-4 py-4
                bg-transparent text-slate-100
                leading-6 resize-none
                focus:outline-none
                placeholder:text-slate-500
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-500">
          {lines.length} {lines.length === 1 ? "line" : "lines"}
        </span>
        <span className="text-xs text-slate-500">
          {value.length} characters
        </span>
      </div>
    </div>
  );
}