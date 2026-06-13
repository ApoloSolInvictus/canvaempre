import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CertificateScreen from './screens/CertificateScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';
import ExploreScreen from './screens/ExploreScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import HomeScreen from './screens/HomeScreen';
import LessonScreen from './screens/LessonScreen';
import LoginScreen from './screens/LoginScreen';
import MyClassesScreen from './screens/MyClassesScreen';
import ProfileScreen from './screens/ProfileScreen';
import PurchaseScreen from './screens/PurchaseScreen';
import PurchaseStatusScreen from './screens/PurchaseStatusScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const App = () => (
  <Routes>
    <Route path="/" element={<WelcomeScreen />} />
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
      <Route path="favoritos" element={<FavoritesScreen />} />
      <Route path="perfil" element={<ProfileScreen />} />
      <Route path="certificado" element={<CertificateScreen />} />
      <Route path="curso/:courseId" element={<CourseDetailScreen />} />
      <Route path="leccion/:lessonId" element={<LessonScreen />} />
    </Route>
    <Route path="*" element={<Navigate replace to="/" />} />
  </Routes>
);

export default App;
