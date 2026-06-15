const lessonDurations = [
  '10 min',
  '15 min',
  '15 min',
  '15 min',
  '15 min',
  '20 min',
  '15 min',
  '15 min',
];

const courseBlueprints = [
  {
    id: 'nivel-0-introduccion-canva',
    title: 'Introducción a Canva',
    level: 0,
    duration: '2 horas',
    objective: 'Que el estudiante conozca Canva desde cero.',
    description:
      'Aprende a moverte por Canva, entender sus herramientas base y crear tu primera pieza visual sin fricción.',
    gradient: 'from-indigo-600 to-violet-600',
    accent: '#6D35FF',
    resources: [
      'Checklist para abrir tu cuenta de Canva',
      'Guía rápida de exportación para redes sociales',
      'Plantilla de primera publicación',
    ],
    lessons: [
      'Qué es Canva y para qué sirve',
      'Crear una cuenta y configurar perfil',
      'Conocer el panel principal',
      'Diferencia entre plantillas, diseños y elementos',
      'Cómo guardar, descargar y compartir',
      'Primer diseño simple paso a paso',
      'Buenas prácticas para principiantes',
      'Mini proyecto: publicación básica',
    ],
  },
  {
    id: 'nivel-1-fundamentos-diseno',
    title: 'Fundamentos de Diseño Gráfico',
    level: 1,
    duration: '2 horas',
    objective: 'Aprender las bases visuales antes de diseñar.',
    description:
      'Domina jerarquía, composición, contraste y alineación para crear piezas limpias y profesionales.',
    gradient: 'from-sky-500 to-violet-600',
    accent: '#4F46E5',
    resources: [
      'Mapa de jerarquía visual',
      'Lista de errores comunes de diseño',
      'Plantilla de revisión antes de publicar',
    ],
    lessons: [
      'Qué es el diseño gráfico',
      'Jerarquía visual',
      'Composición y equilibrio',
      'Espaciado y alineación',
      'Contraste visual',
      'Uso correcto de imágenes',
      'Errores comunes de diseño',
      'Mini proyecto: pieza visual limpia',
    ],
  },
  {
    id: 'nivel-2-publicaciones-conectan',
    title: 'Diseña Publicaciones que Conectan',
    level: 2,
    duration: '2 horas',
    objective: 'Crear contenido para redes sociales.',
    description:
      'Convierte ideas en publicaciones con propósito, paletas efectivas y composiciones pensadas para conectar.',
    gradient: 'from-fuchsia-500 to-indigo-600',
    accent: '#7C3AED',
    resources: [
      'Calendario simple de contenido',
      'Banco de ideas para emprendedores',
      'Checklist de publicación final',
    ],
    lessons: [
      'Introducción',
      'Plantillas que comunican',
      'Diseño con propósito',
      'Colores que conectan',
      'Elementos que suman',
      'Crea tu publicación paso a paso',
      'Revisión y mejores prácticas',
      'Comparte y publica',
    ],
  },
  {
    id: 'nivel-3-branding-emprendedores',
    title: 'Branding para Emprendedores',
    level: 3,
    duration: '2 horas',
    objective: 'Construir identidad visual para una marca.',
    description:
      'Define paleta, tipografías, logo, estilo visual y un kit de marca que mantenga coherencia en cada pieza.',
    gradient: 'from-violet-600 to-cyan-500',
    accent: '#0EA5E9',
    resources: [
      'Ficha de personalidad de marca',
      'Guía de paletas por rubro',
      'Mini manual de identidad visual',
    ],
    lessons: [
      'Qué es una marca visual',
      'Paleta de colores',
      'Tipografías de marca',
      'Logo y variaciones',
      'Estilo visual',
      'Kit de marca en Canva',
      'Aplicaciones prácticas',
      'Mini proyecto: identidad visual básica',
    ],
  },
  {
    id: 'nivel-4-mockups-presentaciones',
    title: 'Mockups y Presentaciones Pro',
    level: 4,
    duration: '2 horas',
    objective: 'Crear presentaciones y mockups profesionales.',
    description:
      'Presenta productos, servicios y propuestas comerciales con mockups, catálogos y slides de alto impacto.',
    gradient: 'from-indigo-700 to-fuchsia-500',
    accent: '#DB2777',
    resources: [
      'Storyboard de presentación comercial',
      'Guía de mockups para productos y servicios',
      'Checklist de exportación final',
    ],
    lessons: [
      'Qué es un mockup',
      'Mockups para productos',
      'Mockups para servicios',
      'Presentaciones comerciales',
      'Portadas profesionales',
      'Diseño de catálogos',
      'Exportación final',
      'Proyecto final: presentación de marca',
    ],
  },
];

export const courses = courseBlueprints.map((course) => {
  const lessons = course.lessons.map((title, lessonIndex) => ({
    id: `${course.id}-leccion-${lessonIndex + 1}`,
    title,
    duration: lessonDurations[lessonIndex],
    moduleTitle: course.title,
    courseId: course.id,
  }));

  return {
    ...course,
    lessons,
    lessonsCount: lessons.length,
    resources: course.resources.map((title, resourceIndex) => ({
      id: `${course.id}-recurso-${resourceIndex + 1}`,
      index: resourceIndex,
      title,
    })),
  };
});

export const allLessons = courses.flatMap((course) => course.lessons);
export const totalLessonCount = allLessons.length;

export const getCourseById = (courseId) =>
  courses.find((course) => course.id === courseId);

export const getLessonById = (lessonId) =>
  allLessons.find((lesson) => lesson.id === lessonId);

export const getCourseForLesson = (lessonId) => {
  const lesson = getLessonById(lessonId);
  return lesson ? getCourseById(lesson.courseId) : null;
};

export const getLessonNavigation = (lessonId) => {
  const course = getCourseForLesson(lessonId);
  if (!course) return {};

  const lessonIndex = course.lessons.findIndex(
    (lesson) => lesson.id === lessonId,
  );

  return {
    lessonNumber: lessonIndex + 1,
    previousLesson:
      lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null,
    nextLesson:
      lessonIndex < course.lessons.length - 1
        ? course.lessons[lessonIndex + 1]
        : null,
  };
};
