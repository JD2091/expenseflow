import { useNavigate } from 'react-router-dom';

import { useExpenses } from '../hooks/useExpenses';
import { NewExpenseForm } from '../components/NewExpenseForm';

/**
 * Screen 2.
 *
 * The page is four lines of wiring: the form collects, the hook submits, the
 * service persists. Day 2 changes only the third of those.
 */
export function NewExpensePage() {
  const { submit } = useExpenses();
  const navigate = useNavigate();

  return (
    <div className="content-stack">
      <NewExpenseForm onSubmit={submit} onCancel={() => void navigate('/expenses')} />
    </div>
  );
}
