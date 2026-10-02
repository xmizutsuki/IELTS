import { getDay } from "@/content/curriculum";
import { Mistake, PlannedTask, Skill, StudyProgress, UserProfile } from "@/types";

const skills: Skill[] = ["listening", "reading", "writing", "speaking"];

function getPrioritySignal(
  profile: UserProfile,
  progress: StudyProgress,
  mistakes: Mistake[],
): { skill: Skill; reason: string } | null {
  const scored = skills.map((skill) => {
    const estimate = progress.skillEstimates[skill];
    const bandGap = estimate === null ? 0 : Math.max(0, profile.targetOverall - estimate);
    const activeMistakes = mistakes.filter(
      (mistake) => mistake.skill === skill && mistake.status !== "mastered",
    );
    const mistakeWeight = activeMistakes.reduce(
      (total, mistake) => total + Math.min(mistake.occurrences, 5),
      0,
    );

    return {
      skill,
      score: bandGap * 3 + mistakeWeight * 0.55,
      bandGap,
      mistakeWeight,
      topMistake: activeMistakes.sort((a, b) => b.occurrences - a.occurrences)[0],
    };
  });

  const winner = scored.sort((a, b) => b.score - a.score)[0];
  if (!winner || winner.score <= 0) return null;

  if (winner.bandGap > 0 && winner.mistakeWeight > 0 && winner.topMistake) {
    return {
      skill: winner.skill,
      reason: `This skill is below your target estimate and your practice history also shows recurring ${winner.topMistake.category} errors.`,
    };
  }

  if (winner.bandGap > 0) {
    return {
      skill: winner.skill,
      reason: `Your current estimate leaves a ${winner.bandGap.toFixed(1)} Band gap to your target, so this skill gets extra priority.`,
    };
  }

  return {
    skill: winner.skill,
    reason: winner.topMistake
      ? `Recent practice repeatedly flagged ${winner.topMistake.category}. Practice accuracy is being used as a weakness signal, not as a Band score.`
      : "Recent practice data makes this the highest-priority skill.",
  };
}

export function getTodaysPlan(
  profile: UserProfile,
  progress: StudyProgress,
  mistakes: Mistake[] = [],
): PlannedTask[] {
  const day = getDay(progress.currentWeek, progress.currentDay);
  if (!day) return [];

  const baseTotal = day.tasks.reduce((sum, item) => sum + item.minutes, 0);
  const scale = baseTotal > 0 ? profile.dailyMinutes / baseTotal : 1;
  const prioritySignal = getPrioritySignal(profile, progress, mistakes);

  return day.tasks.map((item) => {
    const scaled = Math.max(10, Math.round((item.minutes * scale) / 5) * 5);
    const isPriority = prioritySignal !== null && item.skill === prioritySignal.skill;

    return {
      ...item,
      scaledMinutes: scaled,
      priority: isPriority ? "high" : "core",
      reason: isPriority
        ? prioritySignal.reason
        : progress.currentWeek === 1
          ? "This is part of the core IELTS foundation every beginner should complete."
          : "This activity is part of the core sequence for your current study week.",
    };
  });
}

export function nextStudyPosition(progress: StudyProgress): Pick<StudyProgress, "currentWeek" | "currentDay"> {
  if (progress.currentDay < 7) {
    return { currentWeek: progress.currentWeek, currentDay: progress.currentDay + 1 };
  }

  if (progress.currentWeek < 8) {
    return { currentWeek: progress.currentWeek + 1, currentDay: 1 };
  }

  return { currentWeek: 8, currentDay: 7 };
}
