"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, BrainCircuit } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getPracticeStats } from "@/lib/storage/db";
import { PracticeStats, Skill } from "@/types";

const data: Record<Skill, { title: string; intro: string; essentials: string[]; tips: string[] }> = {
  listening: {
    title: "Listening Lab",
    intro: "Train prediction, paraphrase recognition, spelling, distractors and the ability to stay with the recording after a missed answer.",
    essentials: ["4 parts and 40 questions", "Every recording is played once", "Question types include completion, multiple choice, matching and maps"],
    tips: ["Read ahead before the audio starts.", "Predict whether the answer should be a noun, number, place or other form.", "If you miss one answer, move on immediately."],
  },
  reading: {
    title: "Reading Lab",
    intro: "Train evidence-based reading, fast information location and paraphrase recognition rather than translating every sentence.",
    essentials: ["60 minutes", "40 questions", "Academic uses three substantial passages"],
    tips: ["False contradicts the passage; Not Given means the required information is absent.", "Look for synonyms, not identical words.", "Never use outside knowledge to answer a passage question."],
  },
  writing: {
    title: "Writing Lab",
    intro: "Build Task 1 and Task 2 responses around the official criteria: task achievement/response, coherence, lexical resource and grammatical range and accuracy.",
    essentials: ["Task 1 requires at least 150 words", "Task 2 requires at least 250 words", "Task 2 contributes more to the Writing score"],
    tips: ["Plan before writing.", "Develop ideas instead of listing them.", "Use precise natural vocabulary before chasing rare words."],
  },
  speaking: {
    title: "Speaking Lab",
    intro: "Build natural, intelligible and developed responses across the interview, long turn and abstract discussion.",
    essentials: ["3 parts", "Approximately 11–14 minutes", "Part 2 includes one minute of preparation"],
    tips: ["Do not memorise full answers.", "Extend Part 1 naturally with a reason or detail.", "Pronunciation is about intelligibility, rhythm and stress—not copying one accent."],
  },
};

export function SkillClient({ skill }: { skill: Skill }) {
  const content = data[skill];
  const practiceEnabled = skill === "reading" || skill === "listening";
  const [stats, setStats] = useState<PracticeStats | null>(null);

  useEffect(() => {
    if (!practiceEnabled) return;
    void getPracticeStats(skill).then(setStats);
  }, [practiceEnabled, skill]);

  if (!content) return <AppShell><div className="card p-8">Skill not found.</div></AppShell>;

  const weakestType = stats
    ? Object.entries(stats.byType)
        .filter(([, value]) => value && value.attempts > 0)
        .sort((a, b) => (a[1]?.accuracy ?? 100) - (b[1]?.accuracy ?? 100))[0]
    : undefined;

  return (
    <AppShell>
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="eyebrow">{skill}</div>
          <h1 className="mt-2 text-4xl font-bold">{content.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">{content.intro}</p>
        </div>
        {practiceEnabled && (
          <Link href={"/practice/" + skill} className="btn-primary gap-2">
            Start practice <ArrowRight size={18} />
          </Link>
        )}
      </header>

      {practiceEnabled && (
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <BarChart3 className="text-blue-700" size={20} />
            <div className="mt-3 text-3xl font-bold">{stats?.attempts ?? 0}</div>
            <div className="mt-1 text-xs text-slate-500">questions attempted</div>
          </div>
          <div className="card p-5">
            <BrainCircuit className="text-blue-700" size={20} />
            <div className="mt-3 text-3xl font-bold">{stats?.attempts ? (stats.accuracy + "%") : "—"}</div>
            <div className="mt-1 text-xs text-slate-500">practice accuracy, not Band score</div>
          </div>
          <div className="card p-5">
            <div className="eyebrow">Current weakness signal</div>
            <div className="mt-3 text-lg font-bold capitalize">
              {weakestType ? weakestType[0].replaceAll("_", " ") : "Build history first"}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {weakestType ? (weakestType[1]?.accuracy ?? 0) + "% accuracy" : "Complete a practice set to personalise this."}
            </div>
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="card p-6">
          <div className="eyebrow">Know the test</div>
          <h2 className="mt-2 text-xl font-bold">Essentials</h2>
          <ul className="mt-5 space-y-3">
            {content.essentials.map((item) => (
              <li key={item} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{item}</li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <div className="eyebrow">Beginner tips</div>
          <h2 className="mt-2 text-xl font-bold">What to remember first</h2>
          <ol className="mt-5 space-y-3">
            {content.tips.map((tip, index) => (
              <li key={tip} className="flex gap-3 rounded-2xl bg-blue-50/60 p-4 text-sm leading-6 text-slate-700">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-700 text-xs font-bold text-white">{index + 1}</span>
                {tip}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="card mt-5 p-6">
        <div className="eyebrow">{practiceEnabled ? "Practice engine live" : "Next implementation layer"}</div>
        <h2 className="mt-2 text-xl font-bold">
          {practiceEnabled ? "Every answer becomes training data." : "Criterion-based practice is coming next."}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {practiceEnabled
            ? "Reading and Listening attempts are saved locally. Wrong answers are classified into your Mistake Bank, and recurring problems can increase that skill's priority in the daily study plan."
            : "Writing and Speaking will use the same local-first architecture, but they require dedicated editors, recording and criterion-based evaluation rather than simple right/wrong scoring."}
        </p>
      </section>
    </AppShell>
  );
}
