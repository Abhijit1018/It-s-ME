import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// Called by Payload CMS webhooks after content changes.
// Set REVALIDATE_SECRET in your .env to a random string and
// configure Payload to POST to /api/revalidate with that secret.
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let body: { collection?: string; slug?: string } = {};
  try {
    body = await req.json();
  } catch {
    // body is optional
  }

  const { collection, slug } = body;

  // Revalidate specific paths based on which collection changed
  switch (collection) {
    case "projects":
      revalidatePath("/work");
      if (slug) revalidatePath(`/work/${slug}`);
      revalidatePath("/");
      break;
    case "writing":
      revalidatePath("/writing");
      if (slug) revalidatePath(`/writing/${slug}`);
      break;
    case "experience":
    case "milestones":
      revalidatePath("/about");
      break;
    case "skills":
      revalidatePath("/skills");
      break;
    case "now":
      revalidatePath("/now");
      break;
    case "uses":
      revalidatePath("/uses");
      break;
    default:
      // Revalidate everything
      revalidatePath("/", "layout");
  }

  // Also invalidate the github cache tag if needed
  revalidateTag("github-repos");

  return NextResponse.json({ revalidated: true, collection, slug });
}
