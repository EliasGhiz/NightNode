"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";

import { submitCrowdReportAction } from "@/app/actions/venues";
import type { CrowdReportPayload, Venue } from "@/lib/types";

interface Props {
  venue: Venue;
}

const LINE_OPTIONS: CrowdReportPayload["lineLength"][] = [
  "none",
  "short",
  "medium",
  "long",
];

const VIBES: CrowdReportPayload["vibe"][] = ["chill", "lively", "rowdy"];

export function ReportComposer({ venue }: Props) {
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null);
  const [state, setState] = useState<CrowdReportPayload>(() => ({
    venueId: venue.id,
    waitMinutes: venue.waitMinutes ?? 10,
    lineLength: "medium",
    vibe: "lively",
    capacityScore: venue.busyness.score,
    ratioMen: venue.crowdMix.men,
    ratioWomen: venue.crowdMix.women,
    coverAmount: venue.entryRules.cover.amount ?? null,
  }));
  const [pending, startTransition] = useTransition();

  function updateState(patch: Partial<CrowdReportPayload>) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  function submitReport() {
    setOptimisticMessage("Thanks! Report queued.");
    startTransition(async () => {
      await submitCrowdReportAction(state);
      setTimeout(() => setOptimisticMessage(null), 3000);
    });
  }

  return (
    <div className="blur-card space-y-4 p-5">
      <div>
        <p className="text-sm font-semibold">Crowd report</p>
        <p className="text-xs text-white/60">
          Share the real ratio, vibe, and cover for {venue.name}.
        </p>
      </div>
      <div className="space-y-3">
        <label className="block text-xs uppercase tracking-[0.2em] text-white/60">
          Wait (minutes)
          <input
            type="range"
            min={0}
            max={120}
            value={state.waitMinutes}
            onChange={(event) => updateState({ waitMinutes: Number(event.target.value) })}
            className="mt-2 w-full"
          />
          <span className="mt-1 block text-base font-semibold text-white">
            {state.waitMinutes} min
          </span>
        </label>
        <label className="block text-xs uppercase tracking-[0.2em] text-white/60">
          Capacity feel
          <input
            type="range"
            min={0}
            max={100}
            value={state.capacityScore}
            onChange={(event) => updateState({ capacityScore: Number(event.target.value) })}
            className="mt-2 w-full"
          />
          <span className="mt-1 block text-base font-semibold text-white">
            {state.capacityScore}% full
          </span>
        </label>
        <label className="block text-xs uppercase tracking-[0.2em] text-white/60">
          Ratio (men %)
          <input
            type="range"
            min={0}
            max={100}
            value={state.ratioMen}
            onChange={(event) =>
              updateState({
                ratioMen: Number(event.target.value),
                ratioWomen: 100 - Number(event.target.value),
              })
            }
            className="mt-2 w-full"
          />
          <span className="mt-1 block text-base font-semibold text-white">
            {state.ratioMen}:{state.ratioWomen}
          </span>
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-white/60">
          Line length
          <div className="mt-2 flex flex-wrap gap-2">
            {LINE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateState({ lineLength: option })}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  state.lineLength === option
                    ? "border-emerald-300 bg-emerald-500/10"
                    : "border-white/15 text-white/70"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-white/60">
          Vibe check
          <div className="mt-2 flex flex-wrap gap-2">
            {VIBES.map((vibe) => (
              <button
                key={vibe}
                type="button"
                onClick={() => updateState({ vibe })}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  state.vibe === vibe
                    ? "border-amber-300 bg-amber-500/10"
                    : "border-white/15 text-white/70"
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>
        </label>
        <label className="text-xs uppercase tracking-[0.2em] text-white/60">
          Cover you paid ($)
          <input
            type="number"
            min={0}
            max={200}
            value={state.coverAmount ?? 0}
            onChange={(event) => updateState({ coverAmount: Number(event.target.value) })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white"
          />
        </label>
        <textarea
          maxLength={280}
          placeholder="Any quick notes? e.g. 'Security doubled, line all VIP'"
          className="w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-emerald-400"
          value={state.note ?? ""}
          onChange={(event) => updateState({ note: event.target.value })}
        />
      </div>
      <button
        type="button"
        onClick={submitReport}
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400/90 px-4 py-2 font-semibold text-slate-900"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit report
      </button>
      {optimisticMessage && (
        <p className="text-center text-xs text-emerald-300">{optimisticMessage}</p>
      )}
    </div>
  );
}
