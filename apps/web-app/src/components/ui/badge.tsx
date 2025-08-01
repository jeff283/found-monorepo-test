import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary";
}

export function Badge({ children, variant = "default", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
        variant === "default"
          ? "bg-cyan-100 text-cyan-800"
          : "bg-gray-200 text-gray-700"
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
