import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProgressProvider, useProgress } from '../context/ProgressContext';
import PaymentRequiredScreen from '../screens/PaymentRequiredScreen';
import BottomNavigation from './BottomNavigation';
import EmailVerificationNotice from './EmailVerificationNotice';

const AppContent = () => {
  const { profile, loading } = useProgress();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet/20 border-t-violet" />
      </div>
    );
  }

  if (profile?.accessStatus !== 'active') {
    return <PaymentRequiredScreen />;
  }

  return (
    <>
      <main className="safe-bottom min-h-screen">
        <Outlet />
      </main>
      <BottomNavigation />
    </>
  );
};

const AppLayout = () => {
  const { user, requiresEmailVerification } = useAuth();

  if (requiresEmailVerification) {
    return (
      <div className="phone-shell relative overflow-hidden">
        <EmailVerificationNotice />
      </div>
    );
  }

  return (
    <ProgressProvider user={user}>
      <div className="phone-shell relative overflow-hidden">
        <AppContent />
      </div>
    </ProgressProvider>
  );
};

export default AppLayout;
