import { DBSchema, IDBPDatabase, openDB } from "idb";
import {
  Mistake,
  PracticeQuestion,
  PracticeStats,
  QuestionAttempt,
  SpellingItem,
  SpellingReviewResult,
  SpellingStage,
  StudyProgress,
  UserProfile,
} from "@/types";

interface IELTSLocalDB extends DBSchema {
  profile: {
    key: string;
    value: UserProfile;
  };
  progress: {
    key: string;
    value: StudyProgress;
  };
  mistakes: {
    key: string;
    value: Mistake;
    indexes: { "by-skill": string };
  };
  attempts: {
    key: string;
    value: QuestionAttempt;
    indexes: {
      "by-skill": string;
      "by-question": string;
      "by-created-at": string;
    };
  };
  spelling: {
    key: string;
    value: SpellingItem;
    indexes: {
      "by-next-review": string;
      "by-mastered": number;
    };
  };
}

const DB_NAME = "ielts-band8-academy";
const DB_VERSION = 3;
const SPELLING_INTERVALS = [1, 2, 4, 7, 14] as const;

let dbPromise: Promise<IDBPDatabase<IELTSLocalDB>> | null = null;

function database() {
  if (typeof window === "undefined") {
    throw new Error("Local IELTS storage is only available in the browser.");
  }

  if (!dbPromise) {
    dbPromise = openDB<IELTSLocalDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("profile")) {
          db.createObjectStore("profile");
        }

        if (!db.objectStoreNames.contains("progress")) {
          db.createObjectStore("progress");
        }

        if (!db.objectStoreNames.contains("mistakes")) {
          const store = db.createObjectStore("mistakes", { keyPath: "id" });
          store.createIndex("by-skill", "skill");
        }

        if (!db.objectStoreNames.contains("attempts")) {
          const store = db.createObjectStore("attempts", { keyPath: "id" });
          store.createIndex("by-skill", "skill");
          store.createIndex("by-question", "questionId");
          store.createIndex("by-created-at", "createdAt");
        }

        if (!db.objectStoreNames.contains("spelling")) {
          const store = db.createObjectStore("spelling", { keyPath: "id" });
          store.createIndex("by-next-review", "nextReviewAt");
          store.createIndex("by-mastered", "mastered");
        }
      },
    });
  }

  return dbPromise;
}

export async function getProfile() {
  return (await database()).get("profile", "local-user");
}

export async function saveProfile(profile: UserProfile) {
  return (await database()).put("profile", profile, "local-user");
}

export async function getProgress() {
  return (await database()).get("progress", "main");
}

export async function saveProgress(progress: StudyProgress) {
  return (await database()).put("progress", progress, "main");
}

export async function createInitialProgress(): Promise<StudyProgress> {
  const progress: StudyProgress = {
    id: "main",
    currentWeek: 1,
    currentDay: 1,
    completedTaskIds: [],
    totalMinutes: 0,
    startedAt: new Date().toISOString(),
    skillEstimates: {
      listening: null,
      reading: null,
      writing: null,
      speaking: null,
    },
  };

  await saveProgress(progress);
  return progress;
}

export async function getMistakes() {
  return (await database()).getAll("mistakes");
}

export async function saveMistake(mistake: Mistake) {
  return (await database()).put("mistakes", mistake);
}

function normaliseAnswer(value: string) {
  return value.trim().toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ");
}

function normaliseWord(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z'-]/g, "");
}

