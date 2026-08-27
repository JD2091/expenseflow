interface StatCardProps {
  label: string;
  /** Already formatted for display — the caller derives it, nobody types it. */
  value: string;
  /** The line under the value, e.g. "4 expenses". Also derived. */
  helper: string;
  tone?: 'neutral' | 'positive';
}

/**
 * One KPI. `value` and `helper` are derived props by contract: the starter
 * passed the literal string "4 expenses" and it went stale the first time
 * anybody submitted an expense on stage (STATE.md §4.10).
 */
export function StatCard({ label, value, helper, tone = 'neutral' }: StatCardProps) {
  return (
    <section className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value truncate" title={value}>
        {value}
      </div>
      <div className={`stat-helper ${tone === 'positive' ? 'is-positive' : ''}`}>{helper}</div>
    </section>
  );
}
