"use client";

import { useState } from "react";
import { BellRing, Radio } from "lucide-react";

import type { AlertSubscription } from "@/lib/types";

interface Props {
  templates: AlertSubscription[];
}

export function AlertPreferences({ templates }: Props) {
  const [alerts, setAlerts] = useState(templates);

  function toggleAlert(id: string) {
    setAlerts((state) =>
      state.map((alert) =>
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert,
      ),
    );
  }

  return (
    <div className="blur-card space-y-4 p-5">
      <div className="flex items-center gap-3">
        <BellRing className="h-6 w-6 text-amber-300" />
        <div>
          <p className="text-sm font-semibold">Push alerts</p>
          <p className="text-xs text-white/60">
            Personalized pings for line drops, safety flags, and promos.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <button
            key={alert.id}
            type="button"
            onClick={() => toggleAlert(alert.id)}
            className="flex w-full items-start gap-3 rounded-2xl border border-white/10 p-3 text-left transition hover:border-white/40"
          >
            <Radio
              className={`mt-0.5 h-5 w-5 ${
                alert.enabled ? "text-emerald-300" : "text-white/40"
              }`}
            />
            <div>
              <p className="text-sm font-semibold">
                {alert.label}
                {alert.enabled && (
                  <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
                    live
                  </span>
                )}
              </p>
              <p className="text-xs text-white/60">{alert.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
