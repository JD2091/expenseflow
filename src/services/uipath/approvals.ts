/* ============================================================================
 * ExpenseFlow — Action Center approvals
 * ============================================================================
 *
 *   >>> THE HUMAN IN THE LOOP, AS A PLATFORM OBJECT. <<<
 *
 * An expense above the policy threshold does not just get a different status
 * string. It creates a real Action Center task, in a real Orchestrator folder,
 * that a real manager sees in a real inbox — and the manager can act on it
 * from Action Center or from this app, because both are talking to the same
 * task.
 *
 * That is the whole argument of the Day-2 approval beat, and it is why the
 * task id is written back onto the Data Fabric record: without
 * `ApprovalTaskId`, the app has no way to find the task again and "Approve"
 * degrades into a status update that pretends.
 *
 * ---------------------------------------------------------------------------
 * WHY `create` NEEDS A NUMBER AND `complete` DOES NOT
 *
 * `Tasks.create(options, folderId)` takes the numeric folder id — see
 * `folders.ts` for the whole sorry story of getting one. Completion does not:
 * `getById` hands back a task with its own methods already bound to its own
 * folder, so `task.complete(...)` needs neither a task id nor a folder id.
 * That is the form the skill's reference prefers, and it is one less thing to
 * get wrong.
 * ========================================================================== */

import { TaskPriority, TaskType } from '@uipath/uipath-typescript/tasks';

import { formatCurrency } from '../../lib/format';
import { getClients } from './client';
import { UIPATH } from './config';
import { getFolderId } from './folders';
import { rethrowFriendly } from './errors';

/** What a manager can do to a pending expense. */
export type ApprovalAction = 'Approve' | 'Reject' | 'Rework';

/**
 * Everything the manager needs to see in the Action Center inbox WITHOUT
 * opening ExpenseFlow.
 *
 * A task whose payload is `{ expenseId: "a4f2…" }` is useless to the person
 * who has to decide: they would have to go and look the record up. The task
 * carries the decision-relevant facts so the inbox is self-contained.
 */
export interface ApprovalTaskInput {
  expenseCode: string;
  employee: string;
  description: string;
  category: string;
  amount: number;
  expenseDate: string;
  /** Bucket path, or `null` when the employee attached nothing. */
  receiptPath: string | null;
  /** The threshold the submit was actually decided against. */
  threshold: number;
}

/**
 * Create the manager's task and return its id as a STRING.
 *
 * A string because that is what the Data Fabric `ApprovalTaskId` field is
 * (STATE.md §6) — Action Center numbers its tasks, Data Fabric stores text,
 * and the conversion happens once, here, rather than at four call sites.
 */
export async function createApprovalTask(input: ApprovalTaskInput): Promise<string> {
  try {
    const { tasks } = getClients();
    const folderId = await getFolderId();

    const task = await tasks.create(
      {
        // The title is what the manager reads in the inbox list, so it carries
        // the three things a decision turns on: who, how much, what for.
        title: `Approve ${input.expenseCode} — ${input.employee} — ${formatCurrency(input.amount)}`,
        priority: input.amount >= input.threshold * 2 ? TaskPriority.High : TaskPriority.Medium,
        data: {
          expenseCode: input.expenseCode,
          employee: input.employee,
          description: input.description,
          category: input.category,
          amount: input.amount,
          expenseDate: input.expenseDate,
          receiptPath: input.receiptPath,
          policyThreshold: input.threshold,
          submittedFrom: 'ExpenseFlow Coded App',
        },
      },
      folderId,
    );

    return String(task.id);
  } catch (cause) {
    rethrowFriendly(cause, 'create the approval task in Action Center');
  }
}

/**
 * Complete the manager's task.
 *
 *   >>> THIS RUNS BEFORE THE RECORD IS UPDATED. ALWAYS. <<<
 *
 * If completing the task fails, the Data Fabric record is untouched and the UI
 * can honestly say nothing happened. The other order produces a record that
 * claims it was approved while the task still sits open in someone's inbox —
 * the two systems disagree, permanently, and the only way to notice is for a
 * human to go and look.
 *
 * Throws with a specific message when the task has already been completed,
 * because that is a real thing that happens during a demo (the presenter
 * approves it in the Action Center tab, then clicks Approve in the app) and
 * "something went wrong" would be an unhelpful thing to read on a projector.
 */
export async function completeApprovalTask(
  taskId: string,
  action: ApprovalAction,
  comments: string,
): Promise<void> {
  try {
    const { tasks } = getClients();

    const numericId = Number(taskId);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new Error(
        `"${taskId}" is not an Action Center task id. The record's ApprovalTaskId looks corrupt.`,
      );
    }

    const folderId = await getFolderId();
    const task = await tasks.getById(numericId, {}, folderId);

    if (task.isCompleted) {
      throw new Error(
        `Action Center task ${taskId} was already completed` +
          (task.action ? ` with the action "${task.action}"` : '') +
          '. Refresh to see the decision that was recorded.',
      );
    }

    // The discriminated union does NOT narrow through a conditional spread, so
    // this is an explicit branch and not a cleverer one-liner.
    if (task.type === TaskType.External) {
      await task.complete({ type: TaskType.External, action, data: { comments } });
    } else {
      await task.complete({ type: task.type, action, data: { comments } });
    }
  } catch (cause) {
    rethrowFriendly(cause, `record the ${action.toLowerCase()} decision in Action Center`);
  }
}

/**
 * How many approval tasks are still open in the demo folder.
 *
 * Read straight from Action Center rather than counted off the Data Fabric
 * rows, so the Manager screen can say "3 open in Action Center" and the
 * presenter can flip to the Action Center tab and show the same 3. When the two
 * numbers disagree, that IS the interesting fact — so it is surfaced rather
 * than smoothed over.
 *
 * Cursor-looped: `getAll` returns ONE page (Critical Rule 14) and an inbox with
 * more tasks than a page is exactly when a wrong count would matter.
 */
export async function countOpenApprovalTasks(): Promise<number> {
  try {
    const { tasks } = getClients();
    const folderId = await getFolderId();

    let open = 0;
    let page = await tasks.getAll({ folderId, pageSize: UIPATH.fetchPageSize });

    for (;;) {
      open += page.items.filter((task) => !task.isCompleted).length;
      if (!page.hasNextPage || page.nextCursor === undefined) break;
      page = await tasks.getAll({
        folderId,
        pageSize: UIPATH.fetchPageSize,
        cursor: page.nextCursor,
      });
    }

    return open;
  } catch (cause) {
    rethrowFriendly(cause, 'count the open tasks in Action Center');
  }
}
