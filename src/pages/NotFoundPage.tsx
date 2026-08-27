import { useNavigate } from 'react-router-dom';

import { ErrorState } from '../components/ErrorState';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorState
      title="Page not found"
      message="That screen does not exist in ExpenseFlow."
      onRetry={() => void navigate('/')}
      retryLabel="Back to dashboard"
    />
  );
}
