export type TrendDirection = "rising" | "falling" | "steady";

export type VenueStatus = "open" | "busy" | "full" | "closed";

export type PriceTier = "Low" | "Medium" | "High";

export type VenueSpecial = {
  id: string;
  title: string;
  window: string;
  description?: string;
};

export type VenueAlert = {
  id: string;
  type: "line_drop" | "capacity" | "no_cover" | "safety" | "promo";
  message: string;
  createdAt: string;
};

export type SafetyInfo = {
  transit: string;
  notes: string[];
  flags: string[];
  lastCall?: string;
};

export type VenueReport = {
  id: string;
  venueId: string;
  waitMinutes: number;
  lineLength: "none" | "short" | "medium" | "long";
  submittedAt: string;
  submittedBy: string;
  confidence: number;
  note?: string;
  verified: boolean;
};

export type VenueVerification = {
  score: number;
  streak: number;
  lastVerifiedAt: string | null;
};

export type EntryRules = {
  age: string;
  dressCode: string;
  idRequired: boolean;
  cover: {
    amount: number | null;
    currency: string;
    note?: string;
  };
};

export type VenueHistoryPoint = {
  day: string;
  capacity: number;
  wait: number;
  ratio: string;
  vibe: string;
};

export type Venue = {
  id: string;
  slug: string;
  name: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  waitMinutes: number | null;
  lineEstimate: string;
  updatedAt: string;
  busyness: {
    label: "Quiet" | "Chill" | "Active" | "Busy" | "Packed";
    score: number; // 0 - 100
    trend: TrendDirection;
  };
  vibeTags: string[];
  musicTags: string[];
  priceTier: PriceTier;
  rating: number;
  entryRules: EntryRules;
  specials: VenueSpecial[];
  safety: SafetyInfo;
  alerts: VenueAlert[];
  reports: VenueReport[];
  verification: VenueVerification;
  status: VenueStatus;
  crowdMix: {
    men: number;
    women: number;
    label: string;
  };
  coverImage?: string;
  heroImage?: string;
  openHours: Array<{
    day: string;
    open: string;
    close: string;
  }>;
  history: VenueHistoryPoint[];
};

export type City = {
  id: string;
  name: string;
  slug: string;
  state: string;
  timezone: string;
  coordinates: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  safety: SafetyInfo;
  defaultFilters: string[];
  population: number;
};

export type VenueFilterGroup = {
  id: string;
  label: string;
  type: "pill" | "toggle";
  options: Array<{
    id: string;
    label: string;
    description?: string;
    icon?: string;
  }>;
};

export type AlertSubscription = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export type VenueDashboardPayload = {
  venueId: string;
  waitMinutes: number | null;
  busynessScore: number;
  trend: TrendDirection;
  coverAmount: number | null;
  coverNote?: string;
  promoText?: string;
  status: VenueStatus;
};

export type CrowdReportPayload = {
  venueId: string;
  waitMinutes: number;
  lineLength: "none" | "short" | "medium" | "long";
  vibe: "chill" | "lively" | "rowdy";
  capacityScore: number;
  ratioMen: number;
  ratioWomen: number;
  coverAmount: number | null;
  note?: string;
};
