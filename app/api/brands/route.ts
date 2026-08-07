import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { randomUUID } from "crypto";

export async function GET() {
  const rows = await db.select().from(brands);
  return NextResponse.json({ brands: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.slug) {
    return NextResponse.json(
      { error: "Missing required field: name or slug" },
      { status: 400 }
    );
  }

  const id = randomUUID();

  await db.insert(brands).values({
    id,
    slug: body.slug,
    name: body.name,
    tagline: body.tagline ?? null,
    description: body.description ?? null,
    logoUrl: body.logoUrl ?? null,
    heroImageUrl: body.heroImageUrl ?? null,
    website: body.website ?? null,
    ownerEmail: body.ownerEmail ?? null,
    status: body.status ?? "live",
  });

  return NextResponse.json({ id }, { status: 201 });
}
