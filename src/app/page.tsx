import { HomeShell } from "@/components/home/home-shell";
import { CITY_OPTIONS } from "@/lib/constants";
import { getInitialVenues } from "@/lib/services/venue-service";

export default async function Page() {
  const defaultCity = CITY_OPTIONS[0];
  const initialVenues = await getInitialVenues(defaultCity.slug);

  return (
    <main className="pb-20">
      <HomeShell initialVenues={initialVenues} initialCitySlug={defaultCity.slug} />
    </main>
  );
}
