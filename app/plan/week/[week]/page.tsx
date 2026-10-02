"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getWeek } from "@/content/curriculum";
import { useLocalStudy } from "@/hooks/use-local-study";

export default function WeekPage() {
  const params = useParams<{ week: string }>();
  const week = getWeek(Number(params.week));
  const { progress } = useLocalStudy();

  if (!week) {
    return <AppShell><div className="card p-8">Week not found.</div></AppShell>;
  }

  return (
    <AppShell>
      <Link href="/plan" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft size={17} /> Back to roadmap
      </Link>

      <header className="mt-6">
        <div className="eyebrow">Week {week.week}</div>
        <h1 className="mt-2 text-4xl font-bold">{week.title}</h1>
        <p className="mt-2 text-lg text-blue-700">{week.theme}</p>
        <p className="mt-4 max-w-3xl leading-7 text-slate-500">{week.goal}</p>
      </header>

      <div className="mt-8 space-y-4">
        {week.days.map((day) => {
          const complete = progress ? progress.currentWeek > week.week || (progress.currentWeek === week.week && progress.currentDay > day.day) : false;
          const current = progress?.currentWeek === week.week && progress.currentDay === day.day;
          return (
            <section key={day.day} className={"card p-6 " + (current ? "ring-2 ring-blue-600 ring-offset-2" : "")}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="eyebrow">Day {day.day}</span>
                    {complete && <CheckCircle2 size={16} className="text-emerald-600" />}
                    {current && <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">Today</span>}
                  </div>
                  <h2 className="mt-2 text-xl font-bold">{day.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{day.objective}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Clock3 size={16} />
                  {day.tasks.reduce((sum, task) => sum + task.minutes, 0)} min base
                </div>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {day.tasks.map((task) => (
                  <div key={task.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-700">{task.skill}</div>
                    <div className="mt-2 font-semibold">{task.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{task.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
