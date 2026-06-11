const lessonDurations = ['10 min', '15 min', '15 min', '15 min', '15 min', '20 min', '15 min', '15 min'];

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

const lessonGuides = {
  'Qué es Canva y para qué sirve': {
    summary:
      'Canva es una herramienta visual para crear piezas gráficas sin empezar desde cero. En esta clase entenderás para qué sirve, cuándo usar plantillas y cómo pensar cada diseño como una herramienta para vender, informar o conectar con tu audiencia.',
    keyIdeas: ['Identificar qué problemas resuelve Canva', 'Reconocer tipos de piezas útiles para un negocio', 'Elegir un objetivo antes de diseñar'],
    steps: ['Abre Canva y revisa las categorías principales.', 'Elige una pieza que tu emprendimiento necesita esta semana.', 'Escribe el objetivo de esa pieza antes de tocar colores o textos.'],
    practice:
      'Haz una lista de 3 piezas que tu negocio necesita: una publicación informativa, una promoción y una pieza de confianza.',
    assignment:
      'Define cuál será tu primera publicación y guarda una nota con su objetivo: vender, educar, anunciar o inspirar.',
  },
  'Crear una cuenta y configurar perfil': {
    summary:
      'Una cuenta bien configurada te permite trabajar más rápido, guardar diseños y mantener tus archivos ordenados. Aquí prepararás tu espacio de Canva como si fuera tu pequeño estudio de diseño.',
    keyIdeas: ['Crear una cuenta con datos correctos', 'Configurar nombre, idioma y uso principal', 'Organizar carpetas desde el inicio'],
    steps: ['Crea o entra a tu cuenta de Canva.', 'Revisa el perfil, idioma y preferencias principales.', 'Crea una carpeta para tu marca y otra para prácticas del curso.'],
    practice:
      'Crea una carpeta llamada Marca y otra llamada Curso Canva para Emprender.',
    assignment:
      'Sube tu logo si ya lo tienes. Si no, sube una imagen de referencia que represente el estilo de tu negocio.',
  },
  'Conocer el panel principal': {
    summary:
      'El panel principal es el centro de mando. Aprenderás dónde encontrar tus diseños, plantillas, carpetas y herramientas para no perder tiempo buscando opciones.',
    keyIdeas: ['Ubicar diseños recientes y carpetas', 'Encontrar plantillas por formato', 'Usar la búsqueda con intención'],
    steps: ['Explora la página inicial de Canva.', 'Busca una plantilla de Instagram, flyer o presentación.', 'Guarda una plantilla como favorita para usarla después.'],
    practice:
      'Busca tres plantillas distintas para tu rubro y compara cuál se lee mejor.',
    assignment:
      'Guarda una plantilla que podrías adaptar para tu negocio esta semana.',
  },
  'Diferencia entre plantillas, diseños y elementos': {
    summary:
      'Canva mezcla plantillas, diseños y elementos, pero cada uno cumple un papel distinto. Entender esa diferencia evita diseños recargados y te ayuda a editar con criterio.',
    keyIdeas: ['Una plantilla es un punto de partida', 'Un diseño es tu pieza final editada', 'Los elementos son recursos visuales de apoyo'],
    steps: ['Abre una plantilla y duplica la página.', 'Cambia solo textos y colores primero.', 'Agrega un elemento únicamente si mejora el mensaje.'],
    practice:
      'Toma una plantilla y elimina todo lo que no aporte al mensaje principal.',
    assignment:
      'Crea una versión limpia de una plantilla y guarda una copia antes/después.',
  },
  'Cómo guardar, descargar y compartir': {
    summary:
      'Una pieza no termina hasta que se exporta correctamente. Aprenderás cuándo descargar en PNG, JPG o PDF y cómo compartir un enlace sin perder control del archivo.',
    keyIdeas: ['Elegir formato según el uso', 'Compartir enlaces con permisos correctos', 'Guardar versiones ordenadas'],
    steps: ['Revisa el botón Compartir en Canva.', 'Descarga una pieza en PNG para redes.', 'Crea una copia con nombre y fecha antes de hacer cambios grandes.'],
    practice:
      'Exporta el mismo diseño en PNG y PDF para notar la diferencia.',
    assignment:
      'Crea una carpeta de entregables finales y guarda ahí tu primera exportación.',
  },
  'Primer diseño simple paso a paso': {
    summary:
      'Crearás una publicación básica con mensaje, imagen, color y llamado a la acción. El objetivo no es decorar: es comunicar con orden.',
    keyIdeas: ['Definir mensaje principal', 'Usar una sola idea por pieza', 'Cerrar con una acción clara'],
    steps: ['Elige formato cuadrado para Instagram.', 'Escribe un título corto y un subtítulo de apoyo.', 'Agrega un botón o frase de acción como Escríbenos o Compra hoy.'],
    practice:
      'Diseña una publicación anunciando un producto, servicio o beneficio.',
    assignment:
      'Exporta la pieza y revísala en tamaño pequeño para comprobar si se entiende.',
  },
  'Buenas prácticas para principiantes': {
    summary:
      'Los errores de principiante suelen venir de usar demasiados colores, fuentes o elementos. Aprenderás reglas simples para que tus diseños se vean más profesionales desde el inicio.',
    keyIdeas: ['Usar menos elementos y más intención', 'Mantener márgenes y alineación', 'Revisar legibilidad antes de publicar'],
    steps: ['Limita tu diseño a 2 tipografías.', 'Usa máximo 3 colores principales.', 'Alinea textos y elementos con guías visuales.'],
    practice:
      'Toma tu primer diseño y simplifícalo quitando 3 elementos innecesarios.',
    assignment:
      'Guarda una versión final llamada Publicación básica final.',
  },
  'Mini proyecto: publicación básica': {
    summary:
      'Cerrarás el nivel creando una publicación básica lista para redes. La pieza debe tener objetivo, mensaje, composición limpia y exportación final.',
    keyIdeas: ['Unir lo aprendido en una pieza real', 'Aplicar orden visual', 'Preparar el archivo para publicar'],
    steps: ['Elige una plantilla o lienzo en blanco.', 'Adapta texto, imagen, color y llamado a la acción.', 'Exporta y revisa la pieza final.'],
    practice:
      'Crea una publicación para presentar tu negocio o promocionar un producto.',
    assignment:
      'Publica o guarda tu pieza final y anota qué mejorarías en la próxima versión.',
  },
  'Qué es el diseño gráfico': {
    summary:
      'El diseño gráfico organiza información visual para comunicar mejor. En un emprendimiento, no se trata solo de verse bonito, sino de hacer que el mensaje sea claro, recordable y confiable.',
    keyIdeas: ['Diseñar es ordenar información', 'Cada pieza debe tener intención', 'La claridad vale más que la decoración'],
    steps: ['Observa una pieza de tu marca o competencia.', 'Identifica mensaje, público y acción esperada.', 'Anota qué ayuda y qué distrae.'],
    practice:
      'Analiza una publicación que te guste y escribe por qué funciona.',
    assignment:
      'Define 3 palabras que quieres que tu marca comunique visualmente.',
  },
  'Jerarquía visual': {
    summary:
      'La jerarquía visual decide qué mira primero una persona. Aprenderás a usar tamaño, peso, color y posición para guiar la lectura de tus publicaciones.',
    keyIdeas: ['El título debe dominar la pieza', 'La información secundaria acompaña', 'El llamado a la acción debe ser visible'],
    steps: ['Elige el texto más importante.', 'Hazlo más grande o más fuerte que el resto.', 'Reduce lo secundario para crear contraste.'],
    practice:
      'Reordena una plantilla para que se lea primero el beneficio principal.',
    assignment:
      'Crea una pieza con título, beneficio y acción claramente separados.',
  },
  'Composición y equilibrio': {
    summary:
      'Una buena composición reparte el peso visual para que la pieza no se sienta cargada o vacía. Aprenderás a ubicar textos, imágenes y espacios con balance.',
    keyIdeas: ['Distribuir peso visual', 'Evitar saturar una sola zona', 'Usar espacio vacío como parte del diseño'],
    steps: ['Divide el lienzo en zonas simples.', 'Coloca el elemento principal en una zona dominante.', 'Equilibra con texto, imagen o espacio vacío.'],
    practice:
      'Mueve los elementos de una publicación hasta que se sienta estable.',
    assignment:
      'Guarda dos versiones de la misma pieza y compara cuál respira mejor.',
  },
  'Espaciado y alineación': {
    summary:
      'El espaciado hace que un diseño se vea profesional. La alineación ayuda a que el ojo lea sin esfuerzo. Son detalles pequeños que cambian completamente la percepción de calidad.',
    keyIdeas: ['Los márgenes protegen el diseño', 'Alinear genera orden', 'Separar grupos mejora lectura'],
    steps: ['Activa guías o usa líneas imaginarias.', 'Alinea textos a un mismo eje.', 'Aumenta espacio entre bloques que hablan de cosas distintas.'],
    practice:
      'Toma una pieza recargada y mejora solo márgenes, alineación y espacios.',
    assignment:
      'Crea una plantilla base con márgenes seguros para futuras publicaciones.',
  },
  'Contraste visual': {
    summary:
      'El contraste ayuda a destacar lo importante. Puede venir del color, tamaño, peso tipográfico, forma o espacio. Sin contraste, todo compite y nada se entiende.',
    keyIdeas: ['Contrastar para destacar', 'No abusar de colores fuertes', 'Crear foco visual claro'],
    steps: ['Elige un elemento protagonista.', 'Dale mayor tamaño, color o peso.', 'Reduce la intensidad de elementos secundarios.'],
    practice:
      'Diseña una promoción donde el descuento sea el foco principal.',
    assignment:
      'Revisa tu pieza en blanco y negro para comprobar si todavía tiene jerarquía.',
  },
  'Uso correcto de imágenes': {
    summary:
      'Las imágenes deben apoyar el mensaje, no rellenar espacio. Aprenderás a elegir fotos, recortar, aplicar filtros suaves y mantener coherencia visual.',
    keyIdeas: ['Elegir imágenes relacionadas con el mensaje', 'Cuidar calidad y recorte', 'Mantener estilo visual consistente'],
    steps: ['Elige una imagen clara y sin exceso de ruido.', 'Recorta para destacar el sujeto.', 'Ajusta brillo o transparencia si el texto va encima.'],
    practice:
      'Crea una publicación con una imagen de fondo y texto legible encima.',
    assignment:
      'Haz una mini biblioteca de 5 imágenes que representen tu marca.',
  },
  'Errores comunes de diseño': {
    summary:
      'Muchos diseños fallan por exceso: demasiadas fuentes, textos largos, colores sin relación o elementos decorativos sin función. Aprenderás a detectar y corregir esos errores.',
    keyIdeas: ['Simplificar antes de decorar', 'Priorizar legibilidad', 'Revisar coherencia visual'],
    steps: ['Busca elementos que no aportan.', 'Reduce textos largos a frases claras.', 'Unifica colores y tipografías.'],
    practice:
      'Corrige una pieza antigua de tu marca aplicando estas reglas.',
    assignment:
      'Crea una lista personal de errores que debes revisar antes de publicar.',
  },
  'Mini proyecto: pieza visual limpia': {
    summary:
      'Crearás una pieza visual limpia usando jerarquía, contraste, composición y alineación. El resultado debe sentirse ordenado y fácil de leer.',
    keyIdeas: ['Aplicar fundamentos en una pieza real', 'Diseñar con menos ruido visual', 'Preparar un archivo final publicable'],
    steps: ['Define mensaje y acción.', 'Diseña con márgenes, jerarquía y contraste.', 'Exporta y compara con tu versión inicial.'],
    practice:
      'Crea una publicación educativa para explicar un beneficio de tu producto o servicio.',
    assignment:
      'Guarda tu pieza final y úsala como referencia visual para próximos diseños.',
  },
  Introducción: {
    summary:
      'En este nivel aprenderás a crear publicaciones que conectan con personas reales. La meta es que cada pieza tenga intención, mensaje y una razón clara para existir.',
    keyIdeas: ['Diseñar para una audiencia específica', 'Conectar antes de vender', 'Usar cada publicación con un objetivo'],
    steps: ['Define a quién le hablas.', 'Elige una necesidad o deseo de esa persona.', 'Convierte esa idea en un mensaje corto.'],
    practice:
      'Escribe tres ideas de publicaciones: una educativa, una promocional y una inspiradora.',
    assignment:
      'Elige una idea para convertirla en publicación durante el módulo.',
  },
  'Plantillas que comunican': {
    summary:
      'No todas las plantillas sirven para todos los mensajes. Aprenderás a elegir una plantilla por estructura, lectura y emoción, no solo porque se ve bonita.',
    keyIdeas: ['Elegir plantillas según objetivo', 'Adaptar antes de publicar', 'Quitar elementos que distraen'],
    steps: ['Busca plantillas para el formato que necesitas.', 'Elige una con buena jerarquía.', 'Cambia colores, textos e imágenes para tu marca.'],
    practice:
      'Compara tres plantillas y selecciona la que mejor comunica una promoción.',
    assignment:
      'Guarda una plantilla base para publicaciones educativas y otra para ventas.',
  },
  'Diseño con propósito': {
    summary:
      'Un diseño con propósito responde tres preguntas: qué quiero decir, a quién se lo digo y qué quiero que haga después. Esta claridad mejora el resultado de cualquier publicación.',
    keyIdeas: ['Definir objetivo antes del diseño', 'Alinear texto e imagen al mensaje', 'Cerrar con una acción concreta'],
    steps: ['Escribe el objetivo de la publicación.', 'Reduce el mensaje a una frase principal.', 'Añade una llamada a la acción visible.'],
    practice:
      'Crea una publicación con un beneficio claro y una acción final.',
    assignment:
      'Revisa si tu pieza se entiende en 3 segundos y ajusta lo necesario.',
  },
  'Colores que conectan': {
    summary:
      'El color influye en la emoción y la percepción de una marca. Aprenderás a usar una paleta simple para transmitir confianza, energía, calma o exclusividad.',
    keyIdeas: ['Elegir colores por emoción', 'Mantener contraste para lectura', 'Usar una paleta limitada'],
    steps: ['Selecciona un color principal y uno de apoyo.', 'Comprueba que el texto sea legible.', 'Aplica el color fuerte solo donde quieras atención.'],
    practice:
      'Crea dos versiones de la misma publicación con emociones distintas.',
    assignment:
      'Define una paleta de 3 colores para usar en tus próximas piezas.',
  },
  'Elementos que suman': {
    summary:
      'Íconos, formas, líneas y stickers pueden mejorar un diseño si tienen función. Aprenderás a usarlos para guiar la mirada, separar información y reforzar el mensaje.',
    keyIdeas: ['Usar elementos con intención', 'No decorar por decorar', 'Mantener coherencia de estilo'],
    steps: ['Agrega un elemento para destacar una idea.', 'Usa una forma para separar texto importante.', 'Elimina cualquier elemento que no ayude a leer.'],
    practice:
      'Mejora una publicación usando solo dos elementos visuales funcionales.',
    assignment:
      'Crea una mini colección de íconos coherentes para tu marca.',
  },
  'Crea tu publicación paso a paso': {
    summary:
      'Ahora construirás una publicación completa: objetivo, mensaje, estructura, colores, elementos y exportación. El proceso será ordenado para que puedas repetirlo cada semana.',
    keyIdeas: ['Seguir un flujo de diseño claro', 'Crear una pieza lista para redes', 'Revisar antes de exportar'],
    steps: ['Define objetivo, público y mensaje.', 'Elige plantilla o lienzo y arma la estructura.', 'Ajusta colores, tipografías, elementos y descarga.'],
    practice:
      'Diseña una publicación final para anunciar un producto, servicio o contenido educativo.',
    assignment:
      'Exporta la pieza y guárdala como Publicación final nivel 2.',
  },
  'Revisión y mejores prácticas': {
    summary:
      'Antes de publicar, conviene revisar legibilidad, ortografía, jerarquía y coherencia visual. Esta clase te enseña una rutina rápida de control de calidad.',
    keyIdeas: ['Revisar en tamaño pequeño', 'Corregir texto y alineación', 'Confirmar que el mensaje sea claro'],
    steps: ['Mira tu diseño alejado o en tamaño móvil.', 'Lee el texto en voz alta para detectar errores.', 'Comprueba que el llamado a la acción se vea.'],
    practice:
      'Haz una revisión completa de tu publicación del nivel.',
    assignment:
      'Crea una checklist personal para revisar todas tus piezas antes de publicar.',
  },
  'Comparte y publica': {
    summary:
      'Publicar también es parte del diseño. Aprenderás a preparar el archivo, escribir un copy breve y compartir la pieza en el canal correcto.',
    keyIdeas: ['Exportar con formato correcto', 'Acompañar la imagen con un texto claro', 'Medir qué funciona para mejorar'],
    steps: ['Descarga la pieza en PNG.', 'Escribe un copy con gancho, contexto y acción.', 'Publica o programa la pieza en tu red principal.'],
    practice:
      'Redacta el texto que acompañará tu publicación.',
    assignment:
      'Publica la pieza o déjala programada y anota qué métrica revisarás.',
  },
  'Qué es una marca visual': {
    summary:
      'Una marca visual es el conjunto de colores, tipografías, formas, imágenes y decisiones que hacen reconocible tu negocio. No es solo un logo: es coherencia repetida.',
    keyIdeas: ['Entender la identidad visual como sistema', 'Definir personalidad de marca', 'Crear consistencia en cada pieza'],
    steps: ['Escribe cómo quieres que se perciba tu marca.', 'Elige tres atributos visuales.', 'Busca referencias que representen esos atributos.'],
    practice:
      'Crea un tablero simple con 5 referencias visuales para tu marca.',
    assignment:
      'Define tres palabras guía para tu identidad visual.',
  },
  'Paleta de colores': {
    summary:
      'Tu paleta ayuda a que las piezas se reconozcan como parte de la misma marca. Aprenderás a elegir colores principales, secundarios y neutros.',
    keyIdeas: ['Elegir un color protagonista', 'Agregar colores de apoyo', 'Usar neutros para respirar'],
    steps: ['Selecciona un color principal.', 'Agrega un color secundario y dos neutros.', 'Prueba la paleta en una publicación simple.'],
    practice:
      'Crea tres combinaciones de color y elige la más coherente con tu negocio.',
    assignment:
      'Guarda tu paleta en Canva o en una nota de marca.',
  },
  'Tipografías de marca': {
    summary:
      'La tipografía comunica personalidad. Una fuente puede sentirse elegante, cercana, moderna o divertida. Aprenderás a combinar fuentes sin perder legibilidad.',
    keyIdeas: ['Elegir una fuente para títulos', 'Elegir una fuente para textos', 'Mantener pocas tipografías'],
    steps: ['Busca una fuente para titulares.', 'Combínala con una fuente simple para lectura.', 'Prueba pesos y tamaños antes de sumar otra fuente.'],
    practice:
      'Diseña un mini cartel usando solo dos tipografías.',
    assignment:
      'Define las fuentes oficiales de tu marca para títulos y textos.',
  },
  'Logo y variaciones': {
    summary:
      'Un logo necesita versiones para distintos usos: horizontal, vertical, con fondo claro, con fondo oscuro o solo isotipo. Aprenderás a pensar tu logo como un sistema flexible.',
    keyIdeas: ['Crear variaciones útiles', 'Probar legibilidad en tamaños pequeños', 'Guardar archivos ordenados'],
    steps: ['Revisa si tu logo funciona en claro y oscuro.', 'Crea una versión simple para foto de perfil.', 'Guarda cada variación con nombre claro.'],
    practice:
      'Crea una versión principal y una versión reducida de tu logo.',
    assignment:
      'Exporta tus variaciones en PNG con fondo transparente si tu plan lo permite.',
  },
  'Estilo visual': {
    summary:
      'El estilo visual define cómo se ven tus piezas: minimalista, cálido, premium, divertido, editorial o tecnológico. Aprenderás a mantener una dirección consistente.',
    keyIdeas: ['Definir estilo antes de diseñar', 'Usar imágenes y elementos coherentes', 'Evitar mezclar estilos opuestos'],
    steps: ['Elige una dirección visual para tu marca.', 'Selecciona imágenes que encajen con esa dirección.', 'Elimina recursos que no pertenezcan al estilo.'],
    practice:
      'Crea una publicación usando solo recursos alineados al estilo elegido.',
    assignment:
      'Guarda una página de referencias para usarla como guía visual.',
  },
  'Kit de marca en Canva': {
    summary:
      'El kit de marca centraliza colores, tipografías, logos y recursos. Te ayuda a diseñar más rápido y mantener consistencia en cada publicación.',
    keyIdeas: ['Centralizar recursos de marca', 'Ahorrar tiempo al diseñar', 'Evitar variaciones accidentales'],
    steps: ['Sube logo y colores de marca.', 'Define tipografías principales.', 'Prueba el kit aplicándolo en una plantilla.'],
    practice:
      'Configura o simula tu kit de marca dentro de Canva.',
    assignment:
      'Crea una plantilla base usando tu paleta, fuentes y logo.',
  },
  'Aplicaciones prácticas': {
    summary:
      'Una identidad visual debe funcionar en publicaciones, historias, flyers, portadas y presentaciones. Aprenderás a adaptar la misma marca a distintos formatos.',
    keyIdeas: ['Adaptar sin perder identidad', 'Mantener elementos repetibles', 'Cuidar proporciones en cada formato'],
    steps: ['Elige una pieza base de tu marca.', 'Adáptala a historia, post y portada.', 'Revisa que todas se sientan parte de la misma familia.'],
    practice:
      'Crea tres formatos con el mismo mensaje y estilo visual.',
    assignment:
      'Guarda tus formatos como plantillas reutilizables.',
  },
  'Mini proyecto: identidad visual básica': {
    summary:
      'Crearás una identidad visual básica con paleta, tipografías, logo o marca textual y una aplicación práctica. El objetivo es que tu negocio tenga una guía visual inicial.',
    keyIdeas: ['Unir decisiones de marca', 'Crear coherencia visual', 'Preparar una base reutilizable'],
    steps: ['Define paleta y tipografías.', 'Crea una marca textual o logo simple.', 'Aplica todo en una publicación final.'],
    practice:
      'Diseña una mini guía visual de una página para tu emprendimiento.',
    assignment:
      'Exporta tu guía y úsala como referencia para futuras piezas.',
  },
  'Qué es un mockup': {
    summary:
      'Un mockup muestra cómo se vería tu diseño en un producto, pantalla, empaque o material real. Ayuda a presentar mejor una idea antes de producirla o venderla.',
    keyIdeas: ['Mostrar diseños en contexto', 'Aumentar percepción profesional', 'Elegir mockups coherentes con el producto'],
    steps: ['Busca un mockup relacionado con tu negocio.', 'Inserta tu diseño dentro del mockup.', 'Ajusta tamaño y perspectiva para que se vea natural.'],
    practice:
      'Crea un mockup simple con una publicación o portada de tu marca.',
    assignment:
      'Guarda un mockup para usarlo en tu presentación final.',
  },
  'Mockups para productos': {
    summary:
      'Los productos se venden mejor cuando el cliente puede imaginar el resultado. Aprenderás a usar mockups para empaques, etiquetas, camisetas, tazas o materiales impresos.',
    keyIdeas: ['Elegir mockup según producto', 'Mantener proporciones realistas', 'Usar fondo limpio para destacar'],
    steps: ['Selecciona un mockup de producto.', 'Coloca tu etiqueta, logo o diseño.', 'Ajusta color y sombra para integrarlo.'],
    practice:
      'Presenta un producto de tu negocio usando un mockup.',
    assignment:
      'Exporta una imagen promocional con mockup para redes.',
  },
  'Mockups para servicios': {
    summary:
      'Los servicios también pueden visualizarse. Puedes usar pantallas, documentos, agendas, presentaciones o escenas de trabajo para mostrar valor de forma concreta.',
    keyIdeas: ['Convertir servicios en evidencia visual', 'Mostrar resultados o procesos', 'Usar mockups digitales'],
    steps: ['Define qué entrega o resultado tiene tu servicio.', 'Elige un mockup de pantalla, documento o presentación.', 'Inserta una vista que explique el beneficio.'],
    practice:
      'Crea un mockup que represente un servicio que ofreces.',
    assignment:
      'Prepara una imagen para explicar tu servicio en una publicación.',
  },
  'Presentaciones comerciales': {
    summary:
      'Una presentación comercial debe guiar una conversación: problema, solución, beneficios, prueba y acción. Aprenderás a estructurar slides claros y persuasivos.',
    keyIdeas: ['Ordenar la historia comercial', 'Usar una idea por slide', 'Cerrar con una propuesta clara'],
    steps: ['Crea una portada con promesa principal.', 'Agrega slides de problema, solución y beneficios.', 'Cierra con contacto o siguiente paso.'],
    practice:
      'Diseña una presentación de 5 slides para tu producto o servicio.',
    assignment:
      'Exporta tu presentación en PDF y revisa si se entiende sin explicarla.',
  },
  'Portadas profesionales': {
    summary:
      'La portada define la primera impresión. Aprenderás a crear portadas para propuestas, catálogos o presentaciones con buena jerarquía y estilo de marca.',
    keyIdeas: ['Crear una primera impresión fuerte', 'Usar título, subtítulo y marca', 'Evitar saturar la portada'],
    steps: ['Define el título principal.', 'Agrega subtítulo, fecha o cliente si aplica.', 'Incluye logo y un recurso visual de apoyo.'],
    practice:
      'Crea una portada para una propuesta comercial de tu negocio.',
    assignment:
      'Guarda la portada como plantilla para futuras presentaciones.',
  },
  'Diseño de catálogos': {
    summary:
      'Un catálogo debe permitir comparar productos o servicios con facilidad. Aprenderás a organizar imágenes, precios, descripciones y llamados a la acción.',
    keyIdeas: ['Ordenar productos por categorías', 'Mantener fichas consistentes', 'Facilitar compra o contacto'],
    steps: ['Define categorías o secciones.', 'Crea una ficha base de producto.', 'Duplica la ficha para mantener consistencia.'],
    practice:
      'Diseña una página de catálogo con 3 productos o paquetes.',
    assignment:
      'Exporta una página de catálogo lista para compartir por WhatsApp o PDF.',
  },
  'Exportación final': {
    summary:
      'El formato final depende del uso: redes, impresión, PDF, presentación o envío por mensajería. Aprenderás a revisar calidad, tamaño y nombre de archivo.',
    keyIdeas: ['Elegir formato correcto', 'Revisar calidad antes de enviar', 'Nombrar archivos profesionalmente'],
    steps: ['Revisa ortografía y enlaces.', 'Elige PNG, JPG o PDF según el destino.', 'Guarda el archivo con nombre claro y fecha.'],
    practice:
      'Exporta tu presentación o catálogo en PDF y una imagen para redes.',
    assignment:
      'Organiza tus archivos finales en una carpeta de entregables.',
  },
  'Proyecto final: presentación de marca': {
    summary:
      'Cerrarás el curso creando una presentación de marca con identidad visual, mockups y propuesta clara. Será una pieza lista para mostrar a clientes o aliados.',
    keyIdeas: ['Unir marca, diseño y presentación', 'Mostrar el valor del negocio', 'Crear un entregable profesional'],
    steps: ['Arma portada, presentación de marca y oferta.', 'Incluye mockups o ejemplos visuales.', 'Exporta en PDF y revisa la experiencia completa.'],
    practice:
      'Construye una presentación final de 5 a 7 slides para tu emprendimiento.',
    assignment:
      'Comparte tu presentación con una persona de confianza y anota mejoras.',
  },
};

