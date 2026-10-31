import { getAlimentsIndex } from "@/lib/aliments";

export const dynamic = "force-static";

export function GET() {
  return Response.json(getAlimentsIndex(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
