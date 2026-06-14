import { createHash, timingSafeEqual } from 'node:crypto';

export const ACTIVE_EVENTS = new Set([
  'PURCHASE_APPROVED',
  'PURCHASE_COMPLETE',
  'PURCHASE_COMPLETED',
]);

export const REVOKED_EVENTS = new Set([
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
  'PURCHASE_CANCELED',
  'PURCHASE_CANCELLED',
  'PURCHASE_EXPIRED',
]);

export const normalizeEmail = (email = '') => email.trim().toLowerCase();

export const hashValue = (value) =>
  createHash('sha256').update(value).digest('hex');

const readHeader = (headers, name) => {
  const value = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
};

export const validateHotmartToken = (request, payload) => {
  const expected = process.env.HOTMART_HOTTOK ?? '';
  const received =
    readHeader(request.headers, 'x-hotmart-hottok') ??
    payload?.hottok ??
    '';

  if (!expected || !received) return false;

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(received));
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
};

export const parseHotmartPayload = (payload) => {
  const data = payload?.data ?? payload ?? {};
  const purchase = data.purchase ?? {};
  const buyer = data.buyer ?? purchase.buyer ?? {};
  const product = data.product ?? purchase.product ?? {};
  const offer = purchase.offer ?? data.offer ?? {};
  const rawEvent = String(
    payload?.event ??
      payload?.eventType ??
      payload?.status ??
      data.event ??
      data.status ??
      purchase.status ??
      '',
  ).toUpperCase();
  const eventAliases = {
    APPROVED: 'PURCHASE_APPROVED',
    COMPLETE: 'PURCHASE_COMPLETE',
    COMPLETED: 'PURCHASE_COMPLETED',
    REFUNDED: 'PURCHASE_REFUNDED',
    CHARGEBACK: 'PURCHASE_CHARGEBACK',
    CANCELED: 'PURCHASE_CANCELED',
    CANCELLED: 'PURCHASE_CANCELLED',
    EXPIRED: 'PURCHASE_EXPIRED',
  };
  const event = eventAliases[rawEvent] ?? rawEvent;
  const email = normalizeEmail(
    buyer.email ??
      data.buyer_email ??
      payload?.buyer_email ??
      payload?.email ??
      '',
  );
  const transaction = String(
    purchase.transaction ??
      data.transaction ??
      payload?.transaction ??
      payload?.transaction_id ??
      '',
  );
  const eventTimestamp = Number(
    payload?.creation_date ??
      data.creation_date ??
      purchase.approved_date ??
      purchase.date ??
      Date.now(),
  );

  return {
    event,
    email,
    buyerName: buyer.name ?? '',
    transaction,
    eventId: String(
      payload?.id ??
        hashValue(
          [event, transaction, email, eventTimestamp].join('|'),
        ),
    ),
    eventTimestamp: Number.isFinite(eventTimestamp)
      ? eventTimestamp
      : Date.now(),
    productId: String(product.id ?? ''),
    productName: product.name ?? '',
    offerCode: String(offer.code ?? ''),
    rawVersion: payload?.version ?? '',
  };
};

export const isExpectedProduct = ({ productId, offerCode }) => {
  const expectedProductId = process.env.HOTMART_PRODUCT_ID;
  const expectedOfferCode = process.env.HOTMART_OFFER_CODE;

  if (expectedProductId && productId !== expectedProductId) return false;
  if (expectedOfferCode && offerCode !== expectedOfferCode) return false;
  return true;
};
