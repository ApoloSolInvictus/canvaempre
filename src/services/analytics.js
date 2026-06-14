const consentKey = 'canva-emprende-tracking-consent';
const attributionKey = 'canva-emprende-attribution';
const purchaseEventKey = 'canva-emprende-purchase-tracked';

const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
const metaPixelId = import.meta.env.VITE_META_PIXEL_ID?.trim();

let analyticsLoaded = false;
let marketingLoaded = false;

const readJson = (storage, key, fallback = null) => {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const appendScript = ({ id, src, inline }) => {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  if (src) script.src = src;
  if (inline) script.textContent = inline;
  document.head.appendChild(script);
};

const loadGoogleAnalytics = () => {
  if (!gaMeasurementId || analyticsLoaded) return;
  analyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
  window.gtag('js', new Date());
  window.gtag('config', gaMeasurementId, {
    send_page_view: false,
    anonymize_ip: true,
  });

  appendScript({
    id: 'google-analytics-script',
    src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      gaMeasurementId,
    )}`,
  });
};

const loadMetaPixel = () => {
  if (!metaPixelId || marketingLoaded) return;
  marketingLoaded = true;

  const fbq = function fbq() {
    fbq.callMethod
      ? fbq.callMethod.apply(fbq, arguments)
      : fbq.queue.push(arguments);
  };
  window.fbq = window.fbq || fbq;
  window._fbq = window._fbq || window.fbq;
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = '2.0';
  window.fbq.queue = [];
  window.fbq('init', metaPixelId);
  window.fbq('track', 'PageView');

  appendScript({
    id: 'meta-pixel-script',
    src: 'https://connect.facebook.net/en_US/fbevents.js',
  });
};

export const getTrackingConsent = () =>
  readJson(window.localStorage, consentKey, null);

export const setTrackingConsent = (consent) => {
  const normalized = {
    analytics: Boolean(consent.analytics),
    marketing: Boolean(consent.marketing),
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(consentKey, JSON.stringify(normalized));
  initializeTracking(normalized);
  if (normalized.analytics && gaMeasurementId) {
    window.gtag?.('event', 'page_view', {
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
    });
  }
  window.dispatchEvent(
    new CustomEvent('tracking-consent-changed', { detail: normalized }),
  );
  return normalized;
};

export const initializeTracking = (consent = getTrackingConsent()) => {
  if (consent?.analytics) loadGoogleAnalytics();
  if (consent?.marketing) loadMetaPixel();
};

export const captureAttribution = () => {
  const params = new URLSearchParams(window.location.search);
  const keys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid',
    'fbclid',
  ];
  const incoming = Object.fromEntries(
    keys
      .map((key) => [key, params.get(key)])
      .filter(([, value]) => Boolean(value)),
  );

  if (!Object.keys(incoming).length) {
    return readJson(window.localStorage, attributionKey, {});
  }

  const attribution = {
    ...incoming,
    landingPage: window.location.pathname,
    capturedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(attributionKey, JSON.stringify(attribution));
  window.sessionStorage.setItem(attributionKey, JSON.stringify(attribution));
  return attribution;
};

export const getAttribution = () =>
  readJson(window.sessionStorage, attributionKey) ??
  readJson(window.localStorage, attributionKey, {});

export const withAttribution = (url) => {
  const target = new URL(url);
  const attribution = getAttribution();

  Object.entries(attribution).forEach(([key, value]) => {
    if (key.startsWith('utm_') && value) target.searchParams.set(key, value);
  });
  if (attribution.utm_campaign) {
    target.searchParams.set('src', attribution.utm_campaign);
  }
  return target.toString();
};

export const trackEvent = (name, parameters = {}) => {
  const consent = getTrackingConsent();
  const payload = {
    ...parameters,
    ...getAttribution(),
  };

  if (consent?.analytics && gaMeasurementId) {
    loadGoogleAnalytics();
    window.gtag?.('event', name, payload);
  }

  if (consent?.marketing && metaPixelId) {
    loadMetaPixel();
    const metaEvents = {
      begin_checkout: 'InitiateCheckout',
      generate_lead: 'Lead',
      purchase: 'Purchase',
      sign_up: 'CompleteRegistration',
      view_item: 'ViewContent',
    };
    const metaEvent = metaEvents[name];
    if (metaEvent) window.fbq?.('track', metaEvent, parameters);
    else window.fbq?.('trackCustom', name, parameters);
  }
};

export const trackPageView = (path) => {
  const consent = getTrackingConsent();
  if (consent?.analytics && gaMeasurementId) {
    loadGoogleAnalytics();
    window.gtag?.('event', 'page_view', {
      page_location: window.location.href,
      page_path: path,
      page_title: document.title,
    });
  }
  if (consent?.marketing && metaPixelId) {
    loadMetaPixel();
    window.fbq?.('track', 'PageView');
  }
};

export const trackApprovedPurchase = () => {
  if (!window.sessionStorage.getItem('canva-emprende-checkout-started')) return;
  if (window.sessionStorage.getItem(purchaseEventKey)) return;

  window.sessionStorage.setItem(purchaseEventKey, 'true');
  trackEvent('purchase', {
    currency: 'USD',
    value: 55,
    content_name: 'Canva para Emprender',
    content_type: 'product',
  });
};
