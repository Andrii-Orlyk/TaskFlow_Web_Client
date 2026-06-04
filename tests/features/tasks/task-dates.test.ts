import { describe, expect, it } from 'vitest';
import { formatTaskDueDate, isTaskOverdue } from '../../../src/features/tasks/utils/taskDates';

describe('task date helpers', () => {
  it('marks past due tasks as overdue when not done', () => {
    expect(
      isTaskOverdue({
        dueDate: '2020-01-01T00:00:00.000Z',
        status: 'Todo'
      })
    ).toBe(true);
  });

  it('does not mark completed tasks as overdue', () => {
    expect(
      isTaskOverdue({
        dueDate: '2020-01-01T00:00:00.000Z',
        status: 'Done'
      })
    ).toBe(false);
  });

  it('formats due dates for display', () => {
    expect(formatTaskDueDate('2026-06-15T00:00:00.000Z')).toBeTruthy();
    expect(formatTaskDueDate(null)).toBeNull();
  });
});
