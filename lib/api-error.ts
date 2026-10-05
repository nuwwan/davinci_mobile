import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

type AnyError = FetchBaseQueryError | SerializedError | undefined;

/** True when the request never reached the server (offline, DNS, timeout). */
export function isNetworkError(error: AnyError) {
  return !!error && 'status' in error && (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR');
}

export function httpStatus(error: AnyError): number | undefined {
  return error && 'status' in error && typeof error.status === 'number' ? error.status : undefined;
}

/** Short developer-facing description (render only in __DEV__). */
export function describeError(error: AnyError) {
  if (!error) return '';
  if ('status' in error) return `${error.status}: ${JSON.stringify('data' in error ? error.data : '')}`;
  return error.message ?? 'Unknown error';
}
