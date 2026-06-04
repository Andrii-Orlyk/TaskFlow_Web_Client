import type { ProjectDto } from '../../../types/api';
import { ProjectCard } from './ProjectCard';

type ProjectListProps = {
  projects: ProjectDto[];
};

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
