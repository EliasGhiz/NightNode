"use client";

import type { FC } from "react";
import { useMemo } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl/mapbox";
import { Flame, MapPin } from "lucide-react";
import type { Feature, FeatureCollection, Point } from "geojson";

import type { City, Venue } from "@/lib/types";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Props = {
  venues: Venue[];
  city: City;
};

const heatLayer: Layer = {
  id: "venue-heat",
  type: "heatmap",
  maxzoom: 16,
  paint: {
    "heatmap-weight": ["get", "intensity"],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 10, 1, 16, 3],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 25, 16, 80],
    "heatmap-opacity": 0.75,
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(59,7,100,0)",
      0.2,
      "#312e81",
      0.4,
      "#2563eb",
      0.65,
      "#22d3ee",
      0.85,
      "#f97316",
      1,
      "#dc2626",
    ],
  },
};

const pointLayer: Layer = {
  id: "venue-points",
  type: "circle",
  minzoom: 8,
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      8,
      ["interpolate", ["linear"], ["get", "intensity"], 0, 6, 1, 16],
      16,
      ["interpolate", ["linear"], ["get", "intensity"], 0, 12, 1, 32],
    ],
    "circle-color": [
      "interpolate",
      ["linear"],
      ["get", "intensity"],
      0,
      "#38bdf8",
      0.5,
      "#facc15",
      1,
      "#f97316",
    ],
    "circle-opacity": 0.9,
    "circle-stroke-width": 1.2,
    "circle-stroke-color": "#0f172a",
  },
};

export const NightMap: FC<Props> = ({ venues, city }) => {
  const collection = useMemo(() => {
    const features: Feature<Point>[] = venues.map((venue) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [venue.coordinates.longitude, venue.coordinates.latitude],
      },
      properties: {
        id: venue.id,
        name: venue.name,
        intensity: Math.max(0.1, (venue.busyness.score ?? 10) / 100),
        wait: venue.waitMinutes ?? 0,
      },
    }));

    return {
      type: "FeatureCollection",
      features,
    } satisfies FeatureCollection<Point>;
  }, [venues]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="blur-card flex h-[520px] w-full flex-col items-center justify-center gap-2 text-center text-white/70">
        <Flame className="h-8 w-8 text-amber-400" />
        <p className="text-sm">
          Add <span className="font-semibold">NEXT_PUBLIC_MAPBOX_TOKEN</span> to
          visualize live heatmaps.
        </p>
      </div>
    );
  }

  return (
    <div className="blur-card relative h-[520px] w-full overflow-hidden">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          latitude: city.coordinates.latitude,
          longitude: city.coordinates.longitude,
          zoom: city.coordinates.zoom,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-left" />
        <Source id="venues" type="geojson" data={collection}>
          <Layer {...heatLayer} />
          <Layer {...pointLayer} />
        </Source>
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            latitude={venue.coordinates.latitude}
            longitude={venue.coordinates.longitude}
          >
            <div className="flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-xs font-semibold text-white">
              <MapPin className="h-3 w-3 text-emerald-300" />
              <span>{venue.busyness.label}</span>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};
