"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { QuestionCard } from "@/components/practice/question-card";
import { getQuestionsForSkill } from "@/content/questions";
import { selectPracticeQuestions } from "@/lib/adaptive/practice";
import {
  getPracticeStats,
  getQuestionAttemptsBySkill,
  recordQuestionAttempt,
} from "@/lib/storage/db";
import { PracticeQuestion, PracticeStats, QuestionAttempt } from "@/types";

type PracticeSkill = "reading" | "listening";

export default function PracticePage() {
  const params = useParams<{ skill: string }>();
  const skill = params.skill as PracticeSkill;
  const validSkill = skill === "reading" || skill === "listening";
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<PracticeQuestion[]>([]);
  const [stats, setStats] = useState<PracticeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<QuestionAttempt | null>(null);
  const [finished, setFinished] = useState(false);
  const questionStartedAt = useRef(Date.now());

  useEffect(() => {
    if (!validSkill) {
      setLoading(false);
      return;
    }

    void Promise.all([
      getQuestionAttemptsBySkill(skill),
      getPracticeStats(skill),
    ]).then(([storedAttempts, storedStats]) => {
      const selected = selectPracticeQuestions(
        getQuestionsForSkill(skill),
        storedAttempts,
        8,
      );
      setAttempts(storedAttempts);
      setStats(storedStats);
      setSessionQuestions(selected);
      setLoading(false);
    });
  }, [skill, validSkill]);

  const current = sessionQuestions[index];

  const sessionProgress = useMemo(() => {
    if (!sessionQuestions.length) return 0;
    return Math.round(((index + (result ? 1 : 0)) / sessionQuestions.length) * 100);
  }, [index, result, sessionQuestions.length]);

  function startSession() {
    setStarted(true);
    setFinished(false);
    setIndex(0);
    setAnswer("");
    setResult(null);
    questionStartedAt.current = Date.now();
  }

  async function submitAnswer() {
    if (!current || !answer.trim() || result) return;

    const attempt = await recordQuestionAttempt(
      current,
      answer,
      Date.now() - questionStartedAt.current,
      "practice",
    );

    setResult(attempt);
    setAttempts((items) => [...items, attempt]);
    setStats(await getPracticeStats(skill));
  }

  function nextQuestion() {
    if (index >= sessionQuestions.length - 1) {
      setFinished(true);
      setStarted(false);
      return;
    }

    setIndex((value) => value + 1);
    setAnswer("");
    setResult(null);
    questionStartedAt.current = Date.now();
  }

  function restartAdaptiveSet() {
    const selected = selectPracticeQuestions(
      getQuestionsForSkill(skill),
      attempts,
      8,
    );
    setSessionQuestions(selected);
    startSession();
  }

  if (!validSkill) {
    return (
      <AppShell>
        <div className="card p-8">
          Practice is currently available for Reading and Listening.
        </div>
      </AppShell>
    );
  }

  if (loading) {
    return (
      <AppShell>
        <div className="card p-8 text-slate-500">Building your practice set…</div>
      </AppShell>
    );
  }

  if (finished) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl">
          <section className="card p-8 text-center">
            <CheckCircle2 className="mx-auto text-emerald-600" size={42} />
            <div className="eyebrow mt-5">Session complete</div>
            <h1 className="mt-2 text-3xl font-bold">Your practice data is saved locally.</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Wrong-answer categories are now part of your Mistake Bank. The next adaptive set will prioritise unanswered items and questions you recently missed.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-3xl font-bold">{stats?.attempts ?? 0}</div>
                <div className="mt-1 text-xs text-slate-500">total attempts</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-3xl font-bold">{stats?.accuracy ?? 0}%</div>
                <div className="mt-1 text-xs text-slate-500">practice accuracy</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-3xl font-bold">{Object.keys(stats?.byType ?? {}).length}</div>
                <div className="mt-1 text-xs text-slate-500">question types seen</div>
              </div>
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button className="btn-primary gap-2" onClick={restartAdaptiveSet}>
                <RotateCcw size={17} /> New adaptive set
              </button>
              <Link className="btn-secondary" href={"/skills/" + skill}>
                Back to {skill}
              </Link>
            </div>
          </section>
        </div>
      </AppShell>
    );
  }

  if (!started || !current) {
    const weakestType = stats
      ? Object.entries(stats.byType)
          .filter(([, value]) => value && value.attempts >= 1)
          .sort((a, b) => (a[1]?.accuracy ?? 100) - (b[1]?.accuracy ?? 100))[0]
      : undefined;

    return (
      <AppShell>
        <Link href={"/skills/" + skill} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
          <ArrowLeft size={17} /> Back to {skill}
        </Link>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="card p-7">
            <div className="eyebrow">{skill} practice</div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Adaptive practice set</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-500">
              This set prioritises questions you have not attempted yet. On later sessions, recently missed question types move forward automatically.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-blue-50 p-4">
                <Target className="text-blue-700" size={20} />
                <div className="mt-3 text-2xl font-bold">{sessionQuestions.length}</div>
                <div className="text-xs text-slate-500">questions</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <CheckCircle2 className="text-emerald-700" size={20} />
                <div className="mt-3 text-2xl font-bold">{stats?.accuracy ?? 0}%</div>
                <div className="text-xs text-slate-500">historical accuracy</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <Clock3 className="text-slate-600" size={20} />
                <div className="mt-3 text-2xl font-bold">10–15m</div>
                <div className="text-xs text-slate-500">estimated time</div>
              </div>
            </div>

            <button className="btn-primary mt-7 gap-2" onClick={startSession}>
              Start practice <ArrowRight size={18} />
            </button>
          </section>

          <aside className="card p-6">
            <div className="eyebrow">Adaptive signal</div>
            <h2 className="mt-2 text-xl font-bold">
              {weakestType ? weakestType[0].replaceAll("_", " ") : "Not enough history yet"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {weakestType
                ? `Current accuracy for this type: ${weakestType[1]?.accuracy ?? 0}%. Practice accuracy is used as a weakness signal, not as an IELTS Band score.`
                : "Complete your first set. The app will then begin separating strong and weak question types."}
            </p>
          </aside>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="eyebrow">{skill} practice</div>
          <h1 className="mt-1 text-2xl font-bold">
            Question {index + 1} of {sessionQuestions.length}
          </h1>
        </div>
        <div className="w-full max-w-sm">
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-400">
            <span>Session progress</span>
            <span>{sessionProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-700 transition-all" style={{ width: sessionProgress + "%" }} />
          </div>
        </div>
      </div>

      <QuestionCard
        key={current.id}
        question={current}
        answer={answer}
        onAnswer={setAnswer}
        submitted={Boolean(result)}
      />

      {!result ? (
        <div className="mt-5 flex justify-end">
          <button
            className="btn-primary"
            disabled={!answer.trim()}
            onClick={() => void submitAnswer()}
          >
            Check answer
          </button>
        </div>
      ) : (
        <section className={"card mt-5 overflow-hidden border-2 " + (result.isCorrect ? "border-emerald-200" : "border-red-200")}>
          <div className={"flex items-center gap-3 p-5 " + (result.isCorrect ? "bg-emerald-50" : "bg-red-50")}>
            {result.isCorrect ? <CheckCircle2 className="text-emerald-700" /> : <XCircle className="text-red-700" />}
            <div>
              <div className={"font-bold " + (result.isCorrect ? "text-emerald-900" : "text-red-900")}>
                {result.isCorrect ? "Correct" : "Not quite"}
              </div>
              {!result.isCorrect && (
                <div className="mt-0.5 text-sm text-red-800">
                  Correct answer: <strong>{current.correctAnswer}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="eyebrow">Evidence</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{current.explanation.evidence}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="eyebrow">{result.isCorrect ? "Why this is correct" : "Why is this wrong?"}</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{current.explanation.whyCorrect}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-5">
              <div className="eyebrow !text-amber-700">The trap</div>
              <p className="mt-2 text-sm leading-6 text-amber-900/80">{current.explanation.trap}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5">
              <div className="eyebrow !text-blue-700">Next time</div>
              <p className="mt-2 text-sm leading-6 text-blue-950/80">{current.explanation.nextTime}</p>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 p-4">
            <button className="btn-primary gap-2" onClick={nextQuestion}>
              {index === sessionQuestions.length - 1 ? "Finish set" : "Next question"}
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      )}
    </AppShell>
  );
}