function spellingId(correct: string) {
  return `spelling:${normaliseWord(correct)}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function editDistance(a: string, b: string) {
  const left = normaliseWord(a);
  const right = normaliseWord(b);
  const matrix = Array.from({ length: left.length + 1 }, () =>
    Array<number>(right.length + 1).fill(0),
  );

  for (let i = 0; i <= left.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[left.length][right.length];
}

function looksLikeSpellingError(question: PracticeQuestion, answer: string) {
  const correct = normaliseWord(question.correctAnswer);
  const attempt = normaliseWord(answer);

  if (!correct || !attempt || correct === attempt) return false;
  if (question.options?.length) return false;
  if (correct.includes(" ") || attempt.includes(" ")) return false;
  if (question.errorCategory === "spelling") return true;

  const completionType = [
    "sentence_completion",
    "form_completion",
    "note_completion",
  ].includes(question.questionType);

  if (!completionType) return false;

  const distance = editDistance(correct, attempt);
  const allowed = correct.length <= 5 ? 1 : correct.length <= 9 ? 2 : 3;
  return distance <= allowed;
}

function isAnswerCorrect(question: PracticeQuestion, answer: string) {
  const accepted = [question.correctAnswer, ...(question.acceptedAnswers ?? [])].map(normaliseAnswer);
  return accepted.includes(normaliseAnswer(answer));
}

async function upsertSpellingItemInStore(
  store: ReturnType<IDBPDatabase<IELTSLocalDB>["transaction"]>["objectStore"],
  correct: string,
  wrong: string,
  source: SpellingItem["source"],
  sourceSkill?: SpellingItem["sourceSkill"],
) {
  const id = spellingId(correct);
  const existing = await store.get(id) as SpellingItem | undefined;
  const now = new Date().toISOString();

  if (existing) {
    const wrongVariants = Array.from(new Set([...existing.wrongVariants, wrong])).filter(Boolean);
    await store.put({
      ...existing,
      lastWrong: wrong,
      wrongVariants,
      sourceSkill: existing.sourceSkill ?? sourceSkill,
      mastered: false,
      stage: 0,
      nextReviewAt: now,
      lapses: existing.lapses + 1,
    });
    return;
  }

  const item: SpellingItem = {
    id,
    correct: correct.trim(),
    lastWrong: wrong.trim(),
    wrongVariants: wrong.trim() ? [wrong.trim()] : [],
    source,
    sourceSkill,
    createdAt: now,
    nextReviewAt: now,
    stage: 0,
    totalReviews: 0,
    correctReviews: 0,
    lapses: 0,
    mastered: false,
  };
  await store.put(item);
}

export async function recordQuestionAttempt(
  question: PracticeQuestion,
  answer: string,
  responseTimeMs: number,
  mode: QuestionAttempt["mode"] = "practice",
) {
  const db = await database();
  const isCorrect = isAnswerCorrect(question, answer);
  const attempt: QuestionAttempt = {
    id: crypto.randomUUID(),
    questionId: question.id,
    skill: question.skill,
    questionType: question.questionType,
    answer,
    correctAnswer: question.correctAnswer,
    isCorrect,
    responseTimeMs,
    mode,
    createdAt: new Date().toISOString(),
  };

  const transaction = db.transaction(["attempts", "mistakes", "spelling"], "readwrite");
  await transaction.objectStore("attempts").put(attempt);

  const mistakeId = `${question.skill}:${question.questionType}:${question.errorCategory}`;
  const mistakeStore = transaction.objectStore("mistakes");
  const existing = await mistakeStore.get(mistakeId);

  if (!isCorrect) {
    const mistake: Mistake = {
      id: mistakeId,
      skill: question.skill,
      category: question.errorCategory.replaceAll("_", " "),
      explanation: question.explanation.nextTime,
      occurrences: (existing?.occurrences ?? 0) + 1,
      status: "active",
      lastSeenAt: attempt.createdAt,
    };
    await mistakeStore.put(mistake);

    if (looksLikeSpellingError(question, answer)) {
      await upsertSpellingItemInStore(
        transaction.objectStore("spelling"),
        question.correctAnswer,
        answer,
        "practice",
        question.skill,
      );
    }
  } else if (existing) {
    await mistakeStore.put({
      ...existing,
      status: existing.occurrences >= 3 ? "improving" : "mastered",
      lastSeenAt: attempt.createdAt,
    });
  }

  await transaction.done;
  return attempt;
}

export async function getQuestionAttempts() {
  return (await database()).getAll("attempts");
}

export async function getQuestionAttemptsBySkill(skill: "reading" | "listening") {
  return (await database()).getAllFromIndex("attempts", "by-skill", skill);
}

export async function getPracticeStats(skill: "reading" | "listening"): Promise<PracticeStats> {
  const attempts = await getQuestionAttemptsBySkill(skill);
  const correct = attempts.filter((attempt) => attempt.isCorrect).length;
  const byType: PracticeStats["byType"] = {};

  for (const attempt of attempts) {
    const current = byType[attempt.questionType] ?? { attempts: 0, correct: 0, accuracy: 0 };
    current.attempts += 1;
    if (attempt.isCorrect) current.correct += 1;
    current.accuracy = Math.round((current.correct / current.attempts) * 100);
    byType[attempt.questionType] = current;
  }

  return {
    skill,
    attempts: attempts.length,
    correct,
    accuracy: attempts.length ? Math.round((correct / attempts.length) * 100) : 0,
    byType,
  };
}

export async function getSpellingItems() {
  const items = await (await database()).getAll("spelling");
  return items.sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
}

export async function getDueSpellingItems(now = new Date()) {
  const items = await getSpellingItems();
  return items.filter((item) => !item.mastered && new Date(item.nextReviewAt) <= now);
}

export async function addSpellingItem(
  correct: string,
  wrong: string,
  sourceSkill?: SpellingItem["sourceSkill"],
) {
  const db = await database();
  const tx = db.transaction("spelling", "readwrite");
  await upsertSpellingItemInStore(tx.objectStore("spelling"), correct, wrong, "manual", sourceSkill);
  await tx.done;
}

export async function reviewSpellingItem(
  itemId: string,
  answer: string,
): Promise<SpellingReviewResult | null> {
  const db = await database();
  const item = await db.get("spelling", itemId);
  if (!item) return null;

  const reviewedAt = new Date();
  const isCorrect = normaliseWord(answer) === normaliseWord(item.correct);
  let stage: SpellingStage;
  let nextReviewAt: string;
  let mastered = false;

  if (isCorrect) {
    const nextStage = Math.min(item.stage + 1, 5) as SpellingStage;
    stage = nextStage;

    if (nextStage >= 5) {
      mastered = true;
      nextReviewAt = addDays(reviewedAt, SPELLING_INTERVALS[4]);
    } else {
      nextReviewAt = addDays(reviewedAt, SPELLING_INTERVALS[nextStage - 1]);
    }
  } else {
    stage = 0;
    nextReviewAt = addDays(reviewedAt, 1);
  }

  const updated: SpellingItem = {
    ...item,
    lastWrong: isCorrect ? item.lastWrong : answer.trim(),
    wrongVariants: isCorrect
      ? item.wrongVariants
      : Array.from(new Set([...item.wrongVariants, answer.trim()])).filter(Boolean),
    lastReviewedAt: reviewedAt.toISOString(),
    nextReviewAt,
    stage,
    totalReviews: item.totalReviews + 1,
    correctReviews: item.correctReviews + (isCorrect ? 1 : 0),
    lapses: item.lapses + (isCorrect ? 0 : 1),
    mastered,
  };

  await db.put("spelling", updated);

  return {
    itemId,
    answer,
    isCorrect,
    reviewedAt: reviewedAt.toISOString(),
    nextReviewAt,
    stage,
  };
}

export async function deleteSpellingItem(itemId: string) {
  return (await database()).delete("spelling", itemId);
}

export async function clearLocalStudyData() {
  const db = await database();
  await Promise.all([
    db.clear("profile"),
    db.clear("progress"),
    db.clear("mistakes"),
    db.clear("attempts"),
    db.clear("spelling"),
  ]);
}
