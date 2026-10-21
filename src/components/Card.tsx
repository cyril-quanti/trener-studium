import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({ children, interactive = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface-raised shadow-subtle ${
        interactive ? "transition-colors duration-150 hover:border-accent/40" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
