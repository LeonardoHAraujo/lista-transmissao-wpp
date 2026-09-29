import {
  Z_API_BASE_URL,
  Z_API_INSTANCE_ID,
  Z_API_INSTANCE_TOKEN,
  Z_API_SECURITY_TOKEN,
} from '../main/constants/environment';

export const FORWARD_DELAY_SECONDS = 2;

export function zApiUrl(action: string): string {
  return `${Z_API_BASE_URL}/instances/${Z_API_INSTANCE_ID}/token/${Z_API_INSTANCE_TOKEN}/${action}`;
}

export function zApiHeaders(): Record<string, string> {
  return {
    'Client-Token': Z_API_SECURITY_TOKEN ?? '',
    'Content-Type': 'application/json',
  };
}
