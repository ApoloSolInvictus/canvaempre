import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { allLessons, courses } from '../data/courses';
import { db, isFirebaseConfigured } from '../firebase/config';

let hasSynced = false;

export const seedCourseCatalog = async () => {
  if (!isFirebaseConfigured || !db || hasSynced) return;

  hasSynced = true;

  const courseWrites = courses.map((course) => {
    const { lessons, ...courseData } = course;
    return setDoc(
      doc(db, 'courses', course.id),
      {
        ...courseData,
        locked: course.level > 0,
        lessons: lessons.map((lesson) => lesson.id),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  const lessonWrites = allLessons.map((lesson) =>
    setDoc(
      doc(db, 'lessons', lesson.id),
      {
        ...lesson,
        completed: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),
  );

  await Promise.all([...courseWrites, ...lessonWrites]);
};
