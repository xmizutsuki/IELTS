"use client";

import { AppShell } from "@/components/app-shell";
import { getTotalTaskCount } from "@/content/curriculum";
import { useLocalStudy } from "@/hooks/use-local-study";

const labels = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
} as const;

export default function ProgressPage() {
  const { profile, progress, loading } = useLocalStudy();

  if (loading || !profile || !progress) {
    return <AppShell><div className="card p-8 text-slate-500">Loading progress…</div></AppShell>;
  }

  const totalTasks = getTotalTaskCount();
  const completion = Math.round((progress.completedTaskIds.length / totalTasks) * 100);

  return (
    <AppShell>
      <header>
        <div className="eyebrow">Analytics</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Progress</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-500">
          This page will become the evidence layer for Band trends, question-type accuracy, Writing criteria, Speaking criteria and consistency across mocks.
        </p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="card p-6">
          <div className="eyebrow">Course</div>
          <div className="mt-3 text-4xl font-bold">{completion}%</div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-blue-700" style={{ width: completion + "%" }} />
          </div>
          <p className="mt-3 text-xs text-slate-500">{progress.completedTaskIds.length} of {totalTasks} study activities</p>
        </div>

        <div className="card p-6">
          <div className="eyebrow">Study time</div>
          <div className="mt-3 text-4xl font-bold">{Math.floor(progress.totalMinutes / 60)}h {progress.totalMinutes % 60}m</div>
          <p className="mt-3 text-xs text-slate-500">Logged from completed daily-plan activities</p>
        </div>

        <div className="card p-6">
          <div className="eyebrow">Target</div>
          <div className="mt-3 text-4xl font-bold">{profile.targetOverall.toFixed(1)}</div>
          <p className="mt-3 text-xs text-slate-500">Overall IELTS target</p>
        </div>
      </section>

      <section className="card mt-5 p-6">
        <div className="eyebrow">Skill estimates</div>
        <h2 className="mt-2 text-xl font-bold">Current evidence snapshot</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(progress.skillEstimates).map(([skill, value]) => {
            const gap = value === null ? null : Math.max(0, profile.targetOverall - value);
            return (
              <div key={skill} className="rounded-2xl border border-slate-200 p-5">
                <div className="text-sm font-semibold text-slate-500">{labels[skill as keyof typeof labels]}</div>
                <div className="mt-3 text-3xl font-bold">{value === null ? "—" : value.toFixed(1)}</div>
                <div className="mt-3 text-xs text-slate-400">
                  {gap === null ? "No baseline yet" : gap === 0 ? "At or above target estimate" : gap.toFixed(1) + " band gap"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card mt-5 p-6">
        <div className="eyebrow">Consistency</div>
        <h2 className="mt-2 text-xl font-bold">Coming with the mock engine</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Peak scores will not be treated as your true level. Full mocks will carry more weight than guided practice, and recent results will be used to calculate a consistency range before the app calls performance stable.
        </p>
      </section>
    </AppShell>
  );
}
