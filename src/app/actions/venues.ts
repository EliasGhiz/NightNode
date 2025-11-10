"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getServerClient } from "@/lib/supabase/server";

const reportSchema = z.object({
  venueId: z.string().min(1),
  waitMinutes: z.number().min(0).max(120),
  lineLength: z.enum(["none", "short", "medium", "long"]),
  vibe: z.enum(["chill", "lively", "rowdy"]),
  capacityScore: z.number().min(0).max(100),
  ratioMen: z.number().min(0).max(100),
  ratioWomen: z.number().min(0).max(100),
  coverAmount: z.number().min(0).max(200).nullable(),
  note: z.string().max(280).optional(),
});

const dashboardSchema = z.object({
  venueId: z.string().min(1),
  waitMinutes: z.number().min(0).max(180).nullable(),
  busynessScore: z.number().min(0).max(100),
  trend: z.enum(["rising", "falling", "steady"]),
  coverAmount: z.number().min(0).max(200).nullable(),
  coverNote: z.string().max(120).optional(),
  promoText: z.string().max(160).optional(),
  status: z.enum(["open", "busy", "full", "closed"]),
});

export async function submitCrowdReportAction(input: unknown) {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid crowd report" } as const;
  }

  const client = getServerClient();
  if (!client) {
    return { ok: true, note: "offline" } as const;
  }

  const { venueId, waitMinutes, lineLength, vibe, note, capacityScore, ratioMen, ratioWomen, coverAmount } =
    parsed.data;
  const { error } = await client.from("venue_reports").insert({
    venue_id: venueId,
    wait_minutes: waitMinutes,
    line_length: lineLength,
    vibe,
    note: note ?? null,
    busyness_score: capacityScore,
    ratio_men: ratioMen,
    ratio_women: ratioWomen,
    cover_amount: coverAmount,
    confidence: 0.7,
    verified: false,
  });

  if (error) {
    return { ok: false, error: error.message } as const;
  }

  revalidatePath("/");
  return { ok: true } as const;
}

export async function updateVenueDashboardAction(input: unknown) {
  const parsed = dashboardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid payload" } as const;
  }

  const client = getServerClient();
  if (!client) {
    return { ok: true, note: "offline" } as const;
  }

  const { venueId, ...rest } = parsed.data;
  const { error } = await client
    .from("venues")
    .update({
      wait_minutes: rest.waitMinutes,
      busyness_score: rest.busynessScore,
      busyness_trend: rest.trend,
      status: rest.status,
      cover_amount: rest.coverAmount,
      cover_note: rest.coverNote ?? null,
      promo_text: rest.promoText ?? null,
    })
    .eq("id", venueId);

  if (error) {
    return { ok: false, error: error.message } as const;
  }

  revalidatePath("/");
  return { ok: true } as const;
}
