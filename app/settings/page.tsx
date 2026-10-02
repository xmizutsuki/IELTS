"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { clearLocalStudyData } from "@/lib/storage/db";
import { useLocalStudy } from "@/hooks/use-local-study";

export default function SettingsPage() {
  const router = useRouter();
  const { profile, loading } = useLocalStudy();
  const [confirming, setConfirming] = useState(false);

  async function reset() {
    await clearLocalStudyData();
    router.replace("/onboarding");
  }

  return (
    <AppShell>
      <header>
        <div className="eyebrow">Preferences</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Settings</h1>
      </header>

      <section className="card mt-8 p-6">
        <div className="eyebrow">Local-first</div>
        <h2 className="mt-2 text-xl font-bold">Browser storage</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Your profile, course progress and study state are stored locally with IndexedDB. There is no user database or account system.
        </p>
        {!loading && profile && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-400">Exam</div><div className="mt-1 font-semibold capitalize">{profile.examType}</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-400">Target</div><div className="mt-1 font-semibold">{profile.targetOverall.toFixed(1)}</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-400">Daily time</div><div className="mt-1 font-semibold">{profile.dailyMinutes} min</div></div>
          </div>
        )}
      </section>

      <section className="mt-5 rounded-3xl border border-red-200 bg-red-50/60 p-6">
        <div className="flex items-start gap-3">
          <Trash2 className="mt-0.5 text-red-700" size={20} />
          <div className="flex-1">
            <h2 className="font-bold text-red-900">Reset local study data</h2>
            <p className="mt-2 text-sm leading-6 text-red-800/75">This clears the profile, progress and mistake bank from this browser.</p>
            {!confirming ? (
              <button onClick={() => setConfirming(true)} className="mt-4 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800">
                Reset data
              </button>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => void reset()} className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white">Yes, reset everything</button>
                <button onClick={() => setConfirming(false)} className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-800">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
