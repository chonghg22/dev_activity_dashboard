import Link from "next/link";
import type { PublicProjectListItem } from "@/lib/types";

interface ProjectCardProps {
  project: PublicProjectListItem;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700">
          {project.name}
        </h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {project.category}
        </span>
      </div>
      {project.description && (
        <p className="line-clamp-2 text-sm text-gray-500">
          {project.description}
        </p>
      )}
    </Link>
  );
}
