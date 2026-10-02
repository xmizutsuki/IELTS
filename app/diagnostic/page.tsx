"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useLocalStudy } from "@/hooks/use-local-study";
import { Skill } from "@/types";

const skills: { key: Skill; label: string }[] = [
  { key: "listening", label: "Listening" },
  { key: "reading", label: "Reading" },
  { key: "writing", label: "Writing" },
  { key: "speaking", label: "Speaking" },
];

export default function DiagnosticPage() {
  const { progress, setSkillEstimate, loading } = useLocalStudy();
  const [saved, setSaved] = useState(false);

  if (loading || !progress) {
    return <AppShell><div className="card p-8 text-slate-500">Loading diagnostic…</div></AppShell>;
  }

  async function update(skill: Skill, raw: string) {
    setSaved(false);
    await setSkillEstimate(skill, raw === "" ? null : Number(raw));
    setSaved(true);
  }

  return (
    <AppShell>
      <header>
        <div className="eyebrow">Baseline</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Diagnostic</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-500">
          A reliable IELTS estimate should come from sufficient timed evidence. This first build lets you record an existing official or credible mock score without pretending that a tiny quiz can accurately predict your Band.
        </p>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="card p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <Target size={22} />
            </div>
            <div>
              <h2 className="font-bold">Do you already have a score?</h2>
              <p className="text-sm text-slate-500">Enter it below. Leave unknown skills blank.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {skills.map(({ key, label }) => (
              <label key={key} className="rounded-2xl border border-slate-200 p-4">
                <span className="text-sm font-semibold">{label}</span>
                <select
                  className="field mt-3"
                  value={progress.skillEstimates[key] ?? ""}
                  onChange={(event) => void update(key, event.target.value)}
                >
                  <option value="">Not assessed</option>
                  {[4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((band) => (
                    <option value={band} key={band}>Band {band.toFixed(1)}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          {saved && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              <CheckCircle2 size={18} /> Saved locally. Your daily plan can now recognise the lowest measured skill.
            </div>
          )}
        </section>

        <aside className="card p-6">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle size={20} />
            <h2 className="font-bold">Why no fake instant score?</h2>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Reading and Listening need enough questions to reduce random variation. Writing and Speaking require criterion-based evaluation. The upcoming diagnostic engine will collect that evidence rather than infer Band 8 readiness from a handful of easy questions.
          </p>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <strong>Planned diagnostic:</strong> timed Reading and Listening samples, one Writing response, a recorded Speaking sample, confidence levels and a clear distinction between IELTS strategy gaps and general English gaps.
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
