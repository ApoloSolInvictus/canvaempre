const minuteLabel = '15 min';

const courseBlueprints = [
  {
    id: 'nivel-0-introduccion-canva',
    title: 'Introduccion a Canva',
    level: 0,
    duration: '2 horas',
    objective: 'Que el estudiante conozca Canva desde cero.',
    description:
      'Aprende a moverte por Canva, entender sus herramientas base y crear tu primera pieza visual sin friccion.',
    gradient: 'from-indigo-600 to-violet-600',
    accent: '#6D35FF',
    resources: [
      'Checklist para abrir tu cuenta de Canva',
      'Guia rapida de exportacion para redes sociales',
      'Plantilla de primera publicacion',
    ],
    lessons: [
      'Que es Canva y para que sirve',
      'Crear una cuenta y configurar perfil',
      'Conocer el panel principal',
      'Diferencia entre plantillas, disenos y elementos',
      'Como guardar, descargar y compartir',
      'Primer diseno simple paso a paso',
      'Buenas practicas para principiantes',
      'Mini proyecto: publicacion basica',
    ],
  },
  {
    id: 'nivel-1-fundamentos-diseno',
    title: 'Fundamentos de Diseno Grafico',
    level: 1,
    duration: '2 horas',
    objective: 'Aprender las bases visuales antes de disenar.',
    description:
      'Domina jerarquia, composicion, contraste y alineacion para crear piezas limpias y profesionales.',
    gradient: 'from-sky-500 to-violet-600',
    accent: '#4F46E5',
    resources: [
      'Mapa de jerarquia visual',
      'Lista de errores comunes de diseno',
      'Plantilla de revision antes de publicar',
    ],
    lessons: [
      'Que es el diseno grafico',
      'Jerarquia visual',
      'Composicion y equilibrio',
      'Espaciado y alineacion',
      'Contraste visual',
      'Uso correcto de imagenes',
      'Errores comunes de diseno',
      'Mini proyecto: pieza visual limpia',
    ],
  },
  {
    id: 'nivel-2-publicaciones-conectan',
    title: 'Disena Publicaciones que Conectan',
    level: 2,
    duration: '2 horas',
    objective: 'Crear contenido para redes sociales.',
    description:
      'Convierte ideas en publicaciones con proposito, paletas efectivas y composiciones pensadas para conectar.',
    gradient: 'from-fuchsia-500 to-indigo-600',
    accent: '#7C3AED',
    resources: [
      'Calendario simple de contenido',
      'Banco de ideas para emprendedores',
      'Checklist de publicacion final',
    ],
    lessons: [
      'Introduccion',
      'Plantillas que comunican',
      'Diseno con proposito',
      'Colores que conectan',
      'Elementos que suman',
      'Crea tu publicacion paso a paso',
      'Revision y mejores practicas',
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
      'Define paleta, tipografias, logo, estilo visual y un kit de marca que mantenga coherencia en cada pieza.',
    gradient: 'from-violet-600 to-cyan-500',
    accent: '#0EA5E9',
    resources: [
      'Ficha de personalidad de marca',
      'Guia de paletas por rubro',
      'Mini manual de identidad visual',
    ],
    lessons: [
      'Que es una marca visual',
      'Paleta de colores',
      'Tipografias de marca',
      'Logo y variaciones',
      'Estilo visual',
      'Kit de marca en Canva',
      'Aplicaciones practicas',
      'Mini proyecto: identidad visual basica',
    ],
  },
  {
    id: 'nivel-4-mockups-presentaciones',
    title: 'Mockups y Presentaciones Pro',
    level: 4,
    duration: '2 horas',
    objective: 'Crear presentaciones y mockups profesionales.',
    description:
      'Presenta productos, servicios y propuestas comerciales con mockups, catalogos y slides de alto impacto.',
    gradient: 'from-indigo-700 to-fuchsia-500',
    accent: '#DB2777',
    resources: [
      'Storyboard de presentacion comercial',
      'Guia de mockups para productos y servicios',
      'Checklist de exportacion final',
    ],
    lessons: [
      'Que es un mockup',
      'Mockups para productos',
      'Mockups para servicios',
      'Presentaciones comerciales',
      'Portadas profesionales',
      'Diseno de catalogos',
      'Exportacion final',
      'Proyecto final: presentacion de marca',
    ],
  },
];

const buildGoals = (course, lessonTitle, index) => [
  `Entender ${lessonTitle.toLowerCase()} dentro de Canva.`,
  `Aplicar el concepto en una pieza real para tu emprendimiento.`,
  index === course.lessons.length - 1
    ? 'Cerrar el modulo con un entregable listo para compartir.'
    : 'Guardar un avance practico para continuar en la siguiente clase.',
];

export const courses = courseBlueprints.map((course) => {
  const lessons = course.lessons.map((title, lessonIndex) => ({
    id: `${course.id}-leccion-${lessonIndex + 1}`,
    courseId: course.id,
    title,
    duration: minuteLabel,
    objective:
      lessonIndex === 0
        ? course.objective
        : `Practicar ${title.toLowerCase()} con criterio visual y enfoque comercial.`,
    content:
      'Clase guiada con ejemplo aplicado, mini practica y revision para que puedas replicarlo en tus propias piezas de Canva.',
    goals: buildGoals(course, title, lessonIndex),
    completed: false,
  }));

  return {
    ...course,
    lessons,
    lessonsCount: lessons.length,
    image: `${course.id}-mockup`,
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
  return lesson ? getCourseById(lesson.courseId) : undefined;
};
