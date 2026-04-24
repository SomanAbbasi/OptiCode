
import React from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "error"
  | "high"
  | "medium"
  | "low"
  | "indigo";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

// Each variant maps to a background + text color pair
const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100/70 text-emerald-800",
  error:   "bg-rose-100/70 text-rose-800",
  high:    "bg-rose-100/70 text-rose-800",
  medium:  "bg-amber-100/80 text-amber-800",
  low:     "bg-blue-100/80 text-blue-800",
  indigo:  "bg-blue-100/80 text-blue-800",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2.5 py-0.5 rounded-full border border-white/70
        text-xs font-semibold
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}