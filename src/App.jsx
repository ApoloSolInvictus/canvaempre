import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import WelcomeScreen from './screens/WelcomeScreen';

const AuthBoundary = lazy(() => import('./components/AuthBoundary'));
const AppLayout = lazy(() => import('./components/AppLayout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const CertificateScreen = lazy(() => import('./screens/CertificateScreen'));
const CertificateVerifyScreen = lazy(
  () => import('./screens/CertificateVerifyScreen'),
);
const CourseDetailScreen = lazy(
  () => import('./screens/CourseDetailScreen'),
);
const ExploreScreen = lazy(() => import('./screens/ExploreScreen'));
const FavoritesScreen = lazy(() => import('./screens/FavoritesScreen'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const LearningPathScreen = lazy(
  () => import('./screens/LearningPathScreen'),
);
const LegalScreen = lazy(() => import('./screens/LegalScreen'));
const LessonScreen = lazy(() => import('./screens/LessonScreen'));
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const MyClassesScreen = lazy(() => import('./screens/MyClassesScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const PurchaseScreen = lazy(() => import('./screens/PurchaseScreen'));
const PurchaseStatusScreen = lazy(
  () => import('./screens/PurchaseStatusScreen'),
);
const SupportScreen = lazy(() => import('./screens/SupportScreen'));

const RouteFallback = () => (
  <div className="phone-shell grid min-h-screen place-items-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet/20 border-t-violet" />
  </div>
);

const App = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route
        path="/privacidad"
        element={<LegalScreen documentId="privacidad" />}
      />
      <Route
        path="/terminos"
        element={<LegalScreen documentId="terminos" />}
      />
      <Route
        path="/reembolsos"
        element={<LegalScreen documentId="reembolsos" />}
      />
      <Route path="/soporte" element={<SupportScreen />} />
      <Route
        path="/verificar-certificado"
        element={<CertificateVerifyScreen />}
      />

      <Route element={<AuthBoundary />}>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/comprar" element={<PurchaseScreen />} />
        <Route
          path="/compra/aprobada"
          element={<PurchaseStatusScreen status="approved" />}
        />
        <Route
          path="/compra/pendiente"
          element={<PurchaseStatusScreen status="pending" />}
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeScreen />} />
          <Route path="explorar" element={<ExploreScreen />} />
          <Route path="mis-clases" element={<MyClassesScreen />} />
          <Route path="ruta" element={<LearningPathScreen />} />
          <Route path="favoritos" element={<FavoritesScreen />} />
          <Route path="perfil" element={<ProfileScreen />} />
          <Route path="certificado" element={<CertificateScreen />} />
          <Route path="curso/:courseId" element={<CourseDetailScreen />} />
          <Route path="leccion/:lessonId" element={<LessonScreen />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  </Suspense>
);

export default App;
