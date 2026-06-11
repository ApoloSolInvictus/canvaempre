# Canva para Emprender

Web App educativa para clases virtuales de Canva Pro orientadas a emprendedores.
Incluye ruta por niveles, autenticacion, progreso, favoritos y UI mobile-first
inspirada en Apple iOS.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- Firebase Authentication
- Firebase Firestore
- lucide-react

## Funcionalidad MVP

- Welcome, login/registro, home, detalle de curso, leccion y perfil.
- Navegacion inferior: Inicio, Explorar, Mis Clases, Favoritos y Perfil.
- Cinco niveles progresivos con 8 lecciones por nivel.
- Bloqueo de niveles superiores hasta completar el anterior.
- Progreso total, progreso por curso, clases completadas y certificados.
- Favoritos por usuario.
- Persistencia en Firestore cuando Firebase esta configurado.
- Modo demo local cuando faltan variables Firebase.

## Configuracion

1. Instala dependencias:

```bash
npm install
```

2. Copia `.env.example` a `.env` y completa tus credenciales de Firebase:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Inicia el servidor local:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

En Windows, si PowerShell bloquea `npm.ps1`, usa `npm.cmd` o ejecuta los
scripts desde `cmd`.

## Deploy en Vercel

Este proyecto queda preparado para Vercel con `vercel.json`.

Configuracion esperada:

- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: todas las rutas vuelven a `index.html`

Pasos:

1. En Vercel, importa el repo `ApoloSolInvictus/canvaempre`.
2. Agrega las variables de entorno `VITE_FIREBASE_*` en Project Settings >
   Environment Variables para Production, Preview y Development.
3. Despliega desde la rama `main`.
4. En Firebase Authentication, agrega el dominio de Vercel y tu dominio propio
   en la lista de dominios autorizados para que Google Login funcione.
5. En Vercel > Project > Settings > Domains, agrega tu dominio propio y sigue
   los registros DNS que Vercel indique.

`vercel.json` tambien agrega cache largo para assets versionados y headers
basicos de seguridad.

## Vercel vs GitHub Pages

Vercel es la mejor opcion para este MVP porque maneja muy bien apps Vite con
React Router, previews automaticos por push y dominios propios desde el panel.
GitHub Pages tambien sirve para sitios estaticos y soporta dominios propios,
pero con `BrowserRouter` suele requerir configuraciones extra para evitar 404
al abrir rutas internas directamente.

## Firestore

La app usa estas colecciones:

- `users`: progreso, favoritos y datos basicos del estudiante.
- `courses`: catalogo semilla de cursos.
- `lessons`: catalogo semilla de lecciones.

El catalogo local vive en `src/data/courses.js`. Cuando Firebase esta
configurado, la app intenta sincronizar los datos semilla de `courses` y
`lessons` al iniciar sesion.
