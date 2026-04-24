
"use client";

import { useState } from "react";
import { OptimizedCode  as OptimizedCodeType} from "../../../../types/analysis";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { copyToClipboard, downloadAsFile, getFileExtension } from "@/lib/utils";

interface OptimizedCodeProps {
  optimizedCode: OptimizedCodeType;
  language: string; // needed for file extension on download
}

export default function OptimizedCode({
  optimizedCode,
  language,
}: OptimizedCodeProps) {
  const [copied, setCopied] = useState(false);

  //  Copy handler 
  async function handleCopy() {
    const success = await copyToClipboard(optimizedCode.code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  //  Download handler
  function handleDownload() {
    const extension = getFileExtension(language);
    const filename  = `optimized_code.${extension}`;
    downloadAsFile(optimizedCode.code, filename);
  }

  return (
    <Card
      title="Optimized Code"
      headerAction={
        // Language badge in header
        <Badge variant="indigo">{language}</Badge>
      }
    >
      <div className="space-y-3">

        <div className="flex items-center justify-end gap-2">

          {/* Copy button — shows feedback after click */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5"
          >
            {copied ? (
              <>
                {/* Checkmark icon when copied */}
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                {/* Copy icon default state */}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </Button>

          {/* Download button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="gap-1.5"
          >
            {/* Download icon */}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </Button>

        </div>

        {/*Code block*/}
        <div className="relative">
          <div className="
            bg-gray-950 rounded-xl
            border border-gray-800
            overflow-auto max-h-96
          ">
            {/* Language label inside code block */}
            <div className="
              flex items-center justify-between
              px-4 py-2
              border-b border-gray-800
            ">
              <span className="text-xs text-gray-500 font-mono">
                {language}
              </span>
              {/* Three dot decoration — code editor feel */}
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
              </div>
            </div>

            {/* The actual code */}
            <pre className="p-4 text-sm text-gray-100 font-mono leading-6 overflow-x-auto">
              <code>{optimizedCode.code}</code>
            </pre>
          </div>
        </div>

        {optimizedCode.notes && (
          <div className="
            bg-indigo-50 border border-indigo-100
            rounded-lg px-4 py-3
          ">
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">
              What Changed
            </p>
            <p className="text-sm text-indigo-700 leading-relaxed">
              {optimizedCode.notes}
            </p>
          </div>
        )}

      </div>
    </Card>
  );
}