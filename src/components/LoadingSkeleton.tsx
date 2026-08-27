interface LoadingSkeletonProps {
  /** How many placeholder rows/cards to draw. */
  count?: number;
  /** Shaped like the content it replaces. */
  variant?: 'rows' | 'cards' | 'block';
}

/**
 * Not a spinner. A spinner flashes for 250ms and reads as a stutter; a skeleton
 * shaped like the incoming content reads as "the layout is already here".
 * (docs/design-system.md §2, component 9.)
 */
export function LoadingSkeleton({ count = 4, variant = 'rows' }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => index);

  if (variant === 'cards') {
    return (
      <div className="stats-grid" aria-busy="true" aria-label="Loading">
        {items.map((index) => (
          <div key={index} className="stat-card">
            <div className="skeleton-line skeleton-sm" />
            <div className="skeleton-line skeleton-lg" />
            <div className="skeleton-line skeleton-sm" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'block') {
    return (
      <div className="skeleton-block" aria-busy="true" aria-label="Loading">
        {items.map((index) => (
          <div key={index} className="skeleton-line" />
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-rows" aria-busy="true" aria-label="Loading">
      {items.map((index) => (
        <div key={index} className="skeleton-row">
          <div className="skeleton-line skeleton-wide" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      ))}
    </div>
  );
}
