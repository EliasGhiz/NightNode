import type { Venue } from "@/lib/types";

interface Props {
  history: Venue["history"];
}

const vibeColors: Record<string, string> = {
  Chill: "text-emerald-300",
  Energetic: "text-amber-300",
  Rowdy: "text-rose-300",
};

export function VenueHistoryPanel({ history }: Props) {
  if (!history?.length) return null;

  return (
    <div className="blur-card space-y-4 p-5">
      <div>
        <p className="text-sm font-semibold">Weekly rhythm</p>
        <p className="text-xs text-white/60">
          Crowd-sourced capacity + vibes from the past few nights
        </p>
      </div>
      <div className="space-y-3 text-sm text-white/80">
        {history.map((point) => (
          <div key={point.day} className="flex items-center gap-3">
            <div className="w-12 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              {point.day}
            </div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] via-orange-400 to-emerald-300"
                  style={{ width: `${point.capacity}%` }}
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-white/60">
                <span>{point.capacity}% full</span>
                <span>{point.wait}m wait</span>
              </div>
            </div>
            <div className="w-16 text-right text-xs text-white/60">{point.ratio}</div>
            <div className={`w-16 text-right text-xs ${vibeColors[point.vibe] ?? "text-white/60"}`}>
              {point.vibe}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
