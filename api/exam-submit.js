import { courses } from '../server/course-content.js';
import {
  gradeExam,
  getExamByCourseId,
  PASSING_SCORE,
} from '../server/exam-content.js';
import {
  calculateServerStats,
  courseLessonsComplete,
  courseUnlocked,
} from '../server/progress-stats.js';
import { updateDocument } from '../server/firestore-rest.js';
import { requireActiveUser } from '../server/authorized-user.js';

const json = (response, status, body) => {
  response.status(status).json(body);
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return json(response, 405, { ok: false, error: 'Método no permitido.' });
  }

  try {
    const { path, user } = await requireActiveUser(request);
    const courseId = String(request.body?.courseId ?? '');
    const answers = request.body?.answers;
    const course = courses.find((candidate) => candidate.id === courseId);
    const exam = getExamByCourseId(courseId);

    if (!course || !exam) {
      return json(response, 404, {
        ok: false,
        error: 'No encontramos ese examen.',
      });
    }
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return json(response, 400, {
        ok: false,
        error: 'Selecciona una respuesta para cada pregunta.',
      });
    }

    const completedLessons = user.data.completedLessons ?? [];
    const currentPassedExams = user.data.passedExams ?? [];
    if (!courseUnlocked(course, currentPassedExams)) {
      return json(response, 409, {
        ok: false,
        error: 'Aprueba primero el examen del nivel anterior.',
      });
    }
    if (!courseLessonsComplete(course, completedLessons)) {
      return json(response, 409, {
        ok: false,
        error: 'Completa las ocho clases antes de presentar el examen.',
      });
    }

    const invalidAnswer = exam.questions.some(({ id, options }) => {
      const selectedIndex = answers[id];
      return (
        !Number.isInteger(selectedIndex) ||
        selectedIndex < 0 ||
        selectedIndex >= options.length
      );
    });
    if (invalidAnswer || Object.keys(answers).length !== exam.questions.length) {
      return json(response, 400, {
        ok: false,
        error: 'Debes responder las diez preguntas antes de finalizar.',
      });
    }

    const grading = gradeExam(courseId, answers);
    const {
      review,
      correctAnswers,
      incorrectAnswers,
      score,
      passed,
    } = grading;
    const now = new Date();
    const previousResult = user.data.examResults?.[courseId] ?? {};
    const passedExams = passed
      ? [...new Set([...currentPassedExams, courseId])]
      : [...new Set(currentPassedExams)];
    const examResult = {
      attempts: (previousResult.attempts ?? 0) + 1,
      bestScore: Math.max(previousResult.bestScore ?? 0, score),
      lastScore: score,
      passed: Boolean(previousResult.passed || passed),
      passedAt: previousResult.passedAt ?? (passed ? now : null),
      lastAttemptAt: now,
    };
    const examResults = {
      ...(user.data.examResults ?? {}),
      [courseId]: examResult,
    };
    const stats = calculateServerStats(completedLessons, passedExams);

    await updateDocument(path, {
      passedExams: stats.passedExams,
      examResults,
      currentLevel: stats.currentLevel,
      totalProgress: stats.totalProgress,
      updatedAt: now,
    });

    return json(response, 200, {
      ok: true,
      courseId,
      score,
      correctAnswers,
      incorrectAnswers,
      passingScore: PASSING_SCORE,
      passed,
      review,
      examResult: {
        ...examResult,
        passedAt: examResult.passedAt?.toISOString?.() ?? examResult.passedAt,
        lastAttemptAt: now.toISOString(),
      },
      passedExams: stats.passedExams,
      currentLevel: stats.currentLevel,
      totalProgress: stats.totalProgress,
    });
  } catch (error) {
    return json(response, error.status ?? 500, {
      ok: false,
      error: error.status ? error.message : 'No se pudo calificar el examen.',
    });
  }
}
