import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;
  const apiKey = process.env.OPTICODE_API_KEY;

  if (!backendUrl) {
    return NextResponse.json(
      {
        message: "Server misconfigured: BACKEND_URL is missing.",
      },
      { status: 500 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        message: "Server misconfigured: OPTICODE_API_KEY is missing.",
      },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${backendUrl}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json(
      { message: "Analysis service is temporarily unavailable." },
      { status: 502 }
    );
  }

  const contentType = backendResponse.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  }

  const text = await backendResponse.text();
  return new NextResponse(text, {
    status: backendResponse.status,
    headers: {
      "Content-Type": contentType || "text/plain",
    },
  });
}

export function GET() {
  return NextResponse.json(
    { message: "Method not allowed." },
    { status: 405 }
  );
}
