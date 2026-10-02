"use client";

import { PracticeQuestion } from "@/types";
import { ListeningPlayer } from "@/components/practice/listening-player";

interface QuestionCardProps {
  question: PracticeQuestion;
  answer: string;
  onAnswer: (value: string) => void;
  submitted: boolean;
}

export function QuestionCard({ question, answer, onAnswer, submitted }: QuestionCardProps) {
  const usesOptions = Boolean(question.options?.length);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <section className="space-y-5">
        {question.skill === "reading" && question.passage && (
          <article className="card p-6">
            <div className="eyebrow">Reading passage</div>
            <p className="mt-4 text-[15px] leading-8 text-slate-700">{question.passage}</p>
          </article>
        )}

        {question.skill === "listening" && question.audioSource && (
          <ListeningPlayer
            key={question.audioSource.id}
            source={question.audioSource}
            revealSource={submitted}
          />
        )}

        <article className="card p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              {question.questionType.replaceAll("_", " ")}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              Difficulty {question.difficulty}/5
            </span>
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-500">{question.instruction}</p>
          <h2 className="mt-3 text-xl font-bold leading-8">{question.prompt}</h2>

          <div className="mt-6">
            {usesOptions ? (
              <div className="space-y-3">
                {question.options?.map((option) => {
                  const selected = answer === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={submitted}
                      onClick={() => onAnswer(option)}
                      className={
                        "flex w-full items-start gap-3 rounded-2xl border p-4 text-left text-sm leading-6 transition " +
                        (selected
                          ? "border-blue-600 bg-blue-50 text-blue-950"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50") +
                        (submitted ? " cursor-default" : "")
                      }
                    >
                      <span
                        className={
                          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] font-bold " +
                          (selected ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 text-slate-400")
                        }
                      >
                        {String.fromCharCode(65 + (question.options?.indexOf(option) ?? 0))}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                disabled={submitted}
                className="field"
                value={answer}
                onChange={(event) => onAnswer(event.target.value)}
                placeholder="Type your answer"
                autoComplete="off"
              />
            )}
          </div>
        </article>
      </section>

      <aside className="card h-fit p-6 lg:sticky lg:top-6">
        <div className="eyebrow">Question strategy</div>
        <h3 className="mt-2 text-lg font-bold">{question.explanation.testedSkill}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Answer first. The evidence, trap and correction strategy will unlock after you submit.
        </p>
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Rule</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Do not change your answer using outside knowledge. Work only with the information available in this question.
          </p>
        </div>
      </aside>
    </div>
  );
}
