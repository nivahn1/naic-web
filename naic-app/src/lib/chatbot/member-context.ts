import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

/**
 * Every {prefix}_registrations table shares the same shape:
 * {prefix}_names (text[]), status, submitted_by, created_at.
 */
const REGISTRATION_TABLES: { table: string; prefix: string; label: string }[] = [
  { table: "certification_registrations", prefix: "certification", label: "Certification" },
  { table: "program_registrations", prefix: "program", label: "Program" },
  { table: "training_registrations", prefix: "training", label: "Training" },
  { table: "webinar_registrations", prefix: "webinar", label: "Webinar" },
  { table: "event_registrations", prefix: "event", label: "Event" },
  { table: "conference_registrations", prefix: "conference", label: "Conference" },
  { table: "week_registrations", prefix: "week", label: "AI Week" },
  { table: "celebration_registrations", prefix: "celebration", label: "Celebration" },
];

/**
 * Reads back a signed-in member's own registrations across every
 * registration table. These tables are insert-only under RLS (no SELECT
 * policy for anon/authenticated), so this goes through the service-role
 * client — safe here because the caller already verified `userId` from the
 * member's own session before calling this.
 */
export async function getMemberRegistrationsSummary(userId: string): Promise<string[]> {
  if (!isSupabaseAdminConfigured) return [];

  const admin = createAdminClient();

  const results = await Promise.all(
    REGISTRATION_TABLES.map(async ({ table, prefix, label }) => {
      const { data } = await admin
        .from(table)
        .select(`${prefix}_names, status, created_at`)
        .eq("submitted_by", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!data) return [];

      return data.flatMap((row: Record<string, unknown>) => {
        const names = (row[`${prefix}_names`] as string[] | null) ?? [];
        return names.map((name) => `${label}: ${name} (${row.status})`);
      });
    }),
  );

  return results.flat();
}
