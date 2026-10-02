import { PracticeQuestion, QuestionAttempt } from "@/types";

export function selectPracticeQuestions(
  questions: PracticeQuestion[],
  attempts: QuestionAttempt[],
  limit = 8,
) {
  const latestByQuestion = new Map<string, QuestionAttempt>();

  for (const attempt of attempts) {
    const previous = latestByQuestion.get(attempt.questionId);
    if (!previous || previous.createdAt < attempt.createdAt) {
      latestByQuestion.set(attempt.questionId, attempt);
    }
  }

  return [...questions]
    .sort((a, b) => {
      const aAttempt = latestByQuestion.get(a.id);
      const bAttempt = latestByQuestion.get(b.id);

      if (!aAttempt && bAttempt) return -1;
      if (aAttempt && !bAttempt) return 1;

      if (aAttempt && bAttempt && aAttempt.isCorrect !== bAttempt.isCorrect) {
        return aAttempt.isCorrect ? 1 : -1;
      }

      return a.difficulty - b.difficulty;
    })
    .slice(0, limit);
}
