
import { AnalyzeRequest,AnalysisResult } from "../../types/analysis";

const LOCAL_API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;
const LIVE_API_URL = process.env.NEXT_PUBLIC_LIVE_API_URL;

function isLocalHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function backendUnavailableMessage(): string {
  return isLocalHost()
    ? "Cannot reach the backend. Make sure your Flask server is running."
    : "Analysis service is temporarily unavailable. Please try again in a few moments.";
}

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
    isLocalHost()
      ? "Backend URL is not configured. Set NEXT_PUBLIC_API_URL or both NEXT_PUBLIC_LOCAL_API_URL and NEXT_PUBLIC_LIVE_API_URL."
      : "Analysis service is currently unavailable. Please try again later."
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
    throw new Error(backendUnavailableMessage());
  }

  let data: unknown = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text ? { message: text } : {};
  }

  const parsed = (data && typeof data === "object" ? data : {}) as {
    errors?: string[];
    message?: string;
  };

  if (response.status === 400) {
    const messages: string[] = parsed.errors ?? ["Invalid request."];
    throw new Error(messages.join(" "));
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error(backendUnavailableMessage());
    }

    throw new Error(
      parsed.message ?? "We could not process your request. Please try again."
    );
  }

  return data as AnalysisResult;
}