"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpenCheck, Clock3, Target } from "lucide-react";
import { useLocalStudy } from "@/hooks/use-local-study";
import { ExamType, ExperienceLevel, UserProfile } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { initialise } = useLocalStudy();
  const [name, setName] = useState("");
  const [examType, setExamType] = useState<ExamType>("academic");
  const [targetOverall, setTargetOverall] = useState(8);
  const [dailyMinutes, setDailyMinutes] = useState(120);
  const [studyDaysPerWeek, setStudyDaysPerWeek] = useState(6);
  const [experience, setExperience] = useState<ExperienceLevel>("never");
  const [examDate, setExamDate] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const profile: UserProfile = {
      id: "local-user",
      name: name.trim() || "Learner",
      examType,
      targetOverall,
      dailyMinutes,
      studyDaysPerWeek,
      experience,
      examDate: examDate || undefined,
      createdAt: new Date().toISOString(),
    };

    await initialise(profile);
    router.push(experience === "never" ? "/ielts-zero" : "/dashboard");
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-center">
          <span className="eyebrow">IELTS Band 8 Academy</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Your eight-week road to a stronger IELTS score.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Start from zero, understand the exam, build the four skills and let your local performance data decide what deserves more study time.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              [BookOpenCheck, "Beginner friendly", "The course teaches the exam before testing strategy."],
              [Target, "Target driven", "Every study block connects to your score goal."],
              [Clock3, "Fits your day", "Daily sessions scale to the time you actually have."],
            ].map(([Icon, title, text]) => {
              const ItemIcon = Icon as typeof BookOpenCheck;
              return (
                <div key={String(title)} className="flex gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <ItemIcon className="mt-0.5 text-blue-700" size={20} />
                  <div>
                    <div className="font-semibold">{String(title)}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">{String(text)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <form onSubmit={submit} className="card p-6 sm:p-8">
          <div className="eyebrow">Build my plan</div>
          <h2 className="mt-2 text-2xl font-bold">A few details first</h2>

          <div className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Name</span>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </label>

            <div>
              <span className="mb-2 block text-sm font-semibold">IELTS type</span>
              <div className="grid grid-cols-2 gap-3">
                {(["academic", "general"] as ExamType[]).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setExamType(type)}
                    className={
                      "rounded-2xl border p-4 text-left capitalize transition " +
                      (examType === type ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white")
                    }
                  >
                    <div className="font-semibold">{type}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {type === "academic" ? "University and professional registration" : "Migration and general contexts"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold">Overall target</span>
                <select className="field" value={targetOverall} onChange={(e) => setTargetOverall(Number(e.target.value))}>
                  {[6.5, 7, 7.5, 8, 8.5, 9].map((band) => <option key={band}>{band}</option>)}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold">Daily study time</span>
                <select className="field" value={dailyMinutes} onChange={(e) => setDailyMinutes(Number(e.target.value))}>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold">Days per week</span>
                <select className="field" value={studyDaysPerWeek} onChange={(e) => setStudyDaysPerWeek(Number(e.target.value))}>
                  {[4, 5, 6, 7].map((days) => <option key={days} value={days}>{days} days</option>)}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold">Planned exam date</span>
                <input className="field" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
              </label>
            </div>

            <label>
              <span className="mb-2 block text-sm font-semibold">IELTS experience</span>
              <select className="field" value={experience} onChange={(e) => setExperience(e.target.value as ExperienceLevel)}>
                <option value="never">I have never studied IELTS</option>
                <option value="some">I know a little about IELTS</option>
                <option value="experienced">I have prepared for IELTS before</option>
              </select>
            </label>
          </div>

          <button className="btn-primary mt-7 w-full gap-2" type="submit">
            Build my 8-week plan <ArrowRight size={18} />
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            Your study profile and progress are stored in this browser. No account is required.
          </p>
        </form>
      </div>
    </main>
  );
}
