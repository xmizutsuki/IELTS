"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { getDay, getTotalTaskCount, getWeek } from "@/content/curriculum";
import { useLocalStudy } from "@/hooks/use-local-study";

const skillLabels = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
} as const;

export default function DashboardPage() {
  const router = useRouter();
  const { profile, progress, loading } = useLocalStudy();

  useEffect(() => {
    if (!loading && !profile) router.replace("/onboarding");
  }, [loading, profile, router]);

  if (loading || !profile || !progress) {
    return <div className="grid min-h-screen place-items-center text-slate-500">Loading your plan…</div>;
  }

  const week = getWeek(progress.currentWeek);
  const day = getDay(progress.currentWeek, progress.currentDay);
  const completed = progress.completedTaskIds.length;
  const totalTasks = getTotalTaskCount();
  const overallProgress = Math.round((completed / totalTasks) * 100);
  const estimates = Object.entries(progress.skillEstimates);
  const measured = estimates.filter(([, value]) => value !== null);

  return (
    <AppShell>
      <div className="flex flex-col gap-7">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">Day {((progress.currentWeek - 1) * 7) + progress.currentDay} of 56</div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {profile.name}.</h1>
            <p className="mt-2 text-slate-500">Week {progress.currentWeek}: {week?.title} · {week?.theme}</p>
          </div>
          <Link className="btn-primary gap-2" href="/study/today">
            Start today&apos;s plan <ArrowRight size={18} />
          </Link>
        </header>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_1.9fr]">
          <div className="card overflow-hidden bg-slate-950 p-6 text-white">
            <div className="eyebrow !text-slate-400">Target</div>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-6xl font-bold">{profile.targetOverall.toFixed(1)}</span>
              <span className="pb-2 text-slate-400">Overall</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
              {measured.length
                ? "Your measured skills are now used to identify the highest-priority gap."
                : "Complete the Week 1 diagnostic before treating any Band estimate as meaningful."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {estimates.map(([skill, value]) => (
              <div className="card p-5" key={skill}>
                <div className="text-sm font-semibold text-slate-500">{skillLabels[skill as keyof typeof skillLabels]}</div>
                <div className="mt-4 text-4xl font-bold">{value === null ? "—" : value.toFixed(1)}</div>
                <div className="mt-3 text-xs text-slate-400">{value === null ? "Not assessed yet" : "Current estimate"}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="eyebrow">Today</div>
                <h2 className="mt-2 text-2xl font-bold">{day?.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{day?.objective}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-700"><BookOpen size={22} /></div>
            </div>

            <div className="mt-6 space-y-3">
              {day?.tasks.slice(0, 4).map((task) => (
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3" key={task.id}>
                  <div>
                    <div className="font-semibold">{task.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{task.skill} · {task.type}</div>
                  </div>
                  <span className="text-sm font-semibold text-slate-500">{task.minutes}m</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="eyebrow">Course progress</div>
            <div className="mt-4 text-4xl font-bold">{overallProgress}%</div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-700" style={{ width: overallProgress + "%" }} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <Clock3 size={18} className="text-blue-700" />
                <div className="mt-2 text-xl font-bold">{progress.totalMinutes}</div>
                <div className="text-xs text-slate-500">minutes logged</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <TrendingUp size={18} className="text-blue-700" />
                <div className="mt-2 text-xl font-bold">{completed}</div>
                <div className="text-xs text-slate-500">tasks complete</div>
              </div>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="eyebrow">Band 8 gap</div>
              <h2 className="mt-2 text-xl font-bold">
                {measured.length ? "Your plan will prioritise the lowest measured skill." : "Baseline data is still missing."}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {measured.length
                  ? "As more timed work and mocks are completed, recent evidence will matter more than early practice."
                  : "Week 1 teaches the test first. The diagnostic comes after you understand what each section expects."}
              </p>
            </div>
            <Link href="/diagnostic" className="btn-secondary gap-2">
              <Target size={18} /> Open diagnostic
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
