import { Button } from '../../../components/ui/Button';
import { AuthFormAlert } from '../../../components/feedback/AuthFormAlert';
import type { TaskStatus } from '../../../types/api';
import { useUpdateTaskStatus } from '../hooks/useTaskMutations';
import { getTaskErrorMessage } from '../utils/taskErrors';
import { getAvailableStatusTransitions } from '../utils/taskStatus';
import { useState } from 'react';

type TaskStatusActionsProps = {
  taskId: string;
  status: TaskStatus;
};

export function TaskStatusActions({ taskId, status }: TaskStatusActionsProps) {
  const updateStatus = useUpdateTaskStatus(taskId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const transitions = getAvailableStatusTransitions(status);

  if (transitions.length === 0) {
    return null;
  }

  const handleTransition = async (nextStatus: TaskStatus) => {
    setErrorMessage(null);

    try {
      await updateStatus.mutateAsync(nextStatus);
    } catch (error) {
      setErrorMessage(getTaskErrorMessage(error, 'Unable to update task status.'));
    }
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-sm font-semibold text-slate-900">Status actions</h2>
      <AuthFormAlert message={errorMessage} />
      <div className="mt-3 flex flex-wrap gap-2">
        {transitions.map((transition) => (
          <Button
            key={transition.nextStatus}
            type="button"
            disabled={updateStatus.isPending}
            onClick={() => handleTransition(transition.nextStatus)}
          >
            {updateStatus.isPending ? 'Updating...' : transition.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
