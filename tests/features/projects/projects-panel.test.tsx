import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProjectsPanel } from '../../../src/features/projects/components/ProjectsPanel';
import { renderWithApp } from '../../utils/renderWithApp';

const sampleProjects = [
  {
    id: 'p1',
    name: 'Portfolio App',
    description: 'Frontend client',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z'
  }
];

describe('ProjectsPanel', () => {
  it('renders project list', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(sampleProjects), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    renderWithApp(<ProjectsPanel />, { route: '/projects' });

    expect(await screen.findByRole('heading', { name: 'Portfolio App' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows empty state when no projects exist', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    renderWithApp(<ProjectsPanel />, { route: '/projects' });

    expect(await screen.findByText('No projects yet')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows validation error when creating without a name', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    renderWithApp(<ProjectsPanel />, { route: '/projects' });

    await user.click(await screen.findByRole('button', { name: 'Create project' }));
    await user.click(screen.getByRole('button', { name: 'Create project' }));

    expect(await screen.findByText('Project name is required.')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('creates a project and shows it in the list', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(sampleProjects[0]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(sampleProjects), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      );

    vi.stubGlobal('fetch', fetchMock);

    renderWithApp(<ProjectsPanel />, { route: '/projects' });

    await user.click(await screen.findByRole('button', { name: 'Create project' }));
    await user.type(screen.getByLabelText('Project name'), 'Portfolio App');
    await user.click(screen.getByRole('button', { name: 'Create project' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Portfolio App' })).toBeInTheDocument();
    });

    vi.unstubAllGlobals();
  });
});
