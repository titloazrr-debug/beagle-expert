import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Fournisseur actif : Brevo (liste de contacts) ou webhook générique. */
function activeProvider(): "brevo" | "webhook" | null {
  if (process.env.BREVO_API_KEY) return "brevo";
  if (process.env.LEADS_WEBHOOK_URL) return "webhook";
  return null;
}

/**
 * Le client interroge cette route pour savoir s'il peut proposer le formulaire.
 * Sans fournisseur configuré, on n'affiche rien plutôt que de promettre un envoi
 * qui n'existe pas.
 */
export async function GET() {
  return NextResponse.json(
    { enabled: activeProvider() !== null },
    { headers: { "cache-control": "no-store" } }
  );
}

const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

function clean(value: unknown, max = 80): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed || null;
}

type LeadBody = {
  email?: unknown;
  quiz?: unknown;
  product?: unknown;
  /** Champ piège : un humain le laisse vide. */
  website?: unknown;
};

export async function POST(request: Request) {
  const provider = activeProvider();
  if (!provider) {
    return NextResponse.json(
      { ok: false, error: "capture_disabled" },
      { status: 503 }
    );
  }

  if (rateLimited(clientKey(request))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  if (clean(body.website)) {
    // Bot : on répond comme si tout allait bien, sans rien enregistrer.
    return NextResponse.json({ ok: true });
  }

  const email = clean(body.email, 160)?.toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const quiz = clean(body.quiz, 80);
  const product = clean(body.product, 120);
  const createdAt = new Date().toISOString();

  try {
    if (provider === "brevo") {
      const listId = Number(process.env.BREVO_LIST_ID ?? "");
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY as string,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          email,
          updateEnabled: true,
          ...(Number.isFinite(listId) && listId > 0 ? { listIds: [listId] } : {}),
          attributes: {
            SOURCE: "expert-beagle.fr",
            ...(quiz ? { QUIZ: quiz } : {}),
            ...(product ? { PRODUIT: product } : {}),
            INSCRIPTION: createdAt,
          },
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error("[leads] brevo", response.status, detail.slice(0, 300));
        return NextResponse.json(
          { ok: false, error: "provider_error" },
          { status: 502 }
        );
      }
    } else {
      const response = await fetch(process.env.LEADS_WEBHOOK_URL as string, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, quiz, product, createdAt, site: "expert-beagle.fr" }),
      });
      if (!response.ok) {
        console.error("[leads] webhook", response.status);
        return NextResponse.json(
          { ok: false, error: "provider_error" },
          { status: 502 }
        );
      }
    }
  } catch (error) {
    console.error("[leads] network", error);
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
