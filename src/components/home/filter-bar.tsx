"use client";

import type { FC } from "react";

import type { VenueFilterGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  groups: VenueFilterGroup[];
  activeFilters: string[];
  onToggle: (id: string) => void;
}

export const FilterBar: FC<Props> = ({ groups, activeFilters, onToggle }) => {
  return (
    <div className="blur-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      {groups.map((group) => (
        <div key={group.id} className="flex flex-1 flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-white/60">
            {group.label}
          </span>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const isActive = activeFilters.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onToggle(option.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition",
                    isActive
                      ? "border-emerald-300 bg-emerald-500/10 text-white"
                      : "border-white/15 text-white/70 hover:border-white/40",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
