import {
  getFirebaseAdminConfig,
  getGoogleAccessToken,
} from './google-auth.js';

const toFirestoreValue = (value) => {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (Number.isInteger(value)) return { integerValue: String(value) };
  if (typeof value === 'number') return { doubleValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }

  return {
    mapValue: {
      fields: Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          toFirestoreValue(item),
        ]),
      ),
    },
  };
};

const fromFirestoreValue = (value = {}) => {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) {
    return (value.arrayValue.values ?? []).map(fromFirestoreValue);
  }
  if ('mapValue' in value) {
    return fromFirestoreFields(value.mapValue.fields ?? {});
  }
  return undefined;
};

const fromFirestoreFields = (fields = {}) =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      fromFirestoreValue(value),
    ]),
  );

const requestFirestore = async (path, options = {}) => {
  const { projectId } = getFirebaseAdminConfig();
  const accessToken = await getGoogleAccessToken();
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    },
  );

  if (response.status === 404) return null;

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Firestore respondió ${response.status}: ${detail}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

export const getDocument = async (path) => {
  const document = await requestFirestore(`/${path}`);
  return document
    ? {
        name: document.name,
        id: document.name.split('/').pop(),
        data: fromFirestoreFields(document.fields),
      }
    : null;
};

export const setDocument = async (path, data) => {
  const segments = path.split('/');
  const documentId = segments.pop();
  const collectionPath = segments.join('/');
  const query = new URLSearchParams({ documentId });

  return requestFirestore(`/${collectionPath}?${query}`, {
    method: 'POST',
    body: JSON.stringify({
      fields: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          toFirestoreValue(value),
        ]),
      ),
    }),
  });
};

export const updateDocument = async (path, data) => {
  const query = new URLSearchParams();
  Object.keys(data).forEach((field) => {
    query.append('updateMask.fieldPaths', field);
  });

  return requestFirestore(`/${path}?${query}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          toFirestoreValue(value),
        ]),
      ),
    }),
  });
};

export const findDocumentsByStringField = async (
  collectionId,
  field,
  value,
) => {
  const result = await requestFirestore(':runQuery', {
    method: 'POST',
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId }],
        where: {
          fieldFilter: {
            field: { fieldPath: field },
            op: 'EQUAL',
            value: { stringValue: value },
          },
        },
      },
    }),
  });

  return (result ?? [])
    .filter((item) => item.document)
    .map(({ document }) => ({
      name: document.name,
      id: document.name.split('/').pop(),
      data: fromFirestoreFields(document.fields),
    }));
};
