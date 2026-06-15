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
