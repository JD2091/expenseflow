/* ============================================================================
 * ExpenseFlow — Day 1 fixture data
 * ----------------------------------------------------------------------------
 * DETERMINISTIC BY CONTRACT. No randomness and no clock reads anywhere in this
 * file: no random number source, no live date, no timestamp of "now". A live
 * demo has to produce identical numbers on every reload and on both presenters'
 * machines — a fixture that drifts is a fixture that makes a presenter
 * apologise on stage.
 *
 * ---------------------------------------------------------------------------
 * The dashboard numbers are load-bearing. `Expense tracker app screens.md`
 * Screen 1 promises exactly:
 *
 *     Submitted ₹48,250 (4 expenses) · Approved ₹31,800 (2) · Pending ₹16,450 (2)
 *
 * Those three cards are DERIVED (see `useExpenses`), scoped to the signed-in
 * employee — the screen says "Good afternoon, Rahul", so it shows Rahul's
 * money, not the company's. Working backwards from the spec:
 *
 *   Approved  = EXP-1001 12,450 + EXP-1005 19,350   = ₹31,800  (2 expenses)
 *   Pending   = EXP-1002  4,800 + EXP-1007 11,650   = ₹16,450  (2 expenses)
 *   Submitted = everything above, i.e. not a Draft  = ₹48,250  (4 expenses)
 *
 * Rahul's two Drafts (EXP-1003 ₹18,500, EXP-1004 ₹2,500) appear in his table
 * but in none of the three cards — a draft has not been submitted. That gap is
 * deliberate and is the cleanest proof on stage that the cards are computed
 * rather than typed (STATE.md §4.10).
 *
 * The other two employees exist so Screens 4 and 5 have something real to show:
 * a manager approves other people's expenses, and Finance watches everyone's.
 * ========================================================================== */

import type { Expense } from '../models/expense';

