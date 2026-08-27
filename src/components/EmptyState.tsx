import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
}

/**
 * Icon, one line, one action — the shape every empty list takes.
 * Day 2 leans on this hard: a filtered Data Fabric query returning zero rows is
 * a normal Tuesday, not an error.
 */
export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="state-block">
      <div className="state-icon">
        <Inbox size={20} aria-hidden />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-message">{message}</p>
      {action ? <div className="state-action">{action}</div> : null}
    </div>
  );
}
