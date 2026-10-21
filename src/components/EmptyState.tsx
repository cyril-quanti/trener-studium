import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
        {icon ?? <Inbox size={22} strokeWidth={1.75} />}
      </span>
      <p className="text-sm font-medium text-text">{title}</p>
      {description && <p className="max-w-xs text-sm text-text-muted">{description}</p>}
      {action}
    </div>
  );
}
