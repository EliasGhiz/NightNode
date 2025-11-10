import { MOCK_VENUES } from "../data/mockVenues";
import { mapVenueRow } from "../mappers";
import { getServerClient } from "../supabase/server";
import type { Venue } from "../types";

export async function getInitialVenues(citySlug: string): Promise<Venue[]> {
  const fallback = MOCK_VENUES.filter((venue) => venue.city === citySlug);
  const client = getServerClient();

  if (!client) {
    return fallback;
  }

  const { data, error } = await client
    .from("venues")
    .select("*")
    .eq("city_id", citySlug)
    .limit(30);

  if (error || !data?.length) {
    return fallback;
  }

  return data.map(mapVenueRow);
}

export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  const fallback = MOCK_VENUES.find((venue) => venue.slug === slug) ?? null;
  const client = getServerClient();

  if (!client) {
    return fallback;
  }

  const { data, error } = await client
    .from("venues")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return fallback;
  }

  return mapVenueRow(data);
}
