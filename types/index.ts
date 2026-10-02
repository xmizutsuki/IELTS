export type Skill = "listening" | "reading" | "writing" | "speaking";
export type ExamType = "academic" | "general";
export type ExperienceLevel = "never" | "some" | "experienced";

export interface UserProfile {
  id: "local-user";
  name: string;
  examType: ExamType;
  targetOverall: number;
  dailyMinutes: number;
  studyDaysPerWeek: number;
  examDate?: string;
  experience: ExperienceLevel;
  createdAt: string;
}

export type TaskType =
  | "lesson"
  | "practice"
  | "review"
  | "mock"
  | "writing"
  | "speaking"
  | "vocabulary";

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  minutes: number;
  skill: Skill | "general";
  type: TaskType;
  href?: string;
}

export interface StudyDay {
  day: number;
  title: string;
  objective: string;
  tasks: StudyTask[];
}

export interface CurriculumWeek {
  week: number;
  title: string;
  theme: string;
  goal: string;
  days: StudyDay[];
}

export interface SkillEstimates {
  listening: number | null;
  reading: number | null;
  writing: number | null;
  speaking: number | null;
}

export interface StudyProgress {
  id: "main";
  currentWeek: number;
  currentDay: number;
  completedTaskIds: string[];
  totalMinutes: number;
  startedAt: string;
  lastStudyDate?: string;
  skillEstimates: SkillEstimates;
}

export interface PlannedTask extends StudyTask {
  scaledMinutes: number;
  reason: string;
  priority: "core" | "high";
}

export interface Mistake {
  id: string;
  skill: Skill;
  category: string;
  explanation: string;
  occurrences: number;
  status: "active" | "improving" | "mastered";
  lastSeenAt: string;
}
