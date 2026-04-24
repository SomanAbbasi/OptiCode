import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e7eefc_0%,#f7f9ff_42%,#f7fafc_100%)] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-3xl items-center justify-center">
        <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_30px_70px_-50px_rgba(15,23,42,0.7)] sm:p-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] shadow-[0_10px_30px_-12px_rgba(30,64,175,0.8)]">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Error 404
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            This page could not be found
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            The link may be broken, or the page might have been moved. Return to
            the main OptiCode workspace and continue your analysis.
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#1d4ed8,#1e40af)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-16px_rgba(30,64,175,0.9)] transition-all hover:brightness-105"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
