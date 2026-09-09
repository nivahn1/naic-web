import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * CSV export for each admin table.
 *
 * Reads go through the cookie-bound client, so RLS applies: a non-admin who
 * finds this URL gets an empty result even before the guard below. The guard
 * exists to return an honest 404 rather than an empty file.
 */

const TABLES = {
  registrations: {
    table: "program_registrations",
    columns: [
      "id",
      "created_at",
      "status",
      "program_names",
      "program_slugs",
      "full_name",
      "email",
      "phone",
      "billing_street",
      "billing_city",
      "billing_state",
      "billing_zip",
      "billing_country",
      "amount_cents",
      "stripe_checkout_session_id",
      "stripe_payment_intent_id",
    ],
  },
  certifications: {
    table: "certification_registrations",
    columns: [
      "id",
      "created_at",
      "status",
      "certification_names",
      "certification_slugs",
      "price_cents",
      "full_name",
      "email",
      "phone",
      "billing_street",
      "billing_city",
      "billing_state",
      "billing_zip",
      "billing_country",
      "amount_cents",
      "stripe_checkout_session_id",
      "stripe_payment_intent_id",
    ],
  },
  members: {
    table: "profiles",
    columns: [
      "id",
      "created_at",
      "full_name",
      "email",
      "membership_tier",
      "role",
      "updated_at",
    ],
  },
  nominations: {
    table: "nominations",
    columns: [
      "id",
      "created_at",
      "review_status",
      "nominee_name",
      "nominee_title",
      "nominee_company",
      "nominee_email",
      "nominee_phone",
      "nominator_name",
      "nominator_title",
      "nominator_company",
      "nominator_email",
      "nominator_phone",
      "awards",
      "rationale",
    ],
  },
  advisory: {
    table: "advisory_applications",
    columns: [
      "id",
      "created_at",
      "review_status",
      "full_name",
      "title",
      "company",
      "email",
      "phone",
      "expertise",
      "message",
      "bio_path",
      "headshot_path",
    ],
  },
} as const;

type TableKey = keyof typeof TABLES;

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = Array.isArray(value) ? value.join("; ") : String(value);
  // Quote whenever the value could otherwise break the row or be read as a
  // formula by a spreadsheet.
  const needsQuotes = /[",\n\r]/.test(text);
  const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return needsQuotes ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

export async function GET(request: NextRequest) {
  const { user } = await getAdmin();
  if (!user) {
    return new NextResponse("Not found", { status: 404 });
  }

  const key = request.nextUrl.searchParams.get("table") as TableKey | null;
  const spec = key ? TABLES[key] : undefined;
  if (!spec) {
    return new NextResponse("Unknown table", { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(spec.table)
    .select(spec.columns.join(","))
    .order("created_at", { ascending: false });

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const body = [
    spec.columns.join(","),
    ...rows.map((row) => spec.columns.map((c) => csvCell(row[c])).join(",")),
  ].join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(`﻿${body}`, {
    headers: {
      // BOM above so Excel reads the UTF-8 names correctly.
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="naic-${key}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
