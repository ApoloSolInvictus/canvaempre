import { Cookie, Settings2, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getTrackingConsent,
  setTrackingConsent,
} from '../services/analytics';

const ConsentBanner = () => {
  const [visible, setVisible] = useState(() => !getTrackingConsent());
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const open = () => {
      const current = getTrackingConsent();
      setPreferences({
        analytics: current?.analytics ?? true,
        marketing: current?.marketing ?? true,
      });
      setShowDetails(true);
      setVisible(true);
    };
    window.addEventListener('open-cookie-preferences', open);
    return () => window.removeEventListener('open-cookie-preferences', open);
  }, []);

  if (!visible) return null;

  const save = (nextPreferences) => {
    setTrackingConsent(nextPreferences);
    setVisible(false);
    setShowDetails(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[440px] border-t border-gray-200 bg-white p-5 shadow-[0_-20px_60px_rgba(9,11,31,0.16)]">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet/10 text-violet">
          <Cookie className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-ink">
                Tu privacidad importa
              </h2>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-muted">
                Usamos medición opcional para entender ventas y mejorar el curso.
                Las cookies necesarias siempre permanecen activas.
              </p>
            </div>
            <button
              aria-label="Cerrar preferencias"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gray-100 text-muted"
              type="button"
              onClick={() => setVisible(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {showDetails && (
            <div className="mt-4 space-y-3 rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-ink">Necesarias</p>
                  <p className="text-xs font-semibold text-muted">
                    Sesión, seguridad y progreso.
                  </p>
                </div>
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              {[
                ['analytics', 'Analítica', 'Google Analytics 4'],
                ['marketing', 'Marketing', 'Meta Pixel y conversiones'],
              ].map(([key, title, description]) => (
                <label
                  className="flex cursor-pointer items-center justify-between gap-4"
                  key={key}
                >
                  <span>
                    <span className="block text-sm font-black text-ink">
                      {title}
                    </span>
                    <span className="block text-xs font-semibold text-muted">
                      {description}
                    </span>
                  </span>
                  <input
                    checked={preferences[key]}
                    className="h-5 w-5 accent-violet"
                    type="checkbox"
                    onChange={(event) =>
                      setPreferences((current) => ({
                        ...current,
                        [key]: event.target.checked,
                      }))
                    }
                  />
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              className="min-h-11 rounded-2xl border border-gray-200 px-3 text-sm font-black text-ink"
              type="button"
              onClick={() =>
                showDetails
                  ? save(preferences)
                  : setShowDetails(true)
              }
            >
              {showDetails ? 'Guardar preferencias' : 'Configurar'}
            </button>
            <button
              className="min-h-11 rounded-2xl bg-violet px-3 text-sm font-black text-white"
              type="button"
              onClick={() => save({ analytics: true, marketing: true })}
            >
              Aceptar todas
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              className="text-xs font-bold text-muted"
              type="button"
              onClick={() => save({ analytics: false, marketing: false })}
            >
              Solo necesarias
            </button>
            <Link className="text-xs font-black text-violet" to="/privacidad">
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;

