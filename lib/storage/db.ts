import { DBSchema, IDBPDatabase, openDB } from "idb";
import { Mistake, StudyProgress, UserProfile } from "@/types";

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
}

const DB_NAME = "ielts-band8-academy";
const DB_VERSION = 1;

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

export async function clearLocalStudyData() {
  const db = await database();
  await Promise.all([
    db.clear("profile"),
    db.clear("progress"),
    db.clear("mistakes"),
  ]);
}
