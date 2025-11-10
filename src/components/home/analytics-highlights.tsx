import { Flame, Hourglass, Users } from "lucide-react";

import type { Venue } from "@/lib/types";

interface Props {
  avgWait: number;
  openVenues: number;
  hottest: Venue | null;
}

export function AnalyticsHighlights({ avgWait, openVenues, hottest }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="blur-card p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Avg wait</p>
        <div className="mt-3 flex items-baseline gap-2 text-3xl font-semibold">
          {avgWait || "—"}
          <span className="text-sm text-white/60">min</span>
        </div>
        <p className="mt-2 flex items-center gap-2 text-xs text-emerald-300/80">
          <Hourglass className="h-4 w-4" />
          Crowd-sourced + venue verified
        </p>
      </div>

      <div className="blur-card p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Live venues</p>
        <div className="mt-3 flex items-baseline gap-2 text-3xl font-semibold">
          {openVenues}
          <span className="text-sm text-white/60">open now</span>
        </div>
        <p className="mt-2 flex items-center gap-2 text-xs text-blue-200/80">
          <Users className="h-4 w-4" />
          Auto status refresh every 60s
        </p>
      </div>

      <div className="blur-card p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Heat check</p>
        {hottest ? (
          <div className="mt-3">
            <p className="text-lg font-semibold">{hottest.name}</p>
            <p className="text-sm text-white/60">
              {hottest.busyness.label} · {hottest.waitMinutes ?? "—"} min wait
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-white/60">No venues match filters yet.</p>
        )}
        <p className="mt-2 flex items-center gap-2 text-xs text-amber-200/80">
          <Flame className="h-4 w-4" />
          Trending {hottest?.busyness.trend ?? "steady"}
        </p>
      </div>
    </div>
  );
}
