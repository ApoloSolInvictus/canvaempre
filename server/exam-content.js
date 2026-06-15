const question = (id, prompt, options, correctIndex, explanation) => ({
  id,
  prompt,
  options,
  correctIndex,
  explanation,
});

export const PASSING_SCORE = 70;

const examCatalog = {
  'nivel-0-introduccion-canva': {
    title: 'Examen: Introducción a Canva',
    questions: [
      question(
        'n0-q1',
        '¿Cuál describe mejor el propósito de Canva para un emprendimiento?',
        [
          'Administrar pagos y facturas del negocio.',
          'Crear piezas visuales para comunicar ideas, ofertas y marcas.',
          'Programar aplicaciones móviles sin código.',
          'Guardar únicamente fotografías personales.',
          'Reemplazar todas las redes sociales.',
        ],
        1,
        'Canva ayuda a convertir mensajes e ideas en piezas visuales para distintos canales.',
      ),
      question(
        'n0-q2',
        'Antes de elegir colores o tipografías, ¿qué debe definir el emprendedor?',
        [
          'La cantidad máxima de elementos decorativos.',
          'El nombre del archivo descargado.',
          'El objetivo y el mensaje principal de la pieza.',
          'La herramienta más avanzada del editor.',
          'El número de páginas de la plantilla.',
        ],
        2,
        'Un objetivo claro permite decidir qué información debe destacar y qué acción se espera.',
      ),
      question(
        'n0-q3',
        '¿Qué acción facilita mantener organizados los diseños desde el inicio?',
        [
          'Crear carpetas separadas para la marca y las prácticas.',
          'Guardar todos los diseños con el mismo nombre.',
          'Descargar cada cambio como una imagen nueva.',
          'Usar una cuenta diferente para cada publicación.',
          'Eliminar las versiones anteriores inmediatamente.',
        ],
        0,
        'Las carpetas y nombres claros permiten encontrar, reutilizar y comparar los avances.',
      ),
      question(
        'n0-q4',
        'En un editor visual, ¿dónde se construye directamente la pieza?',
        [
          'En el menú de ayuda.',
          'En la papelera de proyectos.',
          'En el panel de notificaciones.',
          'En el lienzo o área central de diseño.',
          'En la pantalla de cierre de sesión.',
        ],
        3,
        'El lienzo es el espacio central donde se colocan y editan textos, imágenes y elementos.',
      ),
      question(
        'n0-q5',
        '¿Cuál es la diferencia correcta entre una plantilla y un elemento?',
        [
          'La plantilla es un archivo descargado y el elemento es una carpeta.',
          'La plantilla ofrece una composición completa; el elemento es una pieza individual.',
          'La plantilla solo contiene texto y el elemento siempre es una fotografía.',
          'La plantilla no se puede editar y el elemento sí.',
          'No existe ninguna diferencia entre ambos.',
        ],
        1,
        'Una plantilla propone una estructura completa; los elementos son recursos individuales que se agregan al diseño.',
      ),
      question(
        'n0-q6',
        '¿Qué formato suele ser apropiado para descargar una publicación de redes sociales?',
        ['DOCX', 'XLSX', 'MP3', 'PNG', 'TXT'],
        3,
        'PNG conserva buena calidad visual y funciona ampliamente en publicaciones digitales.',
      ),
      question(
        'n0-q7',
        '¿Qué práctica protege una versión útil antes de hacer cambios importantes?',
        [
          'Duplicar la página o crear una copia con nombre y fecha.',
          'Cerrar el navegador sin guardar.',
          'Convertir todos los textos en imágenes.',
          'Eliminar la plantilla original.',
          'Compartir el enlace públicamente.',
        ],
        0,
        'Una copia permite experimentar sin perder una versión anterior que ya funcionaba.',
      ),
      question(
        'n0-q8',
        '¿Cuál combinación representa una buena práctica para principiantes?',
        [
          'Cinco tipografías y siete colores principales.',
          'Texto pequeño, fondos complejos y muchos efectos.',
          'Dos tipografías, hasta tres colores principales y alineación consistente.',
          'Un elemento distinto en cada espacio vacío.',
          'Cambiar el estilo visual en cada publicación.',
        ],
        2,
        'Limitar fuentes y colores ayuda a crear orden, coherencia y legibilidad.',
      ),
      question(
        'n0-q9',
        '¿Qué función cumple una llamada a la acción como “Escríbenos” o “Compra hoy”?',
        [
          'Decorar un espacio vacío.',
          'Indicar claramente el siguiente paso al público.',
          'Sustituir el nombre de la marca.',
          'Ocultar el precio del producto.',
          'Aumentar la cantidad de colores.',
        ],
        1,
        'La llamada a la acción orienta al público hacia el comportamiento esperado.',
      ),
      question(
        'n0-q10',
        'Antes de publicar el primer diseño, ¿qué revisión es más completa?',
        [
          'Comprobar solo que el archivo tenga un nombre.',
          'Revisar únicamente la fotografía principal.',
          'Agregar más elementos para ocupar todo el espacio.',
          'Verificar mensaje, legibilidad, alineación, formato y llamada a la acción.',
          'Cambiar la paleta justo antes de descargar.',
        ],
        3,
        'La revisión final debe confirmar claridad, orden visual, formato correcto y acción visible.',
      ),
    ],
  },
  'nivel-1-fundamentos-diseno': {
    title: 'Examen: Fundamentos de Diseño Gráfico',
    questions: [
      question(
        'n1-q1',
        '¿Cuál es la función principal del diseño gráfico en una pieza comercial?',
        [
          'Organizar información para comunicar un mensaje con claridad.',
          'Agregar decoración aunque no apoye el objetivo.',
          'Usar siempre la mayor cantidad de colores.',
          'Reemplazar por completo el texto.',
          'Hacer que todos los elementos tengan el mismo peso.',
        ],
        0,
        'Diseñar es organizar elementos visuales para que un mensaje sea entendido y produzca una acción.',
      ),
      question(
        'n1-q2',
        '¿Qué logra una jerarquía visual bien construida?',
        [
          'Que todos los textos parezcan igualmente importantes.',
          'Que el público sepa qué mirar primero, después y al final.',
          'Que las imágenes ocupen siempre todo el lienzo.',
          'Que no exista espacio vacío.',
          'Que todas las fuentes sean decorativas.',
        ],
        1,
        'La jerarquía establece un orden de atención y facilita comprender el mensaje.',
      ),
      question(
        'n1-q3',
        '¿Qué cambio fortalece la jerarquía de un título principal?',
        [
          'Reducirlo al mismo tamaño que los detalles.',
          'Colocarlo detrás de la fotografía.',
          'Darle mayor tamaño, peso o contraste que al texto secundario.',
          'Escribirlo con cinco tipografías.',
          'Separar cada letra con un color distinto.',
        ],
        2,
        'Tamaño, peso y contraste son recursos directos para indicar mayor importancia.',
      ),
      question(
        'n1-q4',
        '¿Cuándo una composición asimétrica puede sentirse equilibrada?',
        [
          'Cuando ambos lados tienen exactamente los mismos objetos.',
          'Cuando se elimina el elemento principal.',
          'Cuando el peso visual se compensa con tamaño, color o espacio.',
          'Cuando todo se coloca en una esquina.',
          'Cuando no existe contraste.',
        ],
        2,
        'El equilibrio asimétrico distribuye pesos distintos de forma visualmente estable.',
      ),
      question(
        'n1-q5',
        '¿Qué práctica mejora la alineación de una publicación?',
        [
          'Mover cada bloque a un eje diferente.',
          'Alinear textos y elementos usando guías comunes.',
          'Centrar obligatoriamente todos los contenidos.',
          'Cambiar el margen en cada sección.',
          'Rotar los párrafos para crear variedad.',
        ],
        1,
        'Los ejes y guías comunes conectan visualmente los bloques y crean orden.',
      ),
      question(
        'n1-q6',
        '¿Para qué sirve el espacio en blanco dentro de un diseño?',
        [
          'Para indicar que el diseño está incompleto.',
          'Para evitar que exista un punto focal.',
          'Para separar información y dar respiración visual.',
          'Para esconder información importante.',
          'Para aumentar el número de páginas.',
        ],
        2,
        'El espacio en blanco agrupa, separa y permite que los elementos importantes respiren.',
      ),
      question(
        'n1-q7',
        '¿Cuál es un ejemplo efectivo de contraste visual?',
        [
          'Texto gris claro sobre fondo blanco.',
          'Título grande y oscuro frente a detalles más pequeños y suaves.',
          'Todos los elementos con igual tamaño y color.',
          'Fotografía y fondo con el mismo tono.',
          'Botón del mismo color que su entorno.',
        ],
        1,
        'El contraste crea diferencias perceptibles que orientan la atención.',
      ),
      question(
        'n1-q8',
        '¿Qué recorte suele mejorar una fotografía de producto?',
        [
          'Uno que corta accidentalmente el producto.',
          'Uno que deja el sujeto demasiado pequeño.',
          'Uno que destaca el sujeto y reserva espacio útil para el texto.',
          'Uno que estira la imagen horizontalmente.',
          'Uno que elimina toda relación con el mensaje.',
        ],
        2,
        'Un recorte intencional destaca el sujeto y considera dónde convivirá con el contenido.',
      ),
      question(
        'n1-q9',
        '¿Cuál es un error común que reduce la coherencia visual?',
        [
          'Mantener márgenes constantes.',
          'Usar una paleta limitada.',
          'Aplicar demasiadas tipografías sin una función clara.',
          'Definir un elemento protagonista.',
          'Revisar el diseño en tamaño móvil.',
        ],
        2,
        'Demasiadas tipografías compiten entre sí y hacen que la pieza pierda unidad.',
      ),
      question(
        'n1-q10',
        'Una pieza visual limpia combina principalmente:',
        [
          'Muchos efectos, poco margen y varios puntos focales.',
          'Jerarquía, alineación, contraste, imágenes claras y espacio suficiente.',
          'Textos largos en tamaños pequeños.',
          'Colores diferentes para cada palabra.',
          'Elementos decorativos en todos los espacios.',
        ],
        1,
        'La limpieza visual surge de decisiones consistentes que favorecen claridad y lectura.',
      ),
    ],
  },
  'nivel-2-publicaciones-conectan': {
    title: 'Examen: Publicaciones que Conectan',
    questions: [
      question(
        'n2-q1',
        '¿Qué información debe conocerse antes de redactar una publicación?',
        [
          'Solo el tamaño del lienzo.',
          'El público, su necesidad y la acción que se desea provocar.',
          'La cantidad de seguidores de la competencia.',
          'El nombre de todas las fuentes disponibles.',
          'El número de elementos gratuitos.',
        ],
        1,
        'Una publicación conecta cuando parte de una audiencia concreta, una necesidad y un objetivo.',
      ),
      question(
        'n2-q2',
        '¿Cómo se elige una plantilla que realmente comunique?',
        [
          'Por tener más elementos decorativos.',
          'Por ser la primera que aparece.',
          'Por ajustarse al formato, público, mensaje y objetivo.',
          'Por incluir la mayor cantidad de fuentes.',
          'Por utilizar colores al azar.',
        ],
        2,
        'La plantilla debe apoyar la intención de la publicación, no imponer un estilo sin relación.',
      ),
      question(
        'n2-q3',
        'En un diseño con propósito, cada decisión visual debe:',
        [
          'Apoyar el objetivo y facilitar la acción esperada.',
          'Imitar exactamente a otra marca.',
          'Añadir complejidad al mensaje.',
          'Ocultar el beneficio principal.',
          'Cambiar en cada publicación.',
        ],
        0,
        'Color, imagen, tipografía y jerarquía deben trabajar a favor del mismo objetivo.',
      ),
      question(
        'n2-q4',
        'Si una marca quiere comunicar confianza, ¿qué decisión de color sería razonable?',
        [
          'Usar cualquier color sin revisar legibilidad.',
          'Aplicar un azul consistente con buen contraste.',
          'Combinar diez colores de igual intensidad.',
          'Usar texto amarillo claro sobre blanco.',
          'Cambiar de paleta en cada bloque.',
        ],
        1,
        'El azul suele apoyar percepciones de confianza, siempre que se aplique con contraste y coherencia.',
      ),
      question(
        'n2-q5',
        '¿Cuándo un elemento gráfico “suma” a la publicación?',
        [
          'Cuando ocupa el último espacio vacío.',
          'Cuando guía, separa, explica o destaca información relevante.',
          'Cuando tiene una animación llamativa.',
          'Cuando es más grande que el mensaje.',
          'Cuando aparece repetido sin intención.',
        ],
        1,
        'Un elemento útil cumple una función de lectura o comunicación.',
      ),
      question(
        'n2-q6',
        '¿Cuál es el orden más sólido para crear una publicación?',
        [
          'Decorar, descargar, definir el público y escribir el mensaje.',
          'Elegir efectos, agregar iconos y después buscar un objetivo.',
          'Definir objetivo y público, estructurar, aplicar estilo, revisar y exportar.',
          'Descargar una plantilla sin modificarla.',
          'Escribir todo el contenido con el mismo peso.',
        ],
        2,
        'La estrategia precede a la estructura y al estilo; la revisión ocurre antes de publicar.',
      ),
      question(
        'n2-q7',
        '¿Por qué conviene revisar una publicación en tamaño móvil?',
        [
          'Porque todas las publicaciones deben ser verticales.',
          'Porque permite comprobar legibilidad, jerarquía y llamada a la acción en el uso real.',
          'Porque elimina la necesidad de revisar ortografía.',
          'Porque aumenta automáticamente la resolución.',
          'Porque cambia la paleta de colores.',
        ],
        1,
        'La mayoría del público verá la pieza en una pantalla pequeña, donde pueden aparecer problemas de lectura.',
      ),
      question(
        'n2-q8',
        '¿Qué estructura ayuda a escribir el texto que acompaña una publicación?',
        [
          'Gancho, contexto o beneficio y llamada a la acción.',
          'Lista de herramientas, créditos y despedida.',
          'Título repetido cinco veces.',
          'Solo hashtags sin explicación.',
          'Un párrafo sin relación con la imagen.',
        ],
        0,
        'El gancho atrae, el contexto entrega valor y la acción indica el siguiente paso.',
      ),
      question(
        'n2-q9',
        '¿Qué revisión debe hacerse justo antes de publicar?',
        [
          'Agregar un color nuevo.',
          'Cambiar la tipografía principal.',
          'Confirmar mensaje, ortografía, contraste, formato y acción.',
          'Eliminar el espacio en blanco.',
          'Duplicar todos los elementos.',
        ],
        2,
        'La revisión final confirma tanto la calidad visual como la precisión del contenido.',
      ),
      question(
        'n2-q10',
        'Al adaptar una campaña a post, historia y portada, ¿qué debe mantenerse?',
        [
          'Exactamente la misma composición y tamaño.',
          'La identidad, el mensaje central y la jerarquía de marca.',
          'La posición absoluta de todos los elementos.',
          'Una cantidad idéntica de texto.',
          'El mismo recorte aunque no funcione.',
        ],
        1,
        'Los formatos cambian, pero la campaña debe seguir reconociéndose por su identidad y mensaje.',
      ),
    ],
  },
  'nivel-3-branding-emprendedores': {
    title: 'Examen: Branding para Emprendedores',
    questions: [
      question(
        'n3-q1',
        '¿Qué es una marca visual?',
        [
          'Únicamente el logotipo principal.',
          'Un sistema de logo, colores, tipografías, imágenes y reglas coherentes.',
          'Una plantilla distinta para cada publicación.',
          'La descripción legal de una empresa.',
          'Una colección de fotografías sin relación.',
        ],
        1,
        'La identidad visual reúne recursos y criterios que hacen reconocible a la marca.',
      ),
      question(
        'n3-q2',
        '¿Qué paso ayuda a definir la personalidad visual de una marca?',
        [
          'Elegir tres atributos que describan cómo debe percibirse.',
          'Copiar la paleta del competidor principal.',
          'Usar todos los estilos disponibles.',
          'Cambiar de personalidad según el formato.',
          'Diseñar el catálogo antes de conocer al público.',
        ],
        0,
        'Los atributos de marca orientan las decisiones de color, tipografía, imagen y tono.',
      ),
      question(
        'n3-q3',
        '¿Cómo se construye una paleta funcional y flexible?',
        [
          'Con un color diferente para cada palabra.',
          'Con un color principal, uno secundario y neutros de apoyo.',
          'Solo con colores muy saturados.',
          'Sin comprobar contraste.',
          'Cambiándola cada mes.',
        ],
        1,
        'Una jerarquía de colores permite reconocer la marca y resolver distintas necesidades.',
      ),
      question(
        'n3-q4',
        '¿Cuál es una combinación tipográfica recomendable para una marca?',
        [
          'Cinco fuentes decorativas usadas por igual.',
          'Una fuente para titulares y otra clara para lectura.',
          'Una fuente distinta para cada red social.',
          'Solo letras manuscritas en textos largos.',
          'Fuentes elegidas únicamente por moda.',
        ],
        1,
        'Dos funciones tipográficas claras suelen ofrecer personalidad y legibilidad sin perder coherencia.',
      ),
      question(
        'n3-q5',
        '¿Por qué se preparan variaciones de un logo?',
        [
          'Para cambiar la identidad en cada publicación.',
          'Para que funcione en fondos, tamaños y aplicaciones diferentes.',
          'Para agregar más colores sin reglas.',
          'Para evitar usar una versión principal.',
          'Para reemplazar las fotografías.',
        ],
        1,
        'Las variaciones mantienen el reconocimiento cuando cambia el espacio o el fondo disponible.',
      ),
      question(
        'n3-q6',
        '¿Qué característica debe tener una versión de logo para foto de perfil?',
        [
          'Muchos detalles pequeños y texto largo.',
          'Una composición simple y reconocible a tamaño reducido.',
          'Formato horizontal muy ancho.',
          'Bajo contraste con el fondo.',
          'Una fotografía diferente cada semana.',
        ],
        1,
        'En espacios pequeños se necesita una forma simple, clara y reconocible.',
      ),
      question(
        'n3-q7',
        '¿Qué define un estilo visual coherente?',
        [
          'Usar imágenes, formas y tratamientos que pertenecen a una misma dirección.',
          'Combinar todas las tendencias en una sola pieza.',
          'Cambiar los filtros en cada publicación.',
          'Aplicar el logo como fondo completo.',
          'Eliminar los colores de marca.',
        ],
        0,
        'La coherencia aparece cuando los recursos comparten intención, tono y tratamiento.',
      ),
      question(
        'n3-q8',
        '¿Qué debe incluir un kit de marca útil?',
        [
          'Solo una fotografía del fundador.',
          'Logos, colores, tipografías y recursos gráficos aprobados.',
          'Todas las plantillas disponibles en Internet.',
          'Únicamente códigos de descuento.',
          'Archivos sin nombres ni categorías.',
        ],
        1,
        'El kit centraliza los recursos aprobados para aplicarlos de manera consistente.',
      ),
      question(
        'n3-q9',
        'Al adaptar una identidad a historia, post y portada, ¿qué principio se aplica?',
        [
          'Repetir exactamente el mismo diseño sin ajustar proporciones.',
          'Mantener el sistema de marca y reorganizarlo según el formato.',
          'Cambiar el logo y la paleta en cada versión.',
          'Usar una tipografía nueva por canal.',
          'Eliminar el mensaje principal.',
        ],
        1,
        'La identidad permanece, mientras la composición responde a cada formato.',
      ),
      question(
        'n3-q10',
        '¿Qué demuestra una identidad visual básica terminada?',
        [
          'Que logo, paleta, tipografías e imágenes funcionan juntos en una pieza real.',
          'Que la marca posee muchas plantillas.',
          'Que todos los elementos tienen el mismo tamaño.',
          'Que se utiliza siempre un fondo blanco.',
          'Que el logo aparece repetido varias veces.',
        ],
        0,
        'La prueba final es aplicar el sistema completo y comprobar que comunica una misma personalidad.',
      ),
    ],
  },
  'nivel-4-mockups-presentaciones': {
    title: 'Examen: Mockups y Presentaciones Pro',
    questions: [
      question(
        'n4-q1',
        '¿Qué es un mockup?',
        [
          'Una lista de precios sin diseño.',
          'Una representación que muestra un diseño aplicado en un contexto realista.',
          'Un archivo de texto para redes sociales.',
          'Una copia de seguridad del proyecto.',
          'Una colección de tipografías.',
        ],
        1,
        'El mockup permite imaginar cómo se verá una identidad o diseño en un objeto, pantalla o situación.',
      ),
      question(
        'n4-q2',
        '¿Qué debe cuidarse al colocar una etiqueta en un mockup de producto?',
        [
          'Que ignore la perspectiva del envase.',
          'Que coincida con tamaño, perspectiva, luz y superficie.',
          'Que siempre cubra todo el objeto.',
          'Que use una paleta distinta a la marca.',
          'Que elimine todas las sombras.',
        ],
        1,
        'La integración creíble depende de respetar la geometría y la iluminación del producto.',
      ),
      question(
        'n4-q3',
        '¿Qué mockup ayuda a presentar un servicio digital?',
        [
          'Una pantalla de laptop o teléfono mostrando el resultado.',
          'Una botella sin etiqueta.',
          'Una caja vacía sin contexto.',
          'Un patrón decorativo sin información.',
          'Una paleta de colores aislada.',
        ],
        0,
        'Las pantallas permiten hacer visible una experiencia, interfaz o entrega digital.',
      ),
      question(
        'n4-q4',
        '¿Qué ajuste hace que un diseño insertado se vea natural dentro de un mockup?',
        [
          'Mantenerlo plano aunque la superficie esté inclinada.',
          'Ajustar perspectiva, escala, color y sombra.',
          'Aumentar la saturación al máximo.',
          'Eliminar el fondo del objeto.',
          'Agregar texto fuera de los límites.',
        ],
        1,
        'La perspectiva y la luz deben coincidir con el objeto o escena que recibe el diseño.',
      ),
      question(
        'n4-q5',
        '¿Cuál secuencia es adecuada para una presentación comercial?',
        [
          'Acción, portada, problema, despedida y colores.',
          'Portada, problema, solución, beneficios, prueba y acción.',
          'Catálogo, tipografías, logo y archivos.',
          'Solo una portada con todo el texto.',
          'Imágenes sin una narrativa.',
        ],
        1,
        'La secuencia conduce al público desde una necesidad hasta una propuesta y un siguiente paso.',
      ),
      question(
        'n4-q6',
        '¿Qué debe comunicar una portada profesional?',
        [
          'La promesa principal, el tema y la identidad de la marca.',
          'Todos los detalles de cada diapositiva.',
          'Únicamente la fecha de creación.',
          'Cinco llamadas a la acción.',
          'Una lista completa de herramientas.',
        ],
        0,
        'La portada presenta la propuesta y establece el tono visual de la experiencia.',
      ),
      question(
        'n4-q7',
        '¿Qué mejora la consistencia de un catálogo?',
        [
          'Diseñar cada producto con una estructura diferente.',
          'Crear una ficha base y duplicarla para cada producto.',
          'Cambiar de tipografía en cada página.',
          'Usar fotografías con escalas aleatorias.',
          'Ocultar categorías y precios.',
        ],
        1,
        'Una ficha repetible facilita comparar productos y mantiene la unidad del catálogo.',
      ),
      question(
        'n4-q8',
        '¿Qué formato es apropiado para entregar una presentación manteniendo sus páginas?',
        ['MP3', 'TXT', 'PDF', 'CSV', 'GIF'],
        2,
        'PDF conserva la secuencia y composición de las páginas para compartir o imprimir.',
      ),
      question(
        'n4-q9',
        '¿Cuándo conviene exportar una pieza como PNG?',
        [
          'Cuando se necesita una imagen digital de buena calidad o transparencia.',
          'Cuando se necesita editar una hoja de cálculo.',
          'Cuando se desea guardar audio.',
          'Cuando se necesita un documento de texto largo.',
          'Cuando se quiere comprimir una presentación en varias páginas.',
        ],
        0,
        'PNG funciona bien para piezas digitales y puede conservar transparencia.',
      ),
      question(
        'n4-q10',
        '¿Qué debe integrar el proyecto final de presentación de marca?',
        [
          'Solo el logotipo sobre un fondo.',
          'Identidad, propuesta, ejemplos visuales, mockups y llamada a la acción.',
          'Todas las plantillas sin editar.',
          'Únicamente una lista de colores.',
          'Fotografías sin explicación.',
        ],
        1,
        'La presentación final reúne el sistema de marca y demuestra su valor mediante aplicaciones concretas.',
      ),
    ],
  },
};

