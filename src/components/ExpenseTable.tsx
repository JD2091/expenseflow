import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { Expense } from '../models/expense';
import { statusLabel } from '../models/status';
import { formatCurrency, formatDate, formatNumber } from '../lib/format';
import { StatusPill } from './StatusPill';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';
import { TablePager, usePagination } from './TablePager';

type SortKey = 'description' | 'category' | 'expenseDate' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading?: boolean;
  kicker?: string;
  title?: string;
  /** Manager and Finance views show whose expense it is; "My expenses" does not. */
  showEmployee?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  /** Rendered on the right of the panel header — e.g. a "View all" link. */
  headerAction?: ReactNode;
  /** Off for the dashboard's 4-row preview, on for the full list. */
  paginate?: boolean;
}

function compare(a: Expense, b: Expense, key: SortKey): number {
  switch (key) {
    case 'amount':
      return a.amount - b.amount;
    case 'expenseDate':
      return a.expenseDate.localeCompare(b.expenseDate);
    case 'status':
      return statusLabel(a.status).localeCompare(statusLabel(b.status));
    case 'category':
      return a.category.localeCompare(b.category);
    default:
      return a.description.localeCompare(b.description);
  }
}

export function ExpenseTable({
  expenses,
  isLoading = false,
  kicker = 'RECENT ACTIVITY',
  title = 'My expenses',
  showEmployee = false,
  emptyTitle = 'No expenses yet',
  emptyMessage = 'Submitted expenses show up here within a second of hitting Submit.',
  emptyAction,
  headerAction,
  paginate = false,
}: ExpenseTableProps) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>('expenseDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sorted = useMemo(() => {
    const rows = [...expenses];
    rows.sort((a, b) => (sortDirection === 'asc' ? compare(a, b, sortKey) : compare(b, a, sortKey)));
    return rows;
  }, [expenses, sortKey, sortDirection]);

  // Shared with the Finance table, including the clamp that keeps a filtered
  // list from rendering a blank page 2. Hooks are unconditional, so the
  // pagination is always computed and only USED when `paginate` is on — the
  // dashboard's four-row preview has no footer to draw.
  const pagination = usePagination(sorted);
  const visible = paginate ? pagination.visible : sorted;

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection(key === 'expenseDate' || key === 'amount' ? 'desc' : 'asc');
  }

  function sortIcon(key: SortKey) {
    if (key !== sortKey) return <ChevronsUpDown size={12} aria-hidden />;
    return sortDirection === 'asc' ? (
      <ChevronUp size={12} aria-hidden />
    ) : (
      <ChevronDown size={12} aria-hidden />
    );
  }

  function header(key: SortKey, label: string, className?: string) {
    return (
      <th className={className} aria-sort={key === sortKey ? `${sortDirection}ending` : 'none'}>
        <button type="button" className="sort-button" onClick={() => toggleSort(key)}>
          <span>{label}</span>
          {sortIcon(key)}
        </button>
      </th>
    );
  }

  function open(expense: Expense) {
    void navigate(`/expenses/${expense.expenseCode}`);
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-heading">
          <div className="panel-kicker">{kicker}</div>
          <h2 className="truncate">{title}</h2>
        </div>
        {headerAction ?? (
          <span className="table-count">{formatNumber(expenses.length)} records</span>
        )}
      </div>

      {isLoading ? (
        <div className="panel-body">
          <LoadingSkeleton count={4} />
        </div>
      ) : expenses.length === 0 ? (
        <div className="panel-body">
          <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />
        </div>
      ) : (
        <>
          {/* Critical Rule 12: the table scrolls inside its own box. The page never does. */}
          <div className="overflow-guard">
            {/* Named for assistive technology: two tables on Screen 5 and this
                one on Screens 1 and 3 all use `.expense-table`, and "table"
                alone tells a screen-reader user nothing about which. */}
            <table className="expense-table" aria-label={title}>
              <thead>
                <tr>
                  {header('description', 'Expense')}
                  {showEmployee ? <th>Employee</th> : null}
                  {header('category', 'Category')}
                  {header('expenseDate', 'Date')}
                  {header('amount', 'Amount', 'align-right')}
                  {header('status', 'Status')}
                </tr>
              </thead>
              <tbody>
                {visible.map((expense) => (
                  <tr
                    key={expense.id}
                    className="row-link"
                    tabIndex={0}
                    role="link"
                    onClick={() => open(expense)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        open(expense);
                      }
                    }}
                  >
                    <td>
                      <div className="expense-title truncate" title={expense.description}>
                        {expense.description}
                      </div>
                      <div className="expense-id">{expense.expenseCode}</div>
                    </td>
                    {showEmployee ? (
                      <td className="truncate" title={expense.employee}>
                        {expense.employee}
                      </td>
                    ) : null}
                    <td>{expense.category}</td>
                    <td>{formatDate(expense.expenseDate)}</td>
                    <td className="amount align-right">{formatCurrency(expense.amount)}</td>
                    <td>
                      <StatusPill status={expense.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginate ? <TablePager pagination={pagination} /> : null}
        </>
      )}
    </section>
  );
}
