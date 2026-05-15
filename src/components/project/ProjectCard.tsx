import Link from "next/link";
import type { PublicProjectListItem } from "@/lib/types";

interface ProjectCardProps {
  project: PublicProjectListItem;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(15,23,42,0.1)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-300 to-slate-900/70 opacity-80" />
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            공개 프로젝트
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-950 group-hover:text-gray-700">
            {project.name}
          </h3>
        </div>
        <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-600">
          {project.category}
        </span>
      </div>
      {project.description && (
        <p className="line-clamp-3 text-sm leading-6 text-gray-600">
          {project.description}
        </p>
      )}
      <div className="mt-5 flex items-center justify-between text-xs text-gray-400">
        <span>프로젝트 상세 보기</span>
        <span className="transition-transform group-hover:translate-x-0.5">
          &rarr;
        </span>
      </div>
    </Link>
  );
}
