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

export type QuestionType =
  | "multiple_choice"
  | "true_false_not_given"
  | "yes_no_not_given"
  | "sentence_completion"
  | "form_completion"
  | "note_completion";

export interface HumanAudioSource {
  id: string;
  url: string;
  reader: string;
  sourceTitle: string;
  sourcePage: string;
  duration: string;
  provider: "LibriVox";
  licenseNote: string;
}

export interface PracticeQuestion {
  id: string;
  skill: "reading" | "listening";
  questionType: QuestionType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  title: string;
  passage?: string;
  audioSource?: HumanAudioSource;
  instruction: string;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  explanation: {
    testedSkill: string;
    evidence: string;
    whyCorrect: string;
    trap: string;
    nextTime: string;
  };
  errorCategory:
    | "vocabulary_gap"
    | "paraphrase_failure"
    | "distractor"
    | "misread_question"
    | "spelling"
    | "word_limit"
    | "inference"
    | "not_given_confusion"
    | "attention_loss"
    | "strategy_error";
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  skill: "reading" | "listening";
  questionType: QuestionType;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
  mode: "practice" | "timed" | "mock";
  createdAt: string;
}

export interface PracticeStats {
  skill: "reading" | "listening";
  attempts: number;
  correct: number;
  accuracy: number;
  byType: Partial<Record<QuestionType, {
    attempts: number;
    correct: number;
    accuracy: number;
  }>>;
}

export type SpellingStage = 0 | 1 | 2 | 3 | 4 | 5;

export interface SpellingItem {
  id: string;
  correct: string;
  lastWrong: string;
  wrongVariants: string[];
  source: "practice" | "manual";
  sourceSkill?: "listening" | "reading" | "writing" | "speaking";
  createdAt: string;
  lastReviewedAt?: string;
  nextReviewAt: string;
  stage: SpellingStage;
  totalReviews: number;
  correctReviews: number;
  lapses: number;
  mastered: boolean;
}

export interface SpellingReviewResult {
  itemId: string;
  answer: string;
  isCorrect: boolean;
  reviewedAt: string;
  nextReviewAt: string;
  stage: SpellingStage;
}

