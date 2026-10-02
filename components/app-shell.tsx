"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CircleHelp,
  GraduationCap,
  Home,
  ListChecks,
  Settings,
  SpellCheck2,
  Target,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/study/today", label: "Today", icon: Target },
  { href: "/plan", label: "8-week plan", icon: CalendarDays },
  { href: "/ielts-zero", label: "IELTS from zero", icon: GraduationCap },
  { href: "/skills/reading", label: "Skills", icon: BookOpen },
  { href: "/practice/reading", label: "Practice", icon: BrainCircuit },
  { href: "/spelling", label: "Spelling", icon: SpellCheck2 },
  { href: "/mistakes", label: "Mistakes", icon: ListChecks },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/diagnostic", label: "Diagnostic", icon: CircleHelp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white/90 p-5 backdrop-blur lg:flex lg:flex-col">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-700 font-bold text-white">
            8
          </div>
          <div>
            <div className="font-bold">IELTS Academy</div>
            <div className="text-xs text-slate-500">Band 8 journey</div>
          </div>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition " +
                  (active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")
                }
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            North star
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Study what moves you closest to your target, not what is easiest to complete.
          </p>
        </div>
      </aside>

      <main className="min-w-0">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/dashboard" className="font-bold">IELTS Band 8</Link>
          <Link href="/study/today" className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white">
            Today
          </Link>
        </div>
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
