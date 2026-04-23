
"use client";

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  language: string;
  disabled?: boolean; // locked while analysis is running
}

export default function CodeEditor({
  value,
  onChange,
  language,
  disabled = false,
}: CodeEditorProps) {
  const lines = value.split("\n");
  const lineCount = Math.max(lines.length, 20); 

  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Code Editor
        {/* Show selected language next to label */}
        <span className="ml-2 normal-case text-indigo-500 font-semibold">
          {language}
        </span>
      </label>

      {/* Editor container */}
      <div className="
        flex flex-1 min-h-[420px]
        bg-gray-950 rounded-xl border border-gray-200
        overflow-hidden font-mono text-sm
      ">

        {/* Line numbers column */}
        <div className="
          select-none py-4 px-3
          text-right text-gray-600
          border-r border-gray-800
          min-w-[48px]
        ">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="leading-6 text-xs">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code input area */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          spellCheck={false}
          placeholder={`Paste your ${language} code here...`}
          className="
            flex-1 py-4 px-4
            bg-transparent text-gray-100
            leading-6 resize-none
            focus:outline-none
            placeholder:text-gray-600
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
      </div>

      {/* Bottom info bar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-gray-400">
          {lines.length} {lines.length === 1 ? "line" : "lines"}
        </span>
        <span className="text-xs text-gray-400">
          {value.length} characters
        </span>
      </div>
    </div>
  );
}