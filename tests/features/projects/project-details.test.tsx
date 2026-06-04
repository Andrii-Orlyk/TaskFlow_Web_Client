import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { ProjectDetailsPanel } from '../../../src/features/projects/components/ProjectDetailsPanel';
import { renderWithApp } from '../../utils/renderWithApp';

const project = {
  id: 'p1',
  name: 'Portfolio App',
  description: 'Frontend client',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z'
};

describe('ProjectDetailsPanel', () => {
  it('shows not found state for missing project', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    renderWithApp(
      <Routes>
        <Route path="/projects/:projectId" element={<ProjectDetailsPanel />} />
      </Routes>,
      { route: '/projects/missing' }
    );

    expect(await screen.findByRole('heading', { name: 'Project not found' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('updates project details after edit', async () => {
    const user = userEvent.setup();
    const updatedProject = { ...project, name: 'Updated Portfolio App' };

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify(project), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(updatedProject), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
    );

    renderWithApp(
      <Routes>
        <Route path="/projects/:projectId" element={<ProjectDetailsPanel />} />
      </Routes>,
      { route: '/projects/p1' }
    );

    expect(await screen.findByRole('heading', { name: 'Portfolio App' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit project' }));
    const nameInput = screen.getByLabelText('Project name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Portfolio App');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('heading', { name: 'Updated Portfolio App' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('deletes project and navigates back to list', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify(project), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
        .mockResolvedValueOnce(new Response(null, { status: 204 }))
        .mockResolvedValueOnce(
          new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
    );

    renderWithApp(
      <Routes>
        <Route path="/projects" element={<h1>Projects list</h1>} />
        <Route path="/projects/:projectId" element={<ProjectDetailsPanel />} />
      </Routes>,
      { route: '/projects/p1' }
    );

    await user.click(await screen.findByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Confirm delete' }));

    expect(await screen.findByRole('heading', { name: 'Projects list' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
