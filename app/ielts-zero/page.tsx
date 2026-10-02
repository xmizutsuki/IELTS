import Link from "next/link";
import { ArrowRight, Headphones, MessageCircle, PenLine, Search, Timer, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const sections = [
  {
    title: "Listening",
    icon: Headphones,
    facts: ["4 parts", "40 questions", "Audio is played once"],
    tip: "Read ahead, predict the answer type and expect paraphrasing.",
    href: "/skills/listening",
  },
  {
    title: "Reading",
    icon: Search,
    facts: ["60 minutes", "40 questions", "3 passages in Academic"],
    tip: "You do not need to translate every word. Search for meaning and evidence.",
    href: "/skills/reading",
  },
  {
    title: "Writing",
    icon: PenLine,
    facts: ["60 minutes", "2 tasks", "Task 2 carries greater weight"],
    tip: "Answer exactly what was asked. Accurate language beats forced 'advanced' vocabulary.",
    href: "/skills/writing",
  },
  {
    title: "Speaking",
    icon: MessageCircle,
    facts: ["11–14 minutes", "3 parts", "Live interview format"],
    tip: "You need to be easy to understand, not imitate a British accent.",
    href: "/skills/speaking",
  },
];

export default function IELTSZeroPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <div className="eyebrow">IELTS from zero</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Understand the test before trying to beat it.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            IELTS reports performance on a 0–9 Band scale. Your Overall score comes from Listening, Reading, Writing and Speaking. Band 8 represents very strong command, but each skill has its own way of being assessed.
          </p>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.title} href={section.href} className="card group p-6 transition hover:-translate-y-0.5 hover:border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                    <Icon size={23} />
                  </div>
                  <ArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700" />
                </div>
                <h2 className="mt-5 text-2xl font-bold">{section.title}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {section.facts.map((fact) => <span key={fact} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{fact}</span>)}
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-500">{section.tip}</p>
              </Link>
            );
          })}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="card p-6">
            <Trophy className="text-blue-700" />
            <h3 className="mt-4 font-bold">Band 8 is not perfection</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">It represents very good command with occasional inaccuracies rather than flawless English.</p>
          </div>
          <div className="card p-6">
            <Timer className="text-blue-700" />
            <h3 className="mt-4 font-bold">Timing is a skill</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">The course first teaches accuracy, then gradually adds time pressure and full mocks.</p>
          </div>
          <div className="card p-6">
            <PenLine className="text-blue-700" />
            <h3 className="mt-4 font-bold">No memorised answers</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Templates can help structure thinking, but memorised essays and speaking answers are not the learning strategy.</p>
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <Link className="btn-primary gap-2" href="/study/today">Start Week 1 <ArrowRight size={18} /></Link>
        </div>
      </div>
    </AppShell>
  );
}
