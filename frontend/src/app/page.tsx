"use client";
import { useState } from "react";

import { Language } from "../../types/analysis";
import EditorPanel from "./components/editor/EditorPanel";
export default function Home() {

  const [isLoading, setIsLoading] = useState(false);

  // test loading state
  function handleAnalyze(code: string, language: Language) {
    console.log("Analyzing:", { language, lines: code.split("\n").length });
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  }


  return (
    <main className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-2xl mx-auto">
        <EditorPanel
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}