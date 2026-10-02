"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Plus,
  RotateCcw,
  SpellCheck2,
  Trash2,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  addSpellingItem,
  deleteSpellingItem,
  getDueSpellingItems,
  getSpellingItems,
  reviewSpellingItem,
} from "@/lib/storage/db";
import { SpellingItem, SpellingReviewResult } from "@/types";

const REVIEW_STEPS = ["Day 1", "Day 2", "Day 4", "Day 7", "Day 14"] as const;

function stageLabel(item: SpellingItem) {
  if (item.mastered) return "Mastered";
  if (item.stage === 0) return "Due now";
  return REVIEW_STEPS[Math.min(item.stage, 4)];
}

function dateLabel(value: string) {
  const date = new Date(value);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export default function SpellingPage() {
  const [items, setItems] = useState<SpellingItem[]>([]);
  const [due, setDue] = useState<SpellingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewAnswer, setReviewAnswer] = useState("");
  const [reviewResult, setReviewResult] = useState<SpellingReviewResult | null>(null);
  const [manualWrong, setManualWrong] = useState("");
  const [manualCorrect, setManualCorrect] = useState("");
  const [added, setAdded] = useState(false);

  async function refresh() {
    const [allItems, dueItems] = await Promise.all([
      getSpellingItems(),
      getDueSpellingItems(),
    ]);
    setItems(allItems);
    setDue(dueItems);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const currentReview = due[reviewIndex];

  const stats = useMemo(() => {
    const totalReviews = items.reduce((sum, item) => sum + item.totalReviews, 0);
    const correctReviews = items.reduce((sum, item) => sum + item.correctReviews, 0);

    return {
      total: items.length,
      due: due.length,
      mastered: items.filter((item) => item.mastered).length,
      accuracy: totalReviews ? Math.round((correctReviews / totalReviews) * 100) : null,
    };
  }, [items, due]);

  async function submitManual(event: FormEvent) {
    event.preventDefault();
    if (!manualWrong.trim() || !manualCorrect.trim()) return;

    await addSpellingItem(manualCorrect, manualWrong);
    setManualWrong("");
    setManualCorrect("");
    setAdded(true);
    await refresh();

    window.setTimeout(() => setAdded(false), 1800);
  }

  async function checkReview() {
    if (!currentReview || !reviewAnswer.trim() || reviewResult) return;
    const result = await reviewSpellingItem(currentReview.id, reviewAnswer);
    setReviewResult(result);
  }

  async function nextReview() {
    setReviewAnswer("");
    setReviewResult(null);

    const nextIndex = reviewIndex + 1;
    if (nextIndex >= due.length) {
      setReviewIndex(0);
      await refresh();
      return;
    }

    setReviewIndex(nextIndex);
  }

  async function remove(itemId: string) {
    await deleteSpellingItem(itemId);
    if (reviewIndex > 0) setReviewIndex((value) => Math.max(0, value - 1));
    await refresh();
  }

  return (
    <AppShell>
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="eyebrow">Personal error bank</div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">IELTS Spelling Bank</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-500">
            Only words you actually miss belong here. Correct reviews move through
            Day 1 → Day 2 → Day 4 → Day 7 → Day 14. A new spelling error resets the word to the beginning.
          </p>
        </div>
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
          {stats.due} due today
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card p-5">
          <SpellCheck2 className="text-blue-700" size={20} />
          <div className="mt-3 text-3xl font-bold">{stats.total}</div>
          <div className="mt-1 text-xs text-slate-500">personal words</div>
        </div>
        <div className="card p-5">
          <Clock3 className="text-amber-700" size={20} />
          <div className="mt-3 text-3xl font-bold">{stats.due}</div>
          <div className="mt-1 text-xs text-slate-500">reviews due</div>
        </div>
        <div className="card p-5">
          <CheckCircle2 className="text-emerald-700" size={20} />
          <div className="mt-3 text-3xl font-bold">{stats.mastered}</div>
          <div className="mt-1 text-xs text-slate-500">mastered</div>
        </div>
        <div className="card p-5">
          <RotateCcw className="text-slate-600" size={20} />
          <div className="mt-3 text-3xl font-bold">
            {stats.accuracy === null ? "—" : stats.accuracy + "%"}
          </div>
          <div className="mt-1 text-xs text-slate-500">review accuracy</div>
        </div>
      </section>

      <section className="card mt-5 overflow-hidden">
        <div className="border-b border-slate-100 p-6">
          <div className="eyebrow">Review due today</div>
          <h2 className="mt-2 text-2xl font-bold">Fix the spelling from memory</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            The correct spelling stays hidden until you answer. You only review words from your own error history.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-slate-500">Loading your spelling bank…</div>
        ) : !currentReview ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto text-emerald-600" size={38} />
            <h3 className="mt-4 text-xl font-bold">Nothing due right now</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              New mistakes will appear here automatically when the app detects a likely spelling error. You can also add a known mistake manually below.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-3xl bg-slate-950 p-6 text-white">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Your previous spelling
                </div>
                <div className="mt-4 break-words text-3xl font-bold tracking-tight">
                  {currentReview.lastWrong}
                </div>
                <div className="mt-5 text-xs leading-5 text-slate-400">
                  Correct this word without revealing the answer first.
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 p-6">
                <label className="text-sm font-semibold">Correct spelling</label>
                <input
                  autoFocus
                  value={reviewAnswer}
                  onChange={(event) => setReviewAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && reviewAnswer.trim() && !reviewResult) {
                      void checkReview();
                    }
                  }}
                  disabled={Boolean(reviewResult)}
                  className="field mt-3 text-lg"
                  placeholder="Type the word correctly"
                  autoComplete="off"
                  spellCheck={false}
                />

                {!reviewResult ? (
                  <button
                    onClick={() => void checkReview()}
                    disabled={!reviewAnswer.trim()}
                    className="btn-primary mt-4"
                  >
                    Check spelling
                  </button>
                ) : (
                  <div className="mt-5">
                    <div
                      className={
                        "flex gap-3 rounded-2xl p-4 " +
                        (reviewResult.isCorrect
                          ? "bg-emerald-50 text-emerald-900"
                          : "bg-red-50 text-red-900")
                      }
                    >
                      {reviewResult.isCorrect ? (
                        <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
                      ) : (
                        <XCircle className="mt-0.5 shrink-0" size={20} />
                      )}
                      <div>
                        <div className="font-bold">
                          {reviewResult.isCorrect ? "Correct" : "Missed again"}
                        </div>
                        <div className="mt-1 text-sm">
                          Correct spelling: <strong>{currentReview.correct}</strong>
                        </div>
                        <div className="mt-1 text-xs opacity-70">
                          {reviewResult.isCorrect
                            ? reviewResult.stage >= 5
                              ? "Completed the 14-day sequence."
                              : "Next review: " + dateLabel(reviewResult.nextReviewAt)
                            : "The interval has reset. Next review: " + dateLabel(reviewResult.nextReviewAt)}
                        </div>
                      </div>
                    </div>

                    <button onClick={() => void nextReview()} className="btn-primary mt-4 gap-2">
                      {reviewIndex >= due.length - 1 ? "Finish reviews" : "Next word"}
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <form onSubmit={submitManual} className="card p-6">
          <div className="eyebrow">Add a real mistake</div>
          <h2 className="mt-2 text-xl font-bold">Add manually</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Use this only for words you remember spelling incorrectly in IELTS practice.
          </p>

          <label className="mt-5 block">
            <span className="text-sm font-semibold">My error</span>
            <input
              value={manualWrong}
              onChange={(event) => setManualWrong(event.target.value)}
              className="field mt-2"
              placeholder="e.g. accomodation"
              autoComplete="off"
              spellCheck={false}
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold">Correct spelling</span>
            <input
              value={manualCorrect}
              onChange={(event) => setManualCorrect(event.target.value)}
              className="field mt-2"
              placeholder="e.g. accommodation"
              autoComplete="off"
              spellCheck={false}
            />
          </label>

          <button
            type="submit"
            disabled={!manualWrong.trim() || !manualCorrect.trim()}
            className="btn-primary mt-5 gap-2"
          >
            <Plus size={17} /> Add to my bank
          </button>

          {added && (
            <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
              Added to today&apos;s review queue.
            </div>
          )}
        </form>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 p-6">
            <div className="eyebrow">Your words only</div>
            <h2 className="mt-2 text-xl font-bold">Spelling bank</h2>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center text-sm leading-6 text-slate-500">
              Your bank is empty. That is intentional: it should contain only words you have actually misspelled.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Word</th>
                    <th className="px-5 py-3">My error</th>
                    <th className="px-5 py-3">Correct</th>
                    <th className="px-5 py-3">Next review</th>
                    <th className="px-5 py-3">Stage</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="align-middle">
                      <td className="px-5 py-4 font-semibold">{item.correct}</td>
                      <td className="px-5 py-4 text-red-700">{item.lastWrong}</td>
                      <td className="px-5 py-4 text-emerald-700">{item.correct}</td>
                      <td className="px-5 py-4 text-slate-500">
                        {item.mastered ? "—" : dateLabel(item.nextReviewAt)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            "rounded-full px-2.5 py-1 text-xs font-semibold " +
                            (item.mastered
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-blue-50 text-blue-700")
                          }
                        >
                          {stageLabel(item)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => void remove(item.id)}
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-700"
                          aria-label={"Delete " + item.correct}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="card mt-5 p-6">
        <div className="eyebrow">Review schedule</div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {REVIEW_STEPS.map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
                {step}
              </span>
              {index < REVIEW_STEPS.length - 1 && (
                <ArrowRight className="text-slate-300" size={16} />
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
          Correct spelling advances the interval. A spelling mistake resets the word so the app concentrates your time on unstable words instead of making you copy hundreds of words you already know.
        </p>
      </section>
    </AppShell>
  );
}
