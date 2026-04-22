
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  headerAction?: React.ReactNode;
}

export default function Card({
  children,
  className = "",
  title,
  headerAction,
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200
        shadow-sm overflow-hidden
        ${className}
      `}
    >
      {/* Render header only if title is provided */}
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          {headerAction && (
            <div className="flex items-center gap-2">{headerAction}</div>
          )}
        </div>
      )}

      {/* Card body */}
      <div className="p-4">{children}</div>
    </div>
  );
}