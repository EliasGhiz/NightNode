import Link from "next/link";

import { BottomNav } from "@/components/home/bottom-nav";

export default function SavedPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-2xl px-4 pb-32 pt-10">
        <h1 className="text-3xl font-semibold text-white">Saved</h1>
        <p className="mt-2 text-sm text-white/60">
          Keep tabs on the venues you heart. Tap the heart button on any card to stash it here.
        </p>
        <div className="mt-8 space-y-4 text-sm text-white/70">
          <p>No saved venues yet.</p>
          <Link href="/" className="text-[var(--accent)]">
            Discover spots →
          </Link>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
