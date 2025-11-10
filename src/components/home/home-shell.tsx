"use client";

import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";

import { CITY_OPTIONS, ALERT_TEMPLATES } from "@/lib/constants";
import { MOCK_VENUES } from "@/lib/data/mockVenues";
import { useVenues } from "@/lib/hooks/use-venues";
import type { Venue } from "@/lib/types";

import { AlertPreferences } from "./alert-preferences";
import { BottomNav } from "./bottom-nav";
import { SafetyPanel } from "./safety-panel";
import { VenueCard } from "./venue-card";

interface Props {
  initialVenues: Venue[];
  initialCitySlug: string;
}

const CATEGORY_FILTERS = [
  { id: "all", label: "All", filters: [] },
  { id: "clubs", label: "Clubs", filters: ["downtown", "college"] },
  { id: "bars", label: "Bars", filters: ["speakeasy", "alt"] },
  { id: "lounges", label: "Lounges", filters: ["rooftop", "lgbtq"] },
] as const;

type Category = (typeof CATEGORY_FILTERS)[number]["id"];

export function HomeShell({ initialVenues, initialCitySlug }: Props) {
  const [citySlug, setCitySlug] = useState(initialCitySlug);
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const city =
    CITY_OPTIONS.find((option) => option.slug === citySlug) ?? CITY_OPTIONS[0];

  const baseVenues = useMemo(() => {
    if (citySlug === initialCitySlug) {
      return initialVenues;
    }
    return MOCK_VENUES.filter((venue) => venue.city === citySlug);
  }, [citySlug, initialCitySlug, initialVenues]);

  const derivedFilters = useMemo(() => {
    const match = CATEGORY_FILTERS.find((item) => item.id === category);
    return match?.filters ?? [];
  }, [category]);

  const { venues } = useVenues({
    citySlug,
    initialVenues: baseVenues,
    activeFilters: derivedFilters,
  });

  const displayVenues = useMemo(() => {
    if (!search) {
      return venues;
    }
    const value = search.toLowerCase();
    return venues.filter(
      (venue) =>
        venue.name.toLowerCase().includes(value) ||
        venue.city.toLowerCase().includes(value) ||
        venue.vibeTags.some((tag) => tag.toLowerCase().includes(value)),
    );
  }, [venues, search]);

  return (
    <>
      <div className="mx-auto w-full max-w-2xl px-4 pb-32 pt-8">
        <header className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                NightNode
              </p>
              <h1 className="mt-3 text-4xl font-semibold">Discover</h1>
              <p className="mt-1 text-sm text-white/60">Find your vibe tonight</p>
            </div>
            <label className="text-right text-xs text-white/50">
              City
              <select
                value={citySlug}
                onChange={(event) => setCitySlug(event.target.value)}
                className="mt-1 rounded-full border border-white/10 bg-[#111113] px-3 py-2 text-sm font-semibold text-white"
              >
                {CITY_OPTIONS.map((option) => (
                  <option
                    key={option.id}
                    value={option.slug}
                    className="bg-[#111113] text-white"
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111113] px-4 py-3">
            <Search className="h-4 w-4 text-white/40" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search venues or vibes..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORY_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className="pill-button"
                data-active={(category === item.id).toString()}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
            {city.name}, {city.state} · {displayVenues.length} spots tonight
          </div>
        </header>

        <section className="mt-6 space-y-6">
          {displayVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
          {!displayVenues.length && (
            <div className="blur-card p-6 text-center text-sm text-white/60">
              Nothing matches that search yet—try another vibe.
            </div>
          )}
        </section>

        <section className="mt-10 space-y-4">
          <AlertPreferences templates={ALERT_TEMPLATES} />
          <SafetyPanel city={city} />
        </section>
      </div>
      <BottomNav />
    </>
  );
}
