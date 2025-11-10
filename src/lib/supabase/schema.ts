export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          state: string;
          latitude: number;
          longitude: number;
          timezone: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["cities"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cities"]["Row"]>;
      };
      venues: {
        Row: {
          id: string;
          city_id: string;
          slug: string;
          name: string;
          latitude: number;
          longitude: number;
          vibe_tags: string[];
          music_tags: string[];
          price_tier: string;
          wait_minutes: number | null;
          busyness_score: number;
          busyness_label: string;
          busyness_trend: string;
          line_estimate: string | null;
          status: string;
          crowd_ratio_men: number | null;
          crowd_ratio_women: number | null;
          crowd_ratio_label: string | null;
          verification_score: number;
          verification_streak: number;
          cover_amount: number | null;
          cover_currency: string | null;
          cover_note: string | null;
          entry_age: string | null;
          dress_code: string | null;
          id_required: boolean;
          hero_image: string | null;
          cover_image: string | null;
          safety_notes: string[];
          transit_notes: string | null;
          safety_flags: string[];
          last_call: string | null;
          weekly_history: Json | null;
          promo_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["venues"]["Row"]> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["venues"]["Row"]>;
      };
      venue_reports: {
        Row: {
          id: string;
          venue_id: string;
          wait_minutes: number;
          line_length: string;
          vibe: string | null;
          note: string | null;
          busyness_score: number | null;
          ratio_men: number | null;
          ratio_women: number | null;
          cover_amount: number | null;
          submitted_by: string | null;
          submitted_at: string;
          verified: boolean;
          confidence: number;
        };
        Insert: Partial<Database["public"]["Tables"]["venue_reports"]["Row"]> & {
          id?: string;
          submitted_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["venue_reports"]["Row"]>;
      };
      venue_alert_subscriptions: {
        Row: {
          id: string;
          venue_id: string;
          profile_id: string;
          alert_type: string;
          enabled: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["venue_alert_subscriptions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["venue_alert_subscriptions"]["Row"]>;
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Insert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type Update<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
