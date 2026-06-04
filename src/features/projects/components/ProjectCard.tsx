import { Link } from 'react-router-dom';
import type { ProjectDto } from '../../../types/api';

type ProjectCardProps = {
  project: ProjectDto;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">
        <Link to={`/projects/${project.id}`} className="hover:underline">
          {project.name}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        {project.description?.trim() ? project.description : 'No description provided.'}
      </p>
      <p className="mt-3 text-xs text-slate-500">Updated {new Date(project.updatedAt).toLocaleDateString()}</p>
    </article>
  );
}
