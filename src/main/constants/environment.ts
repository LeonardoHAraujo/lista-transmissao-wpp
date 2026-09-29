const {
  SQS_ENDPOINT,
  SEND_MESSAGE_QUEUE_URL,
  Z_API_INSTANCE_ID,
  Z_API_INSTANCE_TOKEN,
  Z_API_SECURITY_TOKEN,
  Z_API_BASE_URL,
  Z_API_WEBHOOK_SECRET,
  SOURCE_GROUP_ID,
  BROADCAST_IDS,
  IGNORE_FROM_ME,
  ALLOWED_PARTICIPANT_PHONES,
} = process.env

export function parseCsv(value: string | undefined): string[] {
  if (!value) return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function shouldIgnoreFromMe(): boolean {
  return IGNORE_FROM_ME !== 'false';
}

export {
  SQS_ENDPOINT,
  SEND_MESSAGE_QUEUE_URL,
  Z_API_INSTANCE_ID,
  Z_API_INSTANCE_TOKEN,
  Z_API_SECURITY_TOKEN,
  Z_API_BASE_URL,
  Z_API_WEBHOOK_SECRET,
  SOURCE_GROUP_ID,
  BROADCAST_IDS,
  ALLOWED_PARTICIPANT_PHONES,
}