export const initialExpenses: Expense[] = [
  /* --- Rahul Mehta — the signed-in employee (Screens 1-3) ----------------- */
  {
    id: 'exp-1001',
    expenseCode: 'EXP-1001',
    employee: 'Rahul Mehta',
    description: 'Mumbai Travel',
    category: 'Travel',
    amount: 12450,
    expenseDate: '2026-08-18',
    status: 'Approved',
    receiptName: 'mumbai-travel-invoice.pdf',
    submittedAt: '2026-08-18T09:12:00+05:30',
    decidedAt: '2026-08-19T11:40:00+05:30',
    decidedBy: 'Neha Kulkarni',
    comments: 'Within policy. Approved for reimbursement in the August cycle.',
  },
  {
    id: 'exp-1002',
    expenseCode: 'EXP-1002',
    employee: 'Rahul Mehta',
    description: 'Client Dinner',
    category: 'Meals',
    amount: 4800,
    expenseDate: '2026-08-17',
    status: 'Submitted',
    receiptName: 'client-dinner-bill.jpg',
    submittedAt: '2026-08-17T21:05:00+05:30',
  },
  {
    id: 'exp-1003',
    expenseCode: 'EXP-1003',
    employee: 'Rahul Mehta',
    // Q7 (STATE.md §11): 'Accommodation' is the category; 'Hotel' was only ever
    // a row description. Naming the hotel keeps the Screen 1 wireframe reading
    // correctly without adding a sixth ChoiceSet value on Day 2.
    description: 'Hotel — Taj Santacruz',
    category: 'Accommodation',
    amount: 18500,
    expenseDate: '2026-08-16',
    status: 'Draft',
    receiptName: 'taj-santacruz-folio.pdf',
  },
  {
    id: 'exp-1004',
    expenseCode: 'EXP-1004',
    employee: 'Rahul Mehta',
    description: 'Office Supplies',
    category: 'Office',
    amount: 2500,
    expenseDate: '2026-08-15',
    status: 'Draft',
    receiptName: null,
  },
  {
    id: 'exp-1005',
    expenseCode: 'EXP-1005',
    employee: 'Rahul Mehta',
    description: 'Pune workshop — return flights',
    category: 'Travel',
    amount: 19350,
    expenseDate: '2026-08-11',
    status: 'Approved',
    receiptName: 'indigo-pune-return.pdf',
    submittedAt: '2026-08-11T18:30:00+05:30',
    decidedAt: '2026-08-12T10:02:00+05:30',
    decidedBy: 'Neha Kulkarni',
  },
  {
    id: 'exp-1007',
    expenseCode: 'EXP-1007',
    employee: 'Rahul Mehta',
    // Screen 3's hero row. It keeps the EXP-1007 code from the wireframe so the
    // spec and the running app agree on the row the presenter opens.
    description: 'Customer conference travel',
    category: 'Travel',
    amount: 11650,
    expenseDate: '2026-08-12',
    status: 'PendingApproval',
    receiptName: 'mumbai-trip.pdf',
    submittedAt: '2026-08-12T08:45:00+05:30',
    comments: 'Cabs, tolls and airport parking for the customer conference.',
  },

  /* --- Aman Patel (Screens 4-5) ------------------------------------------ */
  {
    id: 'exp-1006',
    expenseCode: 'EXP-1006',
    employee: 'Aman Patel',
    description: 'Office supplies — printer ink',
    category: 'Office',
    amount: 2500,
    expenseDate: '2026-08-14',
    status: 'Submitted',
    // No receipt: this is the "Missing Receipt" row on the Finance screen.
    receiptName: null,
    submittedAt: '2026-08-14T16:20:00+05:30',
  },
  {
    id: 'exp-1010',
    expenseCode: 'EXP-1010',
    employee: 'Aman Patel',
    description: 'Client lunch — Powai',
    category: 'Meals',
    amount: 6400,
    expenseDate: '2026-08-09',
    status: 'Rejected',
    receiptName: 'powai-lunch.jpg',
    policyNote: 'Duplicate of an expense already claimed for the same date.',
    submittedAt: '2026-08-09T15:10:00+05:30',
    decidedAt: '2026-08-10T09:30:00+05:30',
    decidedBy: 'Neha Kulkarni',
    comments: 'Rejected — please raise a single claim per meal.',
  },
  {
    id: 'exp-1012',
    expenseCode: 'EXP-1012',
    employee: 'Aman Patel',
    description: 'Airport taxi — early flight',
    category: 'Travel',
    amount: 1850,
    expenseDate: '2026-08-08',
    status: 'Approved',
    receiptName: 'taxi-0808.pdf',
    submittedAt: '2026-08-08T06:15:00+05:30',
    decidedAt: '2026-08-08T12:00:00+05:30',
    decidedBy: 'Neha Kulkarni',
  },

  /* --- Priya Shah (Screens 4-5) ------------------------------------------ */
  {
    id: 'exp-1008',
    expenseCode: 'EXP-1008',
    employee: 'Priya Shah',
    description: 'Vendor summit — Delhi',
    category: 'Travel',
    amount: 82000,
    expenseDate: '2026-08-19',
    status: 'PolicyReview',
    receiptName: 'vendor-summit-delhi.pdf',
    policyNote: 'Above the ₹25,000 threshold — awaiting policy check.',
    submittedAt: '2026-08-19T10:05:00+05:30',
  },
  {
    id: 'exp-1009',
    expenseCode: 'EXP-1009',
    employee: 'Priya Shah',
    description: 'Client offsite — Goa',
    category: 'Travel',
    amount: 37550,
    expenseDate: '2026-08-13',
    status: 'PendingApproval',
    receiptName: 'goa-offsite-invoice.pdf',
    policyNote: 'Above the ₹25,000 threshold — manager approval required.',
    submittedAt: '2026-08-13T19:45:00+05:30',
  },
  {
    id: 'exp-1011',
    expenseCode: 'EXP-1011',
    employee: 'Priya Shah',
    description: 'Standing desk riser',
    category: 'Office',
    amount: 5900,
    expenseDate: '2026-08-10',
    status: 'Reworked',
    receiptName: null,
    policyNote: 'Receipt is illegible — re-upload and resubmit.',
    submittedAt: '2026-08-10T13:25:00+05:30',
  },
];
