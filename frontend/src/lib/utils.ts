
// Copies any text string to the user's clipboard.
// Used in OptimizedCode component copy button.
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadAsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getFileExtension(language: string): string {
  const map: Record<string, string> = {
    python : "py",
    "c++"  : "cpp",
    c      : "c",
    java   : "java",
    "c#"   : "cs",
  };
  return map[language.toLowerCase()] ?? "txt";
}