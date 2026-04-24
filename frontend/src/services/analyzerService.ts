
import { AnalyzeRequest,AnalysisResult } from "../../types/analysis";

const LOCAL_API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;
const LIVE_API_URL = process.env.NEXT_PUBLIC_LIVE_API_URL;

function resolveApiUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;

  // If user configured an explicit URL, always respect it.
  if (configuredUrl && configuredUrl.trim()) {
    return configuredUrl.trim();
  }

  // Browser-side auto switching based on current host.
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocalHost = host === "localhost" || host === "127.0.0.1";

    const selectedUrl = isLocalHost ? LOCAL_API_URL : LIVE_API_URL;
    if (selectedUrl && selectedUrl.trim()) {
      return selectedUrl.trim();
    }
  }

  throw new Error(
    "Backend URL is not configured. Set NEXT_PUBLIC_API_URL or both NEXT_PUBLIC_LOCAL_API_URL and NEXT_PUBLIC_LIVE_API_URL."
  );
}

export async function analyzeCode(
  payload: AnalyzeRequest
): Promise<AnalysisResult> {
  const apiUrl = resolveApiUrl();

  let response: Response;

  try {
    response = await fetch(`${apiUrl}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Cannot reach the backend. Make sure your Flask server is running."
    );
  }

  const data = await response.json();

  if (response.status === 400) {
    const messages: string[] = data.errors ?? ["Invalid request."];
    throw new Error(messages.join(" "));
  }

  if (!response.ok) {
    throw new Error(
      data.message ?? `Backend error: ${response.status}`
    );
  }

  return data as AnalysisResult;
}