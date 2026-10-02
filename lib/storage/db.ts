import { DBSchema, IDBPDatabase, openDB } from "idb";
import {
  Mistake,
  PracticeQuestion,
  PracticeStats,
  QuestionAttempt,
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
}

const DB_NAME = "ielts-band8-academy";
const DB_VERSION = 2;

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

function isAnswerCorrect(question: PracticeQuestion, answer: string) {
  const accepted = [question.correctAnswer, ...(question.acceptedAnswers ?? [])].map(normaliseAnswer);
  return accepted.includes(normaliseAnswer(answer));
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

  const transaction = db.transaction(["attempts", "mistakes"], "readwrite");
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

export async function clearLocalStudyData() {
  const db = await database();
  await Promise.all([
    db.clear("profile"),
    db.clear("progress"),
    db.clear("mistakes"),
    db.clear("attempts"),
  ]);
}
