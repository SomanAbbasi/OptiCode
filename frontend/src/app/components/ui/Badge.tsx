
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
  default: "bg-gray-100 text-gray-600",
  success: "bg-emerald-50 text-emerald-700",
  error:   "bg-red-50 text-red-600",
  high:    "bg-red-50 text-red-600",
  medium:  "bg-amber-50 text-amber-600",
  low:     "bg-blue-50 text-blue-600",
  indigo:  "bg-indigo-50 text-indigo-600",
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
        px-2 py-0.5 rounded-full
        text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}