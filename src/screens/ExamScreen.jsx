import {
  Award,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Infinity as InfinityIcon,
  Lock,
  RotateCcw,
  Sparkles,
  Target,
  X,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { courses, getCourseById } from '../data/courses';
import {
  areCourseLessonsComplete,
  isCourseLocked,
} from '../services/progressService';
import { fetchCourseExam } from '../services/protectedContent';

const W_STUDIO_LOGO = '/w-studio-logo.png';

const ExamCover = ({
  course,
  locked,
  lessonsComplete,
  previousResult,
  loading,
  error,
  onBack,
  onStart,
}) => (
  <div className="relative min-h-screen overflow-hidden bg-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_18%,rgba(55,208,223,0.18),transparent_19rem),radial-gradient(circle_at_78%_56%,rgba(109,53,255,0.22),transparent_23rem)]" />
    <div className="absolute -right-28 top-[35%] h-72 w-72 rounded-full bg-violet/18" />
    <div className="absolute -left-20 top-[49%] h-52 w-80 rounded-[55%] bg-cyan-200/35" />

    <header className="relative z-20 flex items-center justify-between px-7 pt-12">
      <button
        aria-label="Volver al módulo"
        className="grid h-11 w-11 place-items-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur"
        type="button"
        onClick={onBack}
      >
        <ChevronLeft className="h-7 w-7" />
      </button>
      <span className="rounded-full bg-white/85 px-4 py-2 text-sm font-black text-violet shadow-sm backdrop-blur">
        Nivel {course.level}
      </span>
    </header>

    <section className="relative z-10 flex flex-col items-center px-8 pb-40 pt-14 text-center">
      <img
        alt="W Studio"
        className="h-14 w-24 object-contain"
        src={W_STUDIO_LOGO}
      />
      <div className="relative mt-8">
        <span className="canva-wordmark text-[4.3rem] leading-none">Canva</span>
        <Sparkles className="absolute -right-10 top-7 h-10 w-10 fill-violet text-violet" />
      </div>
      <p className="-mt-1 text-3xl font-black leading-tight text-ink">
        para Emprender
      </p>
      <div className="soft-divider mt-7 h-0.5 w-52 rounded-full" />
      <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-violet">
        Examen del módulo
      </p>
      <h1 className="mt-3 text-[2rem] font-black leading-tight text-ink">
        {course.title}
      </h1>
    </section>

    <section className="relative z-20 -mt-28 rounded-t-[3rem] bg-white px-7 pb-10 pt-0 text-center shadow-[0_-20px_60px_rgba(9,11,31,0.06)]">
      <div className="mx-auto -mt-8 grid h-16 w-16 place-items-center rounded-full border-2 border-white bg-violet/12 text-violet shadow-[0_14px_34px_rgba(109,53,255,0.16)]">
        {locked || !lessonsComplete ? (
          <Lock className="h-8 w-8" />
        ) : (
          <ClipboardCheck className="h-8 w-8" strokeWidth={2.4} />
        )}
      </div>

      <h2 className="mt-7 text-2xl font-black text-ink">
        {previousResult?.passed
          ? 'Examen aprobado'
          : locked || !lessonsComplete
            ? 'Examen bloqueado'
            : 'Demuestra lo que aprendiste'}
      </h2>
      <p className="mx-auto mt-3 max-w-[20rem] text-sm font-semibold leading-relaxed text-muted">
        {locked
          ? 'Aprueba primero el examen del nivel anterior.'
          : !lessonsComplete
            ? 'Completa las ocho clases del módulo para habilitar esta evaluación.'
            : 'Responde 10 preguntas. Necesitas 70% para aprobar y puedes intentarlo sin límites.'}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {[
          { icon: Target, value: '70%', label: 'para aprobar' },
          { icon: ClipboardCheck, value: '10', label: 'preguntas' },
          { icon: InfinityIcon, value: '∞', label: 'intentos' },
        ].map(({ icon: Icon, value, label }) => (
          <div
            className="rounded-2xl bg-gray-50 px-2 py-4"
            key={label}
          >
            <Icon className="mx-auto h-5 w-5 text-violet" />
            <p className="mt-2 text-xl font-black text-ink">{value}</p>
            <p className="mt-1 text-[11px] font-bold text-muted">{label}</p>
          </div>
        ))}
      </div>

      {previousResult && (
        <div className="mt-5 rounded-2xl bg-violet/5 p-4 text-left">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet">
            Tu mejor resultado
          </p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-3xl font-black text-ink">
              {previousResult.bestScore ?? previousResult.lastScore}%
            </p>
            <p className="text-sm font-bold text-muted">
              {previousResult.attempts ?? 1}{' '}
              {(previousResult.attempts ?? 1) === 1
                ? 'intento'
                : 'intentos'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </p>
      )}

      <PrimaryButton
        className="mt-7"
        disabled={locked || !lessonsComplete}
        loading={loading}
        onClick={onStart}
      >
        {previousResult?.passed ? (
          <RotateCcw className="h-5 w-5" />
        ) : (
          <ClipboardCheck className="h-5 w-5" />
        )}
        {previousResult?.passed ? 'Realizar nuevamente' : 'Comenzar examen'}
      </PrimaryButton>
    </section>
  </div>
);

const ExamScreen = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, submitExam } = useProgress();
  const course = getCourseById(courseId);
  const [stage, setStage] = useState('cover');
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const reviewById = useMemo(
    () =>
      Object.fromEntries(
        (result?.review ?? []).map((item) => [item.id, item]),
    ),
    [result],
  );

  if (!course) return <Navigate replace to="/app" />;

  const completedLessons = profile?.completedLessons ?? [];
  const passedExams = profile?.passedExams ?? [];
  const previousResult = profile?.examResults?.[course.id] ?? null;
  const locked = isCourseLocked(course, completedLessons, passedExams);
  const lessonsComplete = areCourseLessonsComplete(
    course,
    completedLessons,
  );
  const answeredCount = Object.keys(answers).length;
  const activeQuestion = exam?.questions[activeIndex];

  const startExam = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCourseExam(user, course.id);
      setExam(data.exam);
      setAnswers({});
      setActiveIndex(0);
      setResult(null);
      setStage('exam');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (currentError) {
      setError(currentError.message || 'No se pudo abrir el examen.');
    } finally {
      setLoading(false);
    }
  };

  const finishExam = async () => {
    if (!exam || answeredCount !== exam.questionCount) {
      setError('Responde las diez preguntas antes de finalizar.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const nextResult = await submitExam(course.id, answers);
      setResult(nextResult);
      setStage('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (currentError) {
      setError(currentError.message || 'No se pudo calificar el examen.');
    } finally {
      setLoading(false);
    }
  };

  if (stage === 'cover') {
    return (
      <ExamCover
        course={course}
        error={error}
        lessonsComplete={lessonsComplete}
        loading={loading}
        locked={locked}
        previousResult={previousResult}
        onBack={() => navigate(`/app/curso/${course.id}`)}
        onStart={startExam}
      />
    );
  }

  if (stage === 'exam' && exam && activeQuestion) {
    const allAnswered = answeredCount === exam.questionCount;

    return (
      <div className="space-y-6 px-6 pb-10 pt-12">
        <header className="flex items-center justify-between gap-4">
          <button
            aria-label="Salir del examen"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"
            type="button"
            onClick={() => setStage('cover')}
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet">
              Nivel {course.level}
            </p>
            <p className="mt-1 text-sm font-black text-ink">
              Pregunta {activeIndex + 1} de {exam.questionCount}
            </p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-violet/10 text-sm font-black text-violet">
            {answeredCount}
          </span>
        </header>

        <ProgressBar
          label={`${answeredCount} de ${exam.questionCount} respondidas`}
          value={(answeredCount / exam.questionCount) * 100}
        />

        <nav
          aria-label="Preguntas del examen"
          className="grid grid-cols-10 gap-1"
        >
          {exam.questions.map((item, index) => {
            const selected = answers[item.id] !== undefined;
            return (
              <button
                aria-label={`Ir a la pregunta ${index + 1}`}
                className={`grid aspect-square place-items-center rounded-full text-xs font-black transition ${
                  activeIndex === index
                    ? 'bg-violet text-white'
                    : selected
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-muted'
                }`}
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </nav>

        <section className="rounded-[1.6rem] border border-gray-200 bg-white p-5 shadow-[0_18px_50px_rgba(9,11,31,0.06)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet">
            Selecciona una respuesta
          </p>
          <h1 className="mt-4 text-[1.55rem] font-black leading-snug text-ink">
            {activeQuestion.prompt}
          </h1>

          <div className="mt-6 space-y-3">
            {activeQuestion.options.map((option, optionIndex) => {
              const selected = answers[activeQuestion.id] === optionIndex;
              return (
                <button
                  className={`flex min-h-16 w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    selected
                      ? 'border-violet bg-violet/5 text-ink'
                      : 'border-gray-200 bg-white text-ink'
                  }`}
                  key={option}
                  type="button"
                  onClick={() =>
                    setAnswers((current) => ({
                      ...current,
                      [activeQuestion.id]: optionIndex,
                    }))
                  }
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 text-sm font-black ${
                      selected
                        ? 'border-violet bg-violet text-white'
                        : 'border-gray-300 text-transparent'
                    }`}
                  >
                    <X className="h-5 w-5" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-bold leading-relaxed">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {error && (
          <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <PrimaryButton
            disabled={activeIndex === 0}
            variant="secondary"
            onClick={() => setActiveIndex((current) => current - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
            Anterior
          </PrimaryButton>
          {activeIndex < exam.questionCount - 1 ? (
            <PrimaryButton
              onClick={() => setActiveIndex((current) => current + 1)}
            >
              Siguiente
              <ChevronRight className="h-5 w-5" />
            </PrimaryButton>
          ) : (
            <PrimaryButton
              disabled={!allAnswered}
              loading={loading}
              onClick={finishExam}
            >
              <Check className="h-5 w-5" />
              Finalizar
            </PrimaryButton>
          )}
        </div>

        {allAnswered && activeIndex < exam.questionCount - 1 && (
          <PrimaryButton loading={loading} onClick={finishExam}>
            <Check className="h-5 w-5" />
            Finalizar y revisar
          </PrimaryButton>
        )}
      </div>
    );
  }

  if (stage === 'result' && exam && result) {
    const nextCourse = courses.find(
      (candidate) => candidate.level === course.level + 1,
    );

    return (
      <div className="space-y-6 px-6 pb-12 pt-10">
        <section
          className={`rounded-[2rem] p-6 text-center ${
            result.passed
              ? 'bg-emerald-50 text-emerald-800'
              : 'bg-red-50 text-red-700'
          }`}
        >
          <span
            className={`mx-auto grid h-20 w-20 place-items-center rounded-full text-white ${
              result.passed ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {result.passed ? (
              <Award className="h-10 w-10" />
            ) : (
              <RotateCcw className="h-10 w-10" />
            )}
          </span>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.2em]">
            Resultado final
          </p>
          <p className="mt-2 text-6xl font-black">{result.score}%</p>
          <h1 className="mt-3 text-2xl font-black">
            {result.passed ? 'Examen aprobado' : 'Sigue practicando'}
          </h1>
          <p className="mt-3 text-sm font-semibold leading-relaxed">
            {result.correctAnswers} correctas · {result.incorrectAnswers}{' '}
            incorrectas · mínimo 7 correctas para aprobar
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-emerald-200 bg-white p-4 text-center">
            <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-500" />
            <p className="mt-2 text-3xl font-black text-ink">
              {result.correctAnswers}
            </p>
            <p className="text-xs font-bold text-muted">Correctas</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-white p-4 text-center">
            <XCircle className="mx-auto h-6 w-6 text-red-500" />
            <p className="mt-2 text-3xl font-black text-ink">
              {result.incorrectAnswers}
            </p>
            <p className="text-xs font-bold text-muted">Incorrectas</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">
            Revisión de respuestas
          </h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">
            Verde indica la respuesta correcta. La selección incorrecta se
            marca en rojo.
          </p>

          <div className="mt-5 space-y-5">
            {exam.questions.map((question, questionIndex) => {
              const review = reviewById[question.id];
              return (
                <article
                  className="rounded-[1.35rem] border border-gray-200 bg-white p-5"
                  key={question.id}
                >
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-violet">
                    Pregunta {questionIndex + 1}
                  </p>
                  <h3 className="mt-3 text-lg font-black leading-snug text-ink">
                    {question.prompt}
                  </h3>
                  <div className="mt-4 space-y-2.5">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = optionIndex === review.correctIndex;
                      const isSelected = optionIndex === review.selectedIndex;
                      const isWrongSelection = isSelected && !isCorrect;
                      return (
                        <div
                          className={`flex gap-3 rounded-2xl border p-3 ${
                            isCorrect
                              ? 'border-emerald-300 bg-emerald-50'
                              : isWrongSelection
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-100 bg-gray-50'
                          }`}
                          key={option}
                        >
                          <span className="mt-0.5 shrink-0">
                            {isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : isWrongSelection ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <span className="block h-5 w-5 rounded-full border border-gray-300" />
                            )}
                          </span>
                          <span className="text-sm font-semibold leading-relaxed text-ink">
                            {option}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 rounded-2xl bg-violet/5 p-4 text-sm font-semibold leading-relaxed text-ink">
                    {review.explanation}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {result.passed ? (
          <PrimaryButton
            onClick={() =>
              navigate(
                nextCourse
                  ? `/app/curso/${nextCourse.id}`
                  : '/app/certificado',
              )
            }
          >
            {nextCourse ? 'Continuar al siguiente nivel' : 'Ver certificado'}
            <ChevronRight className="h-5 w-5" />
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={startExam}>
            <RotateCcw className="h-5 w-5" />
            Volver a intentarlo
          </PrimaryButton>
        )}

        <PrimaryButton
          variant="secondary"
          onClick={() => navigate(`/app/curso/${course.id}`)}
        >
          Volver al módulo
        </PrimaryButton>
      </div>
    );
  }

  return null;
};

export default ExamScreen;
