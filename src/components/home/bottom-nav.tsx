"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, UserRound } from "lucide-react";

const navItems = [
  { href: "/", label: "Discover", icon: Compass },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40">
      <div className="mx-auto flex w-[92%] max-w-md items-center justify-around rounded-full border border-white/10 bg-black/80 px-6 py-3 text-xs font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.7)]">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/"
            ? pathname === "/" || pathname.startsWith("/venues")
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 ${
                isActive ? "text-[var(--accent)]" : "text-white/40"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
