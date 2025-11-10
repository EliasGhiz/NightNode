import { BottomNav } from "@/components/home/bottom-nav";

export default function ProfilePage() {
  return (
    <>
      <div className="mx-auto w-full max-w-2xl px-4 pb-32 pt-10">
        <h1 className="text-3xl font-semibold text-white">Profile</h1>
        <p className="mt-2 text-sm text-white/60">
          Sign in soon to track trust streaks, manage alerts, and unlock perks.
        </p>
        <div className="mt-8 rounded-3xl border border-white/10 bg-[#111113] p-6 text-sm text-white/70">
          <p>• Verify your identity to boost report confidence.</p>
          <p>• Earn loyalty points for accurate updates.</p>
          <p>• Manage partner perks and VIP passes.</p>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
