import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProgressProvider } from '../context/ProgressContext';
import BottomNavigation from './BottomNavigation';

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <ProgressProvider user={user}>
      <div className="phone-shell relative overflow-hidden">
        <main className="safe-bottom min-h-screen">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </ProgressProvider>
  );
};

export default AppLayout;
