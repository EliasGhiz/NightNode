import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";

import { AlertPreferences } from "@/components/home/alert-preferences";
import { BottomNav } from "@/components/home/bottom-nav";
import { ReportComposer } from "@/components/home/report-composer";
import { SafetyPanel } from "@/components/home/safety-panel";
import { VenueCard } from "@/components/home/venue-card";
import { ALERT_TEMPLATES, CITY_OPTIONS } from "@/lib/constants";
import { getVenueBySlug } from "@/lib/services/venue-service";
import { VenueHistoryPanel } from "@/components/venue/history-panel";

interface Params {
  slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
  const venue = await getVenueBySlug(params.slug);
  if (!venue) return { title: "NightNode" };
  return {
    title: `${venue.name} · NightNode`,
    description: `Live intel for ${venue.name}`,
  };
}

export default async function VenueDetailPage({ params }: { params: Params }) {
  const venue = await getVenueBySlug(params.slug);
  if (!venue) {
    notFound();
  }

  const city = CITY_OPTIONS.find((option) => option.slug === venue.city);

  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-white/60">
          <ArrowLeft className="h-4 w-4" /> Back to Discover
        </Link>
        <div className="mt-6 space-y-6">
          {venue.heroImage && (
            <div className="overflow-hidden rounded-3xl">
              <Image
                src={venue.heroImage}
                alt={venue.name}
                width={1200}
                height={640}
                className="h-64 w-full object-cover"
                priority
              />
            </div>
          )}
          <div className="flex items-center gap-3 text-white/70">
            <MapPin className="h-4 w-4 text-[var(--accent)]" />
            {city ? `${city.name}, ${city.state}` : venue.city}
          </div>
          <VenueCard venue={venue} disableLink />
          <VenueHistoryPanel history={venue.history} />
          <div className="space-y-4">
            <ReportComposer key={venue.id} venue={venue} />
            <AlertPreferences templates={ALERT_TEMPLATES} />
            {city && <SafetyPanel city={city} />}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
