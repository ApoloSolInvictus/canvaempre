const getAuthorization = async (user) => {
  if (typeof user?.getIdToken !== 'function') {
    throw new Error('Necesitas iniciar sesión nuevamente.');
  }

  return `Bearer ${await user.getIdToken()}`;
};

const readError = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
};

const buildDemoLesson = (lessonId) => ({
  id: lessonId,
  summary:
    'Esta vista de demostración presenta la estructura de una clase. En producción, el contenido completo se entrega únicamente a perfiles con acceso activo.',
  goals: [
    'Comprender el objetivo principal de la clase.',
    'Aplicar el concepto en una pieza visual.',
    'Guardar un avance para continuar el programa.',
  ],
  steps: [
    'Define qué necesita comunicar tu diseño.',
    'Aplica el concepto en una pieza sencilla.',
    'Revisa claridad y coherencia antes de guardar.',
  ],
  practice: 'Realiza una práctica breve con una pieza de tu propia marca.',
  assignment: 'Guarda tu avance para retomarlo en la siguiente clase.',
});

const demoExamQuestions = [
  {
    id: 'demo-q1',
    prompt: '¿Qué debe definirse antes de comenzar un diseño?',
    options: [
      'El efecto más llamativo',
      'El objetivo y el mensaje',
      'Cinco tipografías',
      'Todos los colores',
      'La descarga final',
    ],
    correctIndex: 1,
  },
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `demo-q${index + 2}`,
    prompt: `Pregunta de demostración ${index + 2}: selecciona la práctica que aporta mayor claridad.`,
    options: [
      'Agregar elementos sin función',
      'Cambiar la identidad en cada pieza',
      'Usar jerarquía, contraste y alineación',
      'Ocultar la llamada a la acción',
      'Reducir todo el texto al mínimo tamaño',
    ],
    correctIndex: 2,
  })),
];

const publicDemoExam = (courseId) => ({
  courseId,
  title: 'Examen de demostración',
  passingScore: 70,
  questionCount: demoExamQuestions.length,
  questions: demoExamQuestions.map(({ id, prompt, options }) => ({
    id,
    prompt,
    options,
  })),
});

export const fetchLessonContent = async (user, lessonId) => {
  if (user?.isDemo) return buildDemoLesson(lessonId);

  const response = await fetch(
    `/api/lesson-content?id=${encodeURIComponent(lessonId)}`,
    {
      headers: { Authorization: await getAuthorization(user) },
    },
  );
  if (!response.ok) {
    throw new Error(
      await readError(response, 'No se pudo cargar el contenido de la clase.'),
    );
  }
  const data = await response.json();
  return data.lesson;
};

export const fetchCourseExam = async (user, courseId) => {
  if (user?.isDemo) {
    return {
      exam: publicDemoExam(courseId),
      previousResult: null,
    };
  }

  const response = await fetch(
    `/api/exam-content?courseId=${encodeURIComponent(courseId)}`,
    {
      headers: { Authorization: await getAuthorization(user) },
    },
  );
  if (!response.ok) {
    throw new Error(
      await readError(response, 'No se pudo cargar el examen.'),
    );
  }
  return response.json();
};

export const submitExamAnswers = async (user, courseId, answers) => {
  if (user?.isDemo) {
    const review = demoExamQuestions.map((item) => ({
      id: item.id,
      selectedIndex: answers[item.id],
      correctIndex: item.correctIndex,
      correct: answers[item.id] === item.correctIndex,
      explanation:
        'La respuesta correcta aplica claridad, intención y coherencia visual.',
    }));
    const correctAnswers = review.filter((item) => item.correct).length;
    const score = correctAnswers * 10;
    const passed = score >= 70;

    return {
      ok: true,
      courseId,
      score,
      correctAnswers,
      incorrectAnswers: 10 - correctAnswers,
      passingScore: 70,
      passed,
      review,
      examResult: {
        attempts: 1,
        bestScore: score,
        lastScore: score,
        passed,
        passedAt: passed ? new Date().toISOString() : null,
        lastAttemptAt: new Date().toISOString(),
      },
    };
  }

  const response = await fetch('/api/exam-submit', {
    method: 'POST',
    headers: {
      Authorization: await getAuthorization(user),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseId, answers }),
  });
  if (!response.ok) {
    throw new Error(
      await readError(response, 'No se pudo calificar el examen.'),
    );
  }
  return response.json();
};

export const fetchCourseResources = async (user, courseId) => {
  if (user?.isDemo) {
    return [0, 1, 2].map((index) => ({
      index,
      type: 'Recurso protegido',
      title: `Material práctico ${index + 1}`,
      description:
        'Los materiales descargables se habilitan con un acceso activo.',
      items: [
        'Guía de aplicación.',
        'Lista de revisión.',
        'Ejercicio para el emprendimiento.',
      ],
      useCase: 'Disponible para estudiantes con acceso completo.',
    }));
  }

  const response = await fetch(
    `/api/course-resources?courseId=${encodeURIComponent(courseId)}`,
    {
      headers: { Authorization: await getAuthorization(user) },
    },
  );
  if (!response.ok) {
    throw new Error(
      await readError(response, 'No se pudieron cargar los recursos.'),
    );
  }
  const data = await response.json();
  return data.resources;
};

export const downloadCourseResource = async ({
  user,
  courseId,
  resourceIndex,
  fileName,
}) => {
  if (user?.isDemo) {
    throw new Error('La descarga está disponible con un acceso activo.');
  }

  const params = new URLSearchParams({
    courseId,
    index: String(resourceIndex),
  });
  const response = await fetch(`/api/resource-download?${params}`, {
    headers: { Authorization: await getAuthorization(user) },
  });
  if (!response.ok) {
    throw new Error(
      await readError(response, 'No se pudo descargar el recurso.'),
    );
  }

  const objectUrl = URL.createObjectURL(await response.blob());
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
};
