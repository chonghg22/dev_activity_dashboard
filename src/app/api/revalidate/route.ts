import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/projects", "/timeline", "/weekly"] as const;

function isAuthorized(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;

  const headerSecret = request.headers.get("x-revalidate-secret");
  const bearerToken = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  return headerSecret === secret || bearerToken === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  revalidateTag("public-dashboard", { expire: 0 });

  for (const path of PUBLIC_PATHS) {
    revalidatePath(path);
  }
  revalidatePath("/projects/[slug]", "page");

  return Response.json({
    revalidated: true,
    now: new Date().toISOString(),
  });
}
