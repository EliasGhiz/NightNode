"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { updateVenueDashboardAction } from "@/app/actions/venues";
import type { Venue } from "@/lib/types";

interface Props {
  venues: Venue[];
}

export function VenueDashboardCard({ venues }: Props) {
  const [selection, setSelection] = useState(venues[0]?.id ?? "");
  const venue = useMemo(() => venues.find((v) => v.id === selection), [
    venues,
    selection,
  ]);
  const [payload, setPayload] = useState(() => ({
    waitMinutes: venue?.waitMinutes ?? 10,
    busynessScore: venue?.busyness.score ?? 50,
    trend: venue?.busyness.trend ?? "steady",
    coverAmount: venue?.entryRules.cover.amount ?? null,
    coverNote: venue?.entryRules.cover.note ?? "",
    promoText: venue?.specials[0]?.title ?? "",
    status: venue?.status ?? "open",
  }));
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function update(statePatch: Partial<typeof payload>) {
    setPayload((prev) => ({ ...prev, ...statePatch }));
  }

  function pushUpdate() {
    if (!venue) return;
    startTransition(async () => {
      const result = await updateVenueDashboardAction({
        venueId: venue.id,
        ...payload,
      });
      setMessage(result.ok ? "Status updated" : result.error ?? "Error");
      setTimeout(() => setMessage(null), 2500);
    });
  }

  return (
    <div className="blur-card space-y-4 p-5">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-fuchsia-300" />
        <div>
          <p className="text-sm font-semibold">Venue dashboard</p>
          <p className="text-xs text-white/60">Drop quick updates for your line</p>
        </div>
      </div>
      <select
        value={selection}
        onChange={(event) => {
          setSelection(event.target.value);
          const nextVenue = venues.find((v) => v.id === event.target.value);
          if (nextVenue) {
            setPayload({
              waitMinutes: nextVenue.waitMinutes ?? 10,
              busynessScore: nextVenue.busyness.score,
              trend: nextVenue.busyness.trend,
              coverAmount: nextVenue.entryRules.cover.amount,
              coverNote: nextVenue.entryRules.cover.note ?? "",
              promoText: nextVenue.specials[0]?.title ?? "",
              status: nextVenue.status,
            });
          }
        }}
        className="w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm"
      >
        {venues.map((venueOption) => (
          <option
            key={venueOption.id}
            value={venueOption.id}
            className="bg-slate-900 text-white"
          >
            {venueOption.name}
          </option>
        ))}
      </select>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs uppercase tracking-[0.2em] text-white/60">
          Wait
          <input
            type="number"
            min={0}
            max={180}
            value={payload.waitMinutes ?? 0}
            onChange={(event) => update({ waitMinutes: Number(event.target.value) })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-white/60">
          Busyness %
          <input
            type="number"
            min={0}
            max={100}
            value={payload.busynessScore}
            onChange={(event) => update({ busynessScore: Number(event.target.value) })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-white/60">
          Cover
          <input
            type="number"
            min={0}
            max={200}
            value={payload.coverAmount ?? 0}
            onChange={(event) => update({ coverAmount: Number(event.target.value) })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-white/60">
          Trend
          <select
            value={payload.trend}
            onChange={(event) => update({ trend: event.target.value as typeof payload.trend })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm"
          >
            <option value="rising" className="bg-slate-900 text-white">
              Rising
            </option>
            <option value="steady" className="bg-slate-900 text-white">
              Steady
            </option>
            <option value="falling" className="bg-slate-900 text-white">
              Falling
            </option>
          </select>
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-white/60">
          Promo
          <input
            value={payload.promoText ?? ""}
            onChange={(event) => update({ promoText: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-white/60">
          Status
          <select
            value={payload.status}
            onChange={(event) => update({ status: event.target.value as typeof payload.status })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm"
          >
            {(["open", "busy", "full", "closed"] as const).map((option) => (
              <option key={option} value={option} className="bg-slate-900 text-white">
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button
        type="button"
        onClick={pushUpdate}
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/90 px-4 py-2 font-semibold text-slate-900"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Push live status
      </button>
      {message && <p className="text-center text-xs text-white/60">{message}</p>}
    </div>
  );
}
