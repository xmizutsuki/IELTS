"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { curriculum } from "@/content/curriculum";
import { useLocalStudy } from "@/hooks/use-local-study";

export default function PlanPage() {
  const { progress, loading } = useLocalStudy();

  return (
    <AppShell>
      <header>
        <div className="eyebrow">Roadmap</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Your 8-week plan</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-500">
          Every week keeps all four skills active, while the main focus becomes progressively more exam-specific.
        </p>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {curriculum.map((week) => {
          const current = !loading && progress?.currentWeek === week.week;
          const complete = !loading && progress ? progress.currentWeek > week.week : false;
          return (
            <Link href={"/plan/week/" + week.week} key={week.week} className="card group p-6 transition hover:-translate-y-0.5 hover:border-blue-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className={
                    "grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-bold " +
                    (current ? "bg-blue-700 text-white" : complete ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")
                  }>
                    {complete ? <CheckCircle2 size={22} /> : week.week}
                  </div>
                  <div>
                    <div className="eyebrow">{current ? "Current week" : "Week " + week.week}</div>
                    <h2 className="mt-1 text-xl font-bold">{week.title}</h2>
                    <div className="mt-1 text-sm font-medium text-blue-700">{week.theme}</div>
                  </div>
                </div>
                {current ? <ArrowRight className="text-blue-700 transition group-hover:translate-x-1" /> : <LockKeyhole className="text-slate-300" size={20} />}
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-500">{week.goal}</p>
              <div className="mt-5 flex gap-2">
                {week.days.map((day) => (
                  <div
                    key={day.day}
                    className={
                      "h-1.5 flex-1 rounded-full " +
                      (progress && (progress.currentWeek > week.week || (progress.currentWeek === week.week && progress.currentDay > day.day))
                        ? "bg-blue-600"
                        : "bg-slate-100")
                    }
                  />
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
