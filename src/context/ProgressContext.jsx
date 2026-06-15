import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  calculateProfileStats,
  completeLesson,
  fetchUserProfile,
  submitExamAttempt,
  toggleFavoriteCourse,
} from '../services/progressService';

const ProgressContext = createContext(null);

export const ProgressProvider = ({ user, children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshProfile = useCallback(async () => {
    if (!user) return null;

    setLoading(true);
    setError('');

    try {
      const nextProfile = await fetchUserProfile(user);
      setProfile(nextProfile);
      return nextProfile;
    } catch (currentError) {
      setError(currentError.message || 'No se pudo cargar el progreso.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const nextProfile = await fetchUserProfile(user);
        if (isMounted) setProfile(nextProfile);
      } catch (currentError) {
        if (isMounted) {
          setError(currentError.message || 'No se pudo cargar el progreso.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const markLessonComplete = useCallback(async (lessonId) => {
    const nextProfile = await completeLesson(user, lessonId);
    setProfile(nextProfile);
    return nextProfile;
  }, [user]);

  const toggleFavorite = useCallback(async (courseId) => {
    const nextProfile = await toggleFavoriteCourse(user, courseId);
    setProfile(nextProfile);
    return nextProfile;
  }, [user]);

  const submitExam = useCallback(async (courseId, answers) => {
    const submission = await submitExamAttempt(user, courseId, answers);
    setProfile(submission.profile);
    return submission.result;
  }, [user]);

  const stats = useMemo(
    () =>
      calculateProfileStats(
        profile?.completedLessons ?? [],
        profile?.passedExams ?? [],
      ),
    [profile?.completedLessons, profile?.passedExams],
  );

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      stats,
      refreshProfile,
      markLessonComplete,
      submitExam,
      toggleFavorite,
    }),
    [
      profile,
      loading,
      error,
      stats,
      refreshProfile,
      markLessonComplete,
      submitExam,
      toggleFavorite,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress debe usarse dentro de ProgressProvider');
  }
  return context;
};
