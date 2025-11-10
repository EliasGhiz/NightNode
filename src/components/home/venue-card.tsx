import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, MapPin, TrendingUp, Users } from "lucide-react";

import { CITY_OPTIONS } from "@/lib/constants";
import type { Venue } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  venue: Venue;
  disableLink?: boolean;
}

function deriveType(tags: string[]): string {
  if (tags.includes("speakeasy") || tags.includes("rooftop")) return "Lounge";
  if (tags.includes("college") || tags.includes("downtown")) return "Club";
  return "Bar";
}

export function VenueCard({ venue, disableLink = false }: Props) {
  const cityLabel =
    CITY_OPTIONS.find((option) => option.slug === venue.city)?.name ??
    venue.city;
  const vibe = venue.vibeTags[0] ?? "Energetic";
  const typeLabel = deriveType(venue.vibeTags);

  const card = (
    <article className="space-y-4 rounded-[28px] bg-[#111113] p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="relative h-64 w-full overflow-hidden rounded-3xl">
        {venue.coverImage && (
          <Image
            src={venue.coverImage}
            alt={venue.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            priority={false}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
          {vibe}
        </span>
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white/80"
          aria-label="Save venue"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold leading-tight">{venue.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/60">
            <MapPin className="h-4 w-4 text-[var(--accent)]" /> {cityLabel}
          </p>
        </div>
        <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold uppercase">
          {typeLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#0b0b0d] p-4 text-center text-sm sm:grid-cols-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            Wait
          </p>
          <p className="mt-2 text-xl font-semibold">
            {venue.waitMinutes !== null ? `${venue.waitMinutes}m` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            Capacity
          </p>
          <p className="mt-2 flex items-center justify-center gap-1 text-xl font-semibold text-emerald-300">
            <TrendingUp className="h-4 w-4" /> {venue.busyness.score}%
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            Ratio
          </p>
          <p className="mt-2 flex items-center justify-center gap-1 text-xl font-semibold text-pink-300">
            <Users className="h-4 w-4" /> {venue.crowdMix.label}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            Cover
          </p>
          <p className="mt-2 text-xl font-semibold text-emerald-300">
            {formatCurrency(venue.entryRules.cover.amount)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-white/60">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-200" />
          {venue.lineEstimate}
        </div>
        <p>Trend: {venue.busyness.trend}</p>
      </div>
    </article>
  );

  if (disableLink) {
    return card;
  }

  return (
    <Link href={`/venues/${venue.slug}`} className="block">
      {card}
    </Link>
  );
}
