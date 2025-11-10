import type { Tables } from "./supabase/schema";
import type { Venue } from "./types";

type VenueRow = Tables<"venues"> & {
  rating?: number;
  specials?: Venue["specials"];
  alerts?: Venue["alerts"];
  reports?: Venue["reports"];
  open_hours?: Venue["openHours"];
};

export function mapVenueRow(row: VenueRow): Venue {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city_id,
    coordinates: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
    waitMinutes: row.wait_minutes,
    lineEstimate: row.line_estimate ?? "—",
    updatedAt: row.updated_at ?? new Date().toISOString(),
    busyness: {
      label: (row.busyness_label as Venue["busyness"]["label"]) ?? "Active",
      score: row.busyness_score ?? 50,
      trend: (row.busyness_trend as Venue["busyness"]["trend"]) ?? "steady",
    },
    vibeTags: row.vibe_tags ?? [],
    musicTags: row.music_tags ?? [],
    priceTier: (row.price_tier as Venue["priceTier"]) ?? "Medium",
    rating: row.rating ?? 4.5,
    entryRules: {
      age: row.entry_age ?? "21+",
      dressCode: row.dress_code ?? "Casual",
      idRequired: row.id_required ?? true,
      cover: {
        amount: row.cover_amount,
        currency: row.cover_currency ?? "USD",
        note: row.cover_note ?? undefined,
      },
    },
    specials: row.specials ?? [],
    crowdMix: {
      men: row.crowd_ratio_men ?? 50,
      women: row.crowd_ratio_women ?? 50,
      label: row.crowd_ratio_label ?? `${row.crowd_ratio_men ?? 50}:${row.crowd_ratio_women ?? 50}`,
    },
    safety: {
      transit: row.transit_notes ?? "",
      notes: row.safety_notes ?? [],
      flags: row.safety_flags ?? [],
      lastCall: row.last_call ?? undefined,
    },
    alerts: row.alerts ?? [],
    reports: row.reports ?? [],
    verification: {
      score: row.verification_score ?? 70,
      streak: row.verification_streak ?? 0,
      lastVerifiedAt: row.updated_at ?? null,
    },
    status: (row.status as Venue["status"]) ?? "open",
    coverImage: row.cover_image ?? undefined,
    heroImage: row.hero_image ?? undefined,
    openHours: row.open_hours ?? [],
    history: (row.weekly_history as Venue["history"]) ?? [],
  };
}
