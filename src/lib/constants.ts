import type { AlertSubscription, City, VenueFilterGroup } from "./types";

export const CITY_OPTIONS: City[] = [
  {
    id: "phl",
    name: "Philadelphia",
    slug: "philadelphia",
    state: "PA",
    timezone: "America/New_York",
    coordinates: { latitude: 39.9526, longitude: -75.1652, zoom: 12.1 },
    safety: {
      transit: "SEPTA late-night service, share rides from 13th St.",
      notes: [
        "Stay north of South St. after 1am for active patrols",
        "Temple Loop shuttle departs every 20 min",
      ],
      flags: ["Ride-share surge 1.4x", "Rain expected after 1am"],
      lastCall: "1:45 AM",
    },
    defaultFilters: ["hip-hop", "downtown"],
    population: 1500000,
  },
  {
    id: "austin",
    name: "Austin",
    slug: "austin",
    state: "TX",
    timezone: "America/Chicago",
    coordinates: { latitude: 30.2672, longitude: -97.7431, zoom: 12.4 },
    safety: {
      transit: "MetroRapid Nite service until 2:30am",
      notes: [
        "Campus SafeWalk active until 2am",
        "Avoid 6th & Neches for construction",
      ],
      flags: ["Heat index 95°F", "ACL weekend crowding"],
      lastCall: "2:00 AM",
    },
    defaultFilters: ["live", "rooftop"],
    population: 980000,
  },
  {
    id: "nash",
    name: "Nashville",
    slug: "nashville",
    state: "TN",
    timezone: "America/Chicago",
    coordinates: { latitude: 36.1627, longitude: -86.7816, zoom: 12.3 },
    safety: {
      transit: "Broadway shuttle + ride-share zones",
      notes: [
        "Honky Tonk Highway closes to cars at 10pm",
        "Use 5th Ave pickup zone after 1am",
      ],
      flags: ["Pedestrian-only blocks", "Titans home game"],
      lastCall: "2:30 AM",
    },
    defaultFilters: ["live", "country"],
    population: 715000,
  },
];

export const VENUE_FILTERS: VenueFilterGroup[] = [
  {
    id: "music",
    label: "Music",
    type: "pill",
    options: [
      { id: "hip-hop", label: "Hip-Hop" },
      { id: "house", label: "House" },
      { id: "live", label: "Live Bands" },
      { id: "top-40", label: "Top 40" },
      { id: "latin", label: "Latin" },
      { id: "country", label: "Country" },
    ],
  },
  {
    id: "vibe",
    label: "Vibe",
    type: "pill",
    options: [
      { id: "rooftop", label: "Rooftop" },
      { id: "speakeasy", label: "Speakeasy" },
      { id: "college", label: "College" },
      { id: "lgbtq", label: "LGBTQ+" },
      { id: "alt", label: "Alt" },
      { id: "downtown", label: "Downtown" },
    ],
  },
  {
    id: "price",
    label: "Price",
    type: "toggle",
    options: [
      { id: "low", label: "$" },
      { id: "medium", label: "$$" },
      { id: "high", label: "$$$" },
    ],
  },
];

export const ALERT_TEMPLATES: AlertSubscription[] = [
  {
    id: "line_drop",
    label: "Line just dropped",
    description: "Get pinged when wait falls below 10 min",
    enabled: true,
  },
  {
    id: "capacity",
    label: "Approaching capacity",
    description: "Heads-up before a venue caps entry",
    enabled: true,
  },
  {
    id: "no_cover",
    label: "No cover",
    description: "Short windows with free entry",
    enabled: false,
  },
  {
    id: "safety",
    label: "Safety + transit",
    description: "Late-night transit notices and advisories",
    enabled: false,
  },
];
