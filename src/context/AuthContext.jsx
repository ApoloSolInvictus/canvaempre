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
  reload,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { trackEvent } from '../services/analytics';

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
  const [authRevision, setAuthRevision] = useState(0);

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
    await firebaseSendEmailVerification(credential.user, {
      url: `${window.location.origin}/login?verified=1`,
    });
    setUser(credential.user);
    setAuthRevision((current) => current + 1);
    trackEvent('sign_up', { method: 'password' });
    return credential.user;
  }, [persistDemoUser]);

  const login = useCallback(async ({ email, password }) => {
    if (!isFirebaseConfigured || !auth) {
      return persistDemoUser(createDemoUser('Emprendedor Demo', email));
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    trackEvent('login', { method: 'password' });
    return credential.user;
  }, [persistDemoUser]);

  const loginWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      return persistDemoUser(createDemoUser());
    }

    const credential = await signInWithPopup(auth, googleProvider);
    trackEvent('login', { method: 'google' });
    return credential.user;
  }, [persistDemoUser]);

  const requestPasswordReset = useCallback(async (email) => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`,
    });
    trackEvent('password_reset_requested');
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    if (!isFirebaseConfigured || !auth?.currentUser) return;

    await firebaseSendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/login?verified=1`,
    });
    trackEvent('verification_email_sent');
  }, []);

  const refreshUser = useCallback(async () => {
    if (!isFirebaseConfigured || !auth?.currentUser) return user;

    await reload(auth.currentUser);
    setUser(auth.currentUser);
    setAuthRevision((current) => current + 1);
    return auth.currentUser;
  }, [user]);

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
      requestPasswordReset,
      sendVerificationEmail,
      refreshUser,
      loginAsDemo,
      logout,
      isFirebaseConfigured,
      requiresEmailVerification:
        Boolean(user) && !user?.isDemo && user?.emailVerified === false,
      authRevision,
    }),
    [
      user,
      loading,
      register,
      login,
      loginWithGoogle,
      requestPasswordReset,
      sendVerificationEmail,
      refreshUser,
      loginAsDemo,
      logout,
      authRevision,
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
