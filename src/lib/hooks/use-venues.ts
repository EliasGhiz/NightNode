"use client";

import { useEffect, useMemo, useState } from "react";

import { MOCK_VENUES } from "../data/mockVenues";
import { mapVenueRow } from "../mappers";
import { getBrowserClient } from "../supabase/client";
import type { Venue } from "../types";

export function useVenues(options: {
  citySlug: string;
  initialVenues: Venue[];
  activeFilters: string[];
}) {
  const { citySlug, initialVenues, activeFilters } = options;
  const [venues, setVenues] = useState<Venue[]>(initialVenues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchVenues() {
      const client = getBrowserClient();
      if (!client) {
        setVenues(
          MOCK_VENUES.filter((venue) => venue.city === citySlug) ?? initialVenues,
        );
        return;
      }

      setLoading(true);
      const { data, error } = await client
        .from("venues")
        .select("*")
        .eq("city_id", citySlug);

      if (!isMounted) return;

      if (error || !data) {
        console.warn("Falling back to mock venues", error);
        setVenues(
          MOCK_VENUES.filter((venue) => venue.city === citySlug) ?? initialVenues,
        );
      } else {
        setVenues(data.map(mapVenueRow));
      }
      setLoading(false);
    }

    fetchVenues();

    return () => {
      isMounted = false;
    };
  }, [citySlug, initialVenues]);

  useEffect(() => {
    const client = getBrowserClient();
    if (!client) return;

    const channel = client
      .channel(`venues-${citySlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "venues",
          filter: `city_id=eq.${citySlug}`,
        },
        (payload) => {
          if (!payload.new) return;
          setVenues((current) => {
            const mapped = mapVenueRow(payload.new);
            const exists = current.findIndex((v) => v.id === mapped.id);
            if (exists === -1) {
              return [...current, mapped];
            }
            const next = [...current];
            next[exists] = { ...next[exists], ...mapped };
            return next;
          });
        },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [citySlug]);

  const filteredVenues = useMemo(() => {
    if (!activeFilters.length) return venues;
    return venues.filter((venue) => {
      const tags = new Set([
        ...venue.vibeTags,
        ...venue.musicTags,
        venue.priceTier.toLowerCase(),
      ]);
      return activeFilters.every((filter) => tags.has(filter));
    });
  }, [venues, activeFilters]);

  const analytics = useMemo(() => {
    if (!filteredVenues.length) {
      return {
        avgWait: 0,
        openVenues: 0,
        hottest: null as Venue | null,
      };
    }

    const totalWait = filteredVenues.reduce(
      (sum, venue) => sum + (venue.waitMinutes ?? 0),
      0,
    );

    const hottest = filteredVenues.reduce((prev, venue) => {
      if (!prev) return venue;
      return venue.busyness.score > prev.busyness.score ? venue : prev;
    }, filteredVenues[0]);

    return {
      avgWait: Math.round(totalWait / filteredVenues.length),
      openVenues: filteredVenues.filter((venue) => venue.status !== "closed")
        .length,
      hottest,
    };
  }, [filteredVenues]);

  return {
    venues: filteredVenues,
    isLoading: loading,
    analytics,
    lastUpdated: venues[0]?.updatedAt ?? new Date().toISOString(),
  };
}
