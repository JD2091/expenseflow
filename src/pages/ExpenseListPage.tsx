import { Link } from 'react-router-dom';

import { useExpenses } from '../hooks/useExpenses';
import { FilterBar } from '../components/FilterBar';
import { ExpenseTable } from '../components/ExpenseTable';
import { ErrorState } from '../components/ErrorState';

/**
 * The full list of the employee's expenses, with the filters Screen 1 asks for.
 *
 * The page owns no expense state whatsoever: `filters` and `filtered` both come
 * from `useExpenses`, so a filter set here is still set when the user comes back
 * from the detail screen.
 */
export function ExpenseListPage() {
  const { filtered, mine, filters, setFilters, isLoading, error, errorCause, refresh } = useExpenses();

  const isFiltered = Object.keys(filters).length > 0;

  if (error) {
    return <ErrorState message={error} error={errorCause} onRetry={() => void refresh()} />;
  }

  return (
    <div className="content-stack">
      <div className="welcome-row">
        <div>
          <h2 className="page-title">My expenses</h2>
          <p className="page-subtitle">
            {isFiltered
              ? `Showing ${filtered.length} of ${mine.length} expenses.`
              : 'Every expense you have raised, newest first.'}
          </p>
        </div>
        <Link className="primary-button" to="/expenses/new">
          + New Expense
        </Link>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <ExpenseTable
        expenses={filtered}
        isLoading={isLoading}
        kicker="ALL EXPENSES"
        title="My expenses"
        paginate
        emptyTitle={isFiltered ? 'No expenses match these filters' : 'No expenses yet'}
        emptyMessage={
          isFiltered
            ? 'Widen the date range or clear a filter to see more.'
            : 'Submitted expenses show up here within a second of hitting Submit.'
        }
        emptyAction={
          isFiltered ? (
            <button type="button" className="secondary-button" onClick={() => setFilters({})}>
              Clear filters
            </button>
          ) : (
            <Link className="primary-button" to="/expenses/new">
              + New Expense
            </Link>
          )
        }
      />
    </div>
  );
}
