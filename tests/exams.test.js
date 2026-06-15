import test from 'node:test';
import assert from 'node:assert/strict';
import {
  examCourseIds,
  getExamByCourseId,
  getPublicExam,
  gradeExam,
  PASSING_SCORE,
} from '../server/exam-content.js';
import { allLessons, courses } from '../server/course-content.js';
import { calculateServerStats } from '../server/progress-stats.js';

test('incluye cinco exámenes con diez preguntas y cinco opciones', () => {
  assert.equal(examCourseIds.length, 5);

  for (const courseId of examCourseIds) {
    const exam = getExamByCourseId(courseId);
    assert.equal(exam.questions.length, 10);
    assert.equal(new Set(exam.questions.map(({ id }) => id)).size, 10);

    for (const item of exam.questions) {
      assert.equal(item.options.length, 5);
      assert.equal(Number.isInteger(item.correctIndex), true);
      assert.equal(item.correctIndex >= 0 && item.correctIndex < 5, true);
      assert.equal(typeof item.explanation, 'string');
      assert.equal(item.explanation.length > 20, true);
    }
  }
});

test('la versión pública no revela respuestas ni explicaciones', () => {
  const exam = getPublicExam(examCourseIds[0]);
  assert.equal(exam.passingScore, PASSING_SCORE);
  assert.equal(exam.questionCount, 10);

  for (const item of exam.questions) {
    assert.equal('correctIndex' in item, false);
    assert.equal('explanation' in item, false);
  }
});

test('aprueba con siete respuestas correctas y falla con seis', () => {
  const exam = getExamByCourseId(examCourseIds[0]);
  const sevenCorrect = Object.fromEntries(
    exam.questions.map((item, index) => [
      item.id,
      index < 7
        ? item.correctIndex
        : (item.correctIndex + 1) % item.options.length,
    ]),
  );
  const sixCorrect = Object.fromEntries(
    exam.questions.map((item, index) => [
      item.id,
      index < 6
        ? item.correctIndex
        : (item.correctIndex + 1) % item.options.length,
    ]),
  );

  assert.equal(gradeExam(exam.courseId, sevenCorrect).score, 70);
  assert.equal(gradeExam(exam.courseId, sevenCorrect).passed, true);
  assert.equal(gradeExam(exam.courseId, sixCorrect).score, 60);
  assert.equal(gradeExam(exam.courseId, sixCorrect).passed, false);
});

test('el progreso total exige cuarenta clases y cinco exámenes', () => {
  const lessonsOnly = calculateServerStats(
    allLessons.map(({ id }) => id),
    [],
  );
  const complete = calculateServerStats(
    allLessons.map(({ id }) => id),
    courses.map(({ id }) => id),
  );

  assert.equal(lessonsOnly.totalProgress, 89);
  assert.equal(lessonsOnly.allRequirementsComplete, false);
  assert.equal(complete.totalProgress, 100);
  assert.equal(complete.allRequirementsComplete, true);
});
