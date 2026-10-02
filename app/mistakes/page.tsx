"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getMistakes } from "@/lib/storage/db";
import { Mistake } from "@/types";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getMistakes().then((items) => {
      setMistakes(items.sort((a, b) => b.occurrences - a.occurrences));
      setLoading(false);
    });
  }, []);

  return (
    <AppShell>
      <header>
        <div className="eyebrow">Error bank</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Your mistakes become study material.</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-500">
          Repeated errors will create targeted drills and spaced reviews instead of disappearing after a practice session.
        </p>
      </header>

      <div className="mt-8">
        {loading ? (
          <div className="card p-8 text-slate-500">Loading mistakes…</div>
        ) : mistakes.length === 0 ? (
          <div className="card p-8 text-center">
            <CheckCircle2 className="mx-auto text-emerald-600" size={34} />
            <h2 className="mt-4 text-xl font-bold">No mistakes recorded yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Once interactive practice is connected, wrong answers and recurring Writing or Speaking issues will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mistakes.map((mistake) => (
              <article key={mistake.id} className="card flex gap-4 p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                  <AlertTriangle size={19} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-700">{mistake.skill} · {mistake.category}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{mistake.explanation}</p>
                  <div className="mt-2 text-xs text-slate-400">{mistake.occurrences} occurrence(s) · {mistake.status}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
