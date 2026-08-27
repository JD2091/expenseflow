import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { formatNumber } from '../lib/format';

/** Critical Rule 15: dynamic tables paginate, they do not dump every row. */
export const PAGE_SIZE = 25;

export interface Pagination<T> {
  /** The rows to draw right now. */
  visible: T[];
  page: number;
  totalPages: number;
  total: number;
  /** 1-based index of the first visible row, for "Showing X–Y of Z". */
  from: number;
  to: number;
  setPage: (page: number) => void;
}

/**
 * Slice a list into pages.
 *
 * The clamp is the part worth having in one place: filtering a list down to
 * three rows while the user is sitting on page 2 must render page 1, not an
 * empty table. `ExpenseTable` had that logic inline; the Finance table needs
 * exactly the same behaviour, so it moved here rather than being written twice
 * and diverging on the third table.
 */
export function usePagination<T>(rows: T[], pageSize: number = PAGE_SIZE): Pagination<T> {
  const [page, setPage] = useState(1);

  return useMemo(() => {
    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(Math.max(page, 1), totalPages);

    return {
      visible: rows.slice((current - 1) * pageSize, current * pageSize),
      page: current,
      totalPages,
      total,
      from: total === 0 ? 0 : (current - 1) * pageSize + 1,
      to: Math.min(current * pageSize, total),
      setPage,
    };
  }, [rows, page, pageSize]);
}

/**
 * "Showing 1–25 of 142", with prev/next.
 *
 * The count line renders even when there is only one page. It is not decoration
 * — it is the answer to "is this everything, or just the part that fitted?",
 * which is the question a table with no footer leaves a finance clerk guessing
 * at.
 */
export function TablePager<T>({ pagination }: { pagination: Pagination<T> }) {
  const { page, totalPages, total, from, to, setPage } = pagination;

  return (
    <div className="table-footer">
      <span className="table-count">
        Showing {formatNumber(from)}–{formatNumber(to)} of {formatNumber(total)}
      </span>
      {totalPages > 1 ? (
        <div className="pager">
          <button
            type="button"
            className="icon-button"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <span className="table-count">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
