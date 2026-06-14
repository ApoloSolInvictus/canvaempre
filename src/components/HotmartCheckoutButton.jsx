import { useEffect, useRef } from 'react';
import { CreditCard, LoaderCircle } from 'lucide-react';
import { HOTMART_ASSETS, HOTMART_LINKS } from '../config/hotmart';
import { cn } from '../lib/cn';
import { trackEvent, withAttribution } from '../services/analytics';

const widgetScriptId = 'hotmart-checkout-widget';
const widgetStylesId = 'hotmart-checkout-styles';

const loadHotmartWidget = () => {
  if (!document.getElementById(widgetStylesId)) {
    const link = document.createElement('link');
    link.id = widgetStylesId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = HOTMART_ASSETS.widgetStyles;
    document.head.appendChild(link);
  }

  if (document.getElementById(widgetScriptId)) return;

  const script = document.createElement('script');
  script.id = widgetScriptId;
  script.src = HOTMART_ASSETS.widgetScript;
  script.async = true;
  document.head.appendChild(script);
};

const HotmartCheckoutButton = ({ className = '' }) => {
  const checkoutLinkRef = useRef(null);

  useEffect(() => {
    checkoutLinkRef.current?.setAttribute('onclick', 'return false;');
    loadHotmartWidget();
  }, []);

  return (
    <a
      className={cn(
        'hotmart-fb hotmart__button-checkout block w-full no-underline',
        className,
      )}
      href={withAttribution(HOTMART_LINKS.checkoutWidget)}
      ref={checkoutLinkRef}
      onClick={() => {
        window.sessionStorage.setItem(
          'canva-emprende-checkout-started',
          new Date().toISOString(),
        );
        trackEvent('begin_checkout', {
          currency: 'USD',
          value: 55,
          content_name: 'Canva para Emprender',
          content_type: 'product',
        });
      }}
    >
      <span className="flex min-h-[62px] w-full items-center justify-center gap-3 rounded-[1.35rem] bg-[linear-gradient(90deg,#5B3DF4_0%,#7B2DFF_100%)] px-5 py-4 text-lg font-bold text-white shadow-soft transition active:scale-[0.99]">
        <CreditCard className="h-5 w-5" />
        Comprar acceso completo
      </span>
    </a>
  );
};

export const HotmartCheckoutFallback = () => (
  <a
    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[1.2rem] border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-ink no-underline shadow-sm"
    href={withAttribution(HOTMART_LINKS.checkout)}
    onClick={() =>
      trackEvent('begin_checkout', {
        currency: 'USD',
        value: 55,
        content_name: 'Canva para Emprender',
        content_type: 'product',
        checkout_mode: 'fallback',
      })
    }
    rel="noreferrer"
    target="_blank"
  >
    <LoaderCircle className="h-4 w-4 text-violet" />
    Abrir pago en una ventana nueva
  </a>
);

export default HotmartCheckoutButton;
