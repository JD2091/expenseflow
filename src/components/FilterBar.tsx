import { Funnel } from 'lucide-react';

import { EXPENSE_CATEGORIES, EXPENSE_STATUSES } from '../models/expense';
import type { ExpenseCategory, ExpenseFilters, ExpenseStatus } from '../models/expense';
import { statusLabel } from '../models/status';

interface FilterBarProps {
  filters: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
}

/**
 * Status / category / date-range filters — Screen 1's filtering requirement.
 *
 * The component is controlled and stateless: it never owns the filter values,
 * it only edits the ones `useExpenses` owns. On Day 2 the same `ExpenseFilters`
 * object is handed to a Data Fabric query instead of an `Array.filter`, and
 * this file does not change.
 */
export function FilterBar({ filters, onChange }: FilterBarProps) {
  const hasFilters = Boolean(
    filters.status || filters.category || filters.dateFrom || filters.dateTo,
  );

  function patch(change: Partial<ExpenseFilters>) {
    const next: ExpenseFilters = { ...filters, ...change };
    // An empty select or date input clears its filter rather than matching "".
    if (!next.status) delete next.status;
    if (!next.category) delete next.category;
    if (!next.dateFrom) delete next.dateFrom;
    if (!next.dateTo) delete next.dateTo;
    onChange(next);
  }

  return (
    <section className="filter-bar" aria-label="Filter expenses">
      <div className="filter-bar-icon">
        <Funnel size={16} aria-hidden />
      </div>

      <label className="filter-field">
        <span>Status</span>
        <select
          value={filters.status ?? ''}
          onChange={(event) => patch({ status: (event.target.value || undefined) as ExpenseStatus })}
        >
          <option value="">All statuses</option>
          {EXPENSE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Category</span>
        <select
          value={filters.category ?? ''}
          onChange={(event) =>
            patch({ category: (event.target.value || undefined) as ExpenseCategory })
          }
        >
          <option value="">All categories</option>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>From</span>
        <input
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={(event) => patch({ dateFrom: event.target.value || undefined })}
        />
      </label>

      <label className="filter-field">
        <span>To</span>
        <input
          type="date"
          value={filters.dateTo ?? ''}
          onChange={(event) => patch({ dateTo: event.target.value || undefined })}
        />
      </label>

      <button
        type="button"
        className="link-button"
        onClick={() => onChange({})}
        disabled={!hasFilters}
      >
        Clear
      </button>
    </section>
  );
}
