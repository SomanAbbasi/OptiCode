
import { AnalyzeRequest,AnalysisResult } from "../../types/analysis";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function analyzeCode(
  payload: AnalyzeRequest
): Promise<AnalysisResult> {

  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined in your .env.local file."
    );
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/analyze`, {
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