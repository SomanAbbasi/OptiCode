



"use client";

import { useRef } from "react";
import Button from "../ui/Button";

interface FileUploaderProps {
  // Called with the file text content when file is selected
  onFileLoad: (content: string) => void;
  disabled?: boolean;
}

// File extensions we accept
const ACCEPTED_EXTENSIONS = ".py,.cpp,.c,.java,.cs,.txt";

export default function FileUploader({
  onFileLoad,
  disabled = false,
}: FileUploaderProps) {
  // Ref to the hidden file input — triggered by button click
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    // When file is read, pass contents up to parent
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onFileLoad(content);
    };

    reader.readAsText(file);

    // Reset input so same file can be re-uploaded if needed
    e.target.value = "";
  }

  return (
    <>
      {/* Visible button — clicking it triggers the hidden input */}
      <Button
        variant="secondary"
        size="md"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="gap-2 rounded-xl"
      >
        {/* Upload icon */}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        Upload
      </Button>

      {/* Hidden file input — never visible to the user */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}