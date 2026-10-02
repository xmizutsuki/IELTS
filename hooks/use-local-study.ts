"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createInitialProgress,
  getProfile,
  getProgress,
  saveProfile,
  saveProgress,
} from "@/lib/storage/db";
import { nextStudyPosition } from "@/lib/adaptive/daily-plan";
import { Skill, StudyProgress, UserProfile } from "@/types";

export function useLocalStudy() {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [progress, setProgressState] = useState<StudyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [storedProfile, storedProgress] = await Promise.all([getProfile(), getProgress()]);
    setProfileState(storedProfile ?? null);
    setProgressState(storedProgress ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const initialise = useCallback(async (newProfile: UserProfile) => {
    await saveProfile(newProfile);
    const current = (await getProgress()) ?? (await createInitialProgress());
    setProfileState(newProfile);
    setProgressState(current);
  }, []);

  const toggleTask = useCallback(
    async (taskId: string, minutes: number) => {
      if (!progress) return;
      const complete = progress.completedTaskIds.includes(taskId);
      const updated: StudyProgress = {
        ...progress,
        completedTaskIds: complete
          ? progress.completedTaskIds.filter((id) => id !== taskId)
          : [...progress.completedTaskIds, taskId],
        totalMinutes: Math.max(0, progress.totalMinutes + (complete ? -minutes : minutes)),
        lastStudyDate: new Date().toISOString(),
      };
      await saveProgress(updated);
      setProgressState(updated);
    },
    [progress],
  );

  const completeDay = useCallback(async () => {
    if (!progress) return;
    const next = nextStudyPosition(progress);
    const updated = { ...progress, ...next };
    await saveProgress(updated);
    setProgressState(updated);
  }, [progress]);

  const setSkillEstimate = useCallback(
    async (skill: Skill, value: number | null) => {
      if (!progress) return;
      const updated: StudyProgress = {
        ...progress,
        skillEstimates: {
          ...progress.skillEstimates,
          [skill]: value,
        },
      };
      await saveProgress(updated);
      setProgressState(updated);
    },
    [progress],
  );

  return {
    profile,
    progress,
    loading,
    initialise,
    toggleTask,
    completeDay,
    setSkillEstimate,
    refresh,
  };
}
