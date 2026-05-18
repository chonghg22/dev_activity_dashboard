import Link from "next/link";
import type { PublicProjectListItem } from "@/lib/types";

interface ProjectCardProps {
  project: PublicProjectListItem;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group rounded-2xl border border-stone-200 bg-white p-5 hover:border-stone-300"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
            공개 프로젝트
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-stone-950 group-hover:text-stone-700">
            {project.name}
          </h3>
        </div>
        <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-600">
          {project.category}
        </span>
      </div>
      {project.description && (
        <p className="line-clamp-3 text-sm leading-6 text-stone-600">
          {project.description}
        </p>
      )}
      <div className="mt-5 flex items-center justify-between text-xs text-stone-500">
        <span>프로젝트 상세 보기</span>
        <span>보기</span>
      </div>
    </Link>
  );
}
