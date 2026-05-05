
import { AnalyzeRequest, AnalysisResult } from "../../types/analysis";

function backendUnavailableMessage(): string {
  return "Analysis service is temporarily unavailable. Please try again in a few moments.";
}

export async function analyzeCode(
  payload: AnalyzeRequest
): Promise<AnalysisResult> {
  let response: Response;

  try {
    response = await fetch("/api/analyze", {
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