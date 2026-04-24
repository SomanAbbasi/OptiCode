"use client";

import { useState } from "react";
import { Language } from "../../../../types/analysis";
import LanguageSelector from "./LanguageSelector";
import FileUploader from "./FileUploader";
import CodeEditor from "./CodeEditot";

interface EditorPanelProps {
  // Called when user clicks Analyze — passes code and language up
  onAnalyze: (code: string, language: Language) => void;
  // True while API call is in progress
  isLoading: boolean;
}

export default function EditorPanel({
  onAnalyze,
  isLoading,
}: EditorPanelProps) {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<Language>("python");

  // Called when FileUploader reads a file — puts content into editor
  function handleFileLoad(content: string) {
    setCode(content);
  }

  // Called when Analyze button is clicked
  function handleAnalyze() {
    if (!code.trim()) return; // do nothing if editor is empty
    onAnalyze(code, language);
  }

  // Clears the editor
  function handleClear() {
    setCode("");
  }

  return (
    <div className="flex flex-col gap-4 h-full">

      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Code Analyzer
          </h2>
          <p className="text-xs text-slate-500">
            Paste code or upload a file, then run optimization analysis.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="w-full sm:w-40">
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            disabled={isLoading}
          />
        </div>

        <FileUploader
          onFileLoad={handleFileLoad}
          disabled={isLoading}
        />
      </div>

      <CodeEditor
        value={code}
        onChange={setCode}
        language={language}
        disabled={isLoading}
        onClear={handleClear}
        showClearButton={Boolean(code.trim())}
        onAnalyze={handleAnalyze}
        isAnalyzeDisabled={!code.trim() || isLoading}
        isAnalyzeLoading={isLoading}
      />

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        <span>Better results with complete functions or classes.</span>
        <span className="hidden sm:block">Supports C++, C, Java, C#, Python</span>
      </div>
    </div>
  );
}