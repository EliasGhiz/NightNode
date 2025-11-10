import { ShieldCheck, Siren, Train } from "lucide-react";

import type { City } from "@/lib/types";

interface Props {
  city: City;
}

export function SafetyPanel({ city }: Props) {
  return (
    <div className="blur-card space-y-4 p-5">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-sky-300" />
        <div>
          <p className="text-sm font-semibold">Safety + transit</p>
          <p className="text-xs text-white/60">Updated with city desk + venues</p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Transit</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
          <Train className="h-4 w-4 text-emerald-300" />
          {city.safety.transit}
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Notes</p>
        <ul className="mt-2 space-y-1 text-sm text-white/80">
          {city.safety.notes.map((note) => (
            <li key={note} className="flex items-center gap-2">
              <Siren className="h-4 w-4 text-amber-300" />
              {note}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-xs text-white/60">
        Flags: {city.safety.flags.join(" · ")}
      </div>
    </div>
  );
}