export const getExamByCourseId = (courseId) => {
  const exam = examCatalog[courseId];
  return exam
    ? {
        courseId,
        ...exam,
      }
    : null;
};

export const getPublicExam = (courseId) => {
  const exam = getExamByCourseId(courseId);
  if (!exam) return null;

  return {
    courseId,
    title: exam.title,
    passingScore: PASSING_SCORE,
    questionCount: exam.questions.length,
    questions: exam.questions.map(({ id, prompt, options }) => ({
      id,
      prompt,
      options,
    })),
  };
};

export const gradeExam = (courseId, answers = {}) => {
  const exam = getExamByCourseId(courseId);
  if (!exam) return null;

  const review = exam.questions.map((item) => {
    const selectedIndex = answers[item.id];
    return {
      id: item.id,
      selectedIndex,
      correctIndex: item.correctIndex,
      correct: selectedIndex === item.correctIndex,
      explanation: item.explanation,
    };
  });
  const correctAnswers = review.filter((item) => item.correct).length;
  const score = Math.round(
    (correctAnswers / exam.questions.length) * 100,
  );

  return {
    score,
    correctAnswers,
    incorrectAnswers: exam.questions.length - correctAnswers,
    passingScore: PASSING_SCORE,
    passed: score >= PASSING_SCORE,
    review,
  };
};

export const examCourseIds = Object.keys(examCatalog);
