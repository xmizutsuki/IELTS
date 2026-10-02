import { getDay } from "@/content/curriculum";
import { PlannedTask, Skill, StudyProgress, UserProfile } from "@/types";

const skills: Skill[] = ["listening", "reading", "writing", "speaking"];

function weakestSkill(progress: StudyProgress): Skill | null {
  const measured = skills
    .map((skill) => ({ skill, value: progress.skillEstimates[skill] }))
    .filter((item): item is { skill: Skill; value: number } => item.value !== null);

  if (!measured.length) return null;

  return measured.sort((a, b) => a.value - b.value)[0].skill;
}

export function getTodaysPlan(
  profile: UserProfile,
  progress: StudyProgress,
): PlannedTask[] {
  const day = getDay(progress.currentWeek, progress.currentDay);
  if (!day) return [];

  const baseTotal = day.tasks.reduce((sum, item) => sum + item.minutes, 0);
  const scale = baseTotal > 0 ? profile.dailyMinutes / baseTotal : 1;
  const prioritySkill = weakestSkill(progress);

  return day.tasks.map((item) => {
    const scaled = Math.max(10, Math.round((item.minutes * scale) / 5) * 5);
    const isPriority = prioritySkill !== null && item.skill === prioritySkill;

    return {
      ...item,
      scaledMinutes: scaled,
      priority: isPriority ? "high" : "core",
      reason: isPriority
        ? "Your current estimates make this skill the highest-priority measured gap."
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
