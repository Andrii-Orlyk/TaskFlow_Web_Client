import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommentsSection } from '../../../src/features/comments/components/CommentsSection';
import { renderWithApp } from '../../utils/renderWithApp';
import { stubTaskflowFetch } from '../../utils/taskflowFetchMock';

const comments = [
  {
    id: 'c1',
    taskId: 't1',
    authorId: 'u1',
    content: 'Looks good so far.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

describe('CommentsSection', () => {
  it('renders comments list', async () => {
    stubTaskflowFetch({ comments });

    renderWithApp(<CommentsSection taskId="t1" />);

    expect(await screen.findByText('Looks good so far.')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows empty state when no comments exist', async () => {
    stubTaskflowFetch({ comments: [] });

    renderWithApp(<CommentsSection taskId="t1" />);

    expect(await screen.findByText(/No comments yet/)).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows validation error for empty comment', async () => {
    const user = userEvent.setup();
    stubTaskflowFetch({ comments: [] });

    renderWithApp(<CommentsSection taskId="t1" />);

    await user.click(await screen.findByRole('button', { name: 'Post comment' }));

    expect(await screen.findByText('Comment cannot be empty.')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('adds a comment and updates the list', async () => {
    const user = userEvent.setup();
    const newComment = {
      id: 'c2',
      taskId: 't1',
      authorId: 'u1',
      content: 'Ready for review.',
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z'
    };

    stubTaskflowFetch({ comments: [], postComment: newComment });

    renderWithApp(<CommentsSection taskId="t1" />);

    await user.type(await screen.findByLabelText('Add comment'), 'Ready for review.');
    await user.click(screen.getByRole('button', { name: 'Post comment' }));

    expect(await screen.findByText('Ready for review.')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('deletes a comment after confirmation', async () => {
    const user = userEvent.setup();

    stubTaskflowFetch({ comments });

    renderWithApp(<CommentsSection taskId="t1" />);

    await user.click(await screen.findByRole('button', { name: 'Delete comment' }));
    await user.click(screen.getByRole('button', { name: 'Confirm delete' }));

    expect(await screen.findByText(/No comments yet/)).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
