# IELTS Band 8 Academy

A local-first IELTS preparation web app built around an adaptive 8-week study plan.

## Current MVP

- Beginner-friendly **IELTS from zero** introduction.
- Complete **8-week / 56-day curriculum**.
- Local onboarding for exam type, Band target and available study time.
- Adaptive daily-plan screen that scales task durations to the learner's schedule.
- Dashboard with local progress and skill estimates.
- Skill introductions for Listening, Reading, Writing and Speaking.
- Interactive **Reading and Listening Practice Engine** with adaptive question selection.
- Original practice bank covering T/F/NG, Y/N/NG, multiple choice and completion tasks.
- One-play browser listening practice using local text-to-speech.
- Immediate correction with evidence, trap analysis and "why is this wrong?" feedback.
- Practice attempts and recurring error categories persisted locally in IndexedDB.
- Practice weaknesses feed the adaptive daily-plan priority without being mislabelled as Band scores.
- Diagnostic baseline screen that avoids inventing a Band from insufficient evidence.
- Progress analytics and local mistake bank foundation.
- All learner state stored in **IndexedDB** in the browser.
- No Supabase, database, account or login required.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- IndexedDB via `idb`
- Lucide icons

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Local-first architecture

The browser stores:

- learner profile;
- current week/day;
- completed study tasks;
- study time;
- skill estimates;
- Reading/Listening question attempts;
- question-type accuracy;
- mistake-bank entries.

The storage layer lives under `lib/storage`, keeping UI code independent from the persistence implementation.

## Product principle

> Data decides what to study next.

The roadmap will expand the MVP with interactive IELTS question banks, timed mocks, Writing evaluation, Speaking recording/analysis, vocabulary review and curated resource discovery.
