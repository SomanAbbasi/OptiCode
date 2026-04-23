"use client";

import { useState } from "react";
import { Language } from "../../../../types/analysis";
import LanguageSelector from "./LanguageSelector";
import FileUploader from "./FileUploader";
import CodeEditor from "./CodeEditot";
import Button from "../ui/Button";

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

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Code Analyzer
        </h2>

        {code.trim() && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Language selector && upload button row*/}
      <div className="flex items-end gap-3">
        <div className="w-36">
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
      />

      <Button
        variant="primary"
        size="lg"
        loading={isLoading}
        disabled={!code.trim() || isLoading}
        onClick={handleAnalyze}
        className="w-full"
      >
        {isLoading ? "Analyzing..." : "Analyze Code"}
      </Button>

    </div>
  );
}