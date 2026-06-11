import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext(null);

const demoUserKey = 'canva-emprende-demo-user';

const createDemoUser = (name = 'Emprendedor Demo', email = 'demo@canva.local') => ({
  uid: 'demo-user',
  displayName: name,
  name,
  email,
  isDemo: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      const storedUser = window.localStorage.getItem(demoUserKey);
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
  }, []);

  const persistDemoUser = useCallback((nextUser) => {
    window.localStorage.setItem(demoUserKey, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    if (!isFirebaseConfigured || !auth) {
      return persistDemoUser(createDemoUser(name, email));
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    setUser({ ...credential.user, displayName: name });
    return credential.user;
  }, [persistDemoUser]);

  const login = useCallback(async ({ email, password }) => {
    if (!isFirebaseConfigured || !auth) {
      return persistDemoUser(createDemoUser('Emprendedor Demo', email));
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }, [persistDemoUser]);

  const loginWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      return persistDemoUser(createDemoUser());
    }

    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  }, [persistDemoUser]);

  const loginAsDemo = useCallback(
    async () => persistDemoUser(createDemoUser()),
    [persistDemoUser],
  );

  const logout = useCallback(async () => {
    if (!isFirebaseConfigured || !auth || user?.isDemo) {
      window.localStorage.removeItem(demoUserKey);
      setUser(null);
      return;
    }

    await signOut(auth);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      register,
      login,
      loginWithGoogle,
      loginAsDemo,
      logout,
      isFirebaseConfigured,
    }),
    [
      user,
      loading,
      register,
      login,
      loginWithGoogle,
      loginAsDemo,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
