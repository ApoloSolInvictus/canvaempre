import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../config/site';

const PublicFooter = ({ className = '' }) => (
  <footer
    className={`border-t border-gray-100 px-5 py-7 text-center ${className}`}
  >
    <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold text-muted">
      <Link to="/privacidad">Privacidad</Link>
      <Link to="/terminos">Términos</Link>
      <Link to="/reembolsos">Reembolsos</Link>
      <Link to="/soporte">Soporte</Link>
      <button
        className="font-bold text-muted"
        type="button"
        onClick={() =>
          window.dispatchEvent(new Event('open-cookie-preferences'))
        }
      >
        Cookies
      </button>
    </nav>
    <p className="mx-auto mt-4 max-w-sm text-[11px] font-semibold leading-relaxed text-muted">
      Programa educativo independiente de {SITE_CONFIG.company}. No está
      afiliado, patrocinado ni autorizado por Canva Pty Ltd. Canva es una marca
      de sus respectivos propietarios.
    </p>
    <p className="mt-3 text-[11px] font-bold text-muted">
      © 2026 {SITE_CONFIG.company}. Todos los derechos reservados.
    </p>
  </footer>
);

export default PublicFooter;

