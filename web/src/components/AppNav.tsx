"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clapperboard,
  Compass,
  Flame,
  LayoutDashboard,
  MessageSquareText,
  Scissors,
  Search,
  Sparkles,
  Users,
  Wand2,
  ImageIcon,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/keywords", label: "Keyword Research", icon: Search },
  { href: "/competitors", label: "Competitors", icon: Users },
  { href: "/trends", label: "Trends", icon: Flame },
  { href: "/optimize", label: "Video Optimizer", icon: Wand2 },
  { href: "/coach", label: "AI Coach", icon: MessageSquareText },
  { href: "/thumbnails", label: "Thumbnails", icon: ImageIcon },
  { href: "/scripts", label: "Script Writer", icon: FileText },
  { href: "/clips", label: "Clips & Shorts", icon: Scissors },
  { href: "/channel", label: "Channel", icon: Clapperboard },
  { href: "/extension", label: "Extension", icon: Compass },
];

export function AppNav({ credits }: { credits: number }) {
  const pathname = usePathname();

  return (
    <aside className="border-r border-white/10 bg-[var(--ink)] text-white md:min-h-screen">
      <div className="sticky top-0 flex h-full flex-col gap-6 p-5">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--amber)] text-[var(--ink)] shadow-[0_0_30px_rgba(245,165,36,0.45)] transition group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <div className="font-[family-name:var(--font-display)] text-xl tracking-tight">Tubelens</div>
            <div className="text-xs text-white/50">Max parity suite</div>
          </div>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">AI credits</div>
          <div className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--amber-2)]">
            {credits.toLocaleString()}
          </div>
          <div className="text-xs text-white/45">Max plan · refreshes monthly</div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-auto pb-4">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-[var(--amber)] text-[var(--ink)]"
                    : "text-white/75 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