const buildFallbackGuide = (course, title, index) => ({
  summary: `En esta clase trabajarás ${title.toLowerCase()} dentro del contexto de ${course.title}. La idea es convertir el concepto en una acción práctica para que puedas aplicarlo en piezas reales de tu emprendimiento.`,
  keyIdeas: [
    `Comprender ${title.toLowerCase()} con enfoque práctico.`,
    'Aplicar el concepto en una pieza visual real.',
    index === course.lessons.length - 1
      ? 'Cerrar el módulo con un entregable listo para compartir.'
      : 'Guardar un avance para continuar en la siguiente clase.',
  ],
  steps: [
    'Lee el objetivo y define cómo se relaciona con tu negocio.',
    'Aplica el concepto en Canva con una pieza sencilla.',
    'Revisa claridad, orden visual y coherencia antes de guardar.',
  ],
  practice: 'Realiza una mini práctica de 10 minutos usando una pieza de tu propia marca.',
  assignment: 'Guarda tu avance con nombre claro para retomarlo en la próxima clase.',
});

export const courses = courseBlueprints.map((course) => {
  const lessons = course.lessons.map((title, lessonIndex) => {
    const guide = lessonGuides[title] ?? buildFallbackGuide(course, title, lessonIndex);

    return {
      id: `${course.id}-leccion-${lessonIndex + 1}`,
      courseId: course.id,
      moduleTitle: `Nivel ${course.level}: ${course.title}`,
      title,
      duration: lessonDurations[lessonIndex] ?? '15 min',
      objective:
        lessonIndex === 0
          ? course.objective
          : `Practicar ${title.toLowerCase()} con criterio visual y enfoque comercial.`,
      content: guide.summary,
      summary: guide.summary,
      goals: guide.keyIdeas,
      keyIdeas: guide.keyIdeas,
      steps: guide.steps,
      practice: guide.practice,
      assignment: guide.assignment,
      completed: false,
    };
  });

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

export const getLessonNavigation = (lessonId) => {
  const course = getCourseForLesson(lessonId);
  if (!course) return { previousLesson: null, nextLesson: null, lessonNumber: 0 };

  const index = course.lessons.findIndex((lesson) => lesson.id === lessonId);

  return {
    previousLesson: index > 0 ? course.lessons[index - 1] : null,
    nextLesson: index >= 0 && index < course.lessons.length - 1 ? course.lessons[index + 1] : null,
    lessonNumber: index + 1,
  };
};
