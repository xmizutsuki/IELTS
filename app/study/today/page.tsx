"use client";

import Link from "next/link";
import { Check, ChevronRight, Clock3, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getDay } from "@/content/curriculum";
import { getTodaysPlan } from "@/lib/adaptive/daily-plan";
import { useLocalStudy } from "@/hooks/use-local-study";

export default function TodayPage() {
  const { profile, progress, loading, toggleTask, completeDay } = useLocalStudy();

  if (loading || !profile || !progress) {
    return <AppShell><div className="card p-8 text-slate-500">Loading today&apos;s plan…</div></AppShell>;
  }

  const day = getDay(progress.currentWeek, progress.currentDay);
  const plan = getTodaysPlan(profile, progress);
  const allDone = plan.length > 0 && plan.every((task) => progress.completedTaskIds.includes(task.id));

  return (
    <AppShell>
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="eyebrow">Week {progress.currentWeek} · Day {progress.currentDay}</div>
          <h1 className="mt-2 text-4xl font-bold">Today&apos;s mission</h1>
          <p className="mt-3 max-w-2xl text-slate-500">{day?.objective}</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-soft">
          <Clock3 size={18} className="text-blue-700" />
          {plan.reduce((sum, item) => sum + item.scaledMinutes, 0)} minutes planned
        </div>
      </header>

      <div className="mt-8 space-y-4">
        {plan.map((task, index) => {
          const completed = progress.completedTaskIds.includes(task.id);
          return (
            <article key={task.id} className={"card overflow-hidden " + (completed ? "opacity-70" : "")}>
              <div className="flex gap-4 p-5 sm:p-6">
                <button
                  onClick={() => void toggleTask(task.id, task.scaledMinutes)}
                  className={
                    "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition " +
                    (completed ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white hover:border-blue-400")
                  }
                  aria-label={completed ? "Mark incomplete" : "Mark complete"}
                >
                  {completed ? <Check size={18} /> : <span className="text-xs font-bold text-slate-400">{index + 1}</span>}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">{task.skill}</span>
                    {task.priority === "high" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        <Sparkles size={11} /> Priority
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-bold">{task.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{task.description}</p>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Why this?</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{task.reason}</p>
                  </div>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <div className="font-bold">{task.scaledMinutes}m</div>
                  <div className="mt-1 text-xs text-slate-400">{task.type}</div>
                </div>
              </div>

              {task.href && !completed && (
                <div className="border-t border-slate-100 px-6 py-3">
                  <Link href={task.href} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                    Open activity <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button disabled={!allDone} className="btn-primary" onClick={() => void completeDay()}>
          {progress.currentWeek === 8 && progress.currentDay === 7 ? "Course complete" : "Complete day & continue"}
        </button>
      </div>
    </AppShell>
  );
}
