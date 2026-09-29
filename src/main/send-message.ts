import { SQSEvent } from 'aws-lambda';

import { QueuedSend } from '../services/queued-send';
import { sendToPhone } from '../services/send-to-phone.service';

function readQueuedSend(body: string): QueuedSend {
  const value: unknown = JSON.parse(body);
  if (typeof value !== 'object' || value === null) {
    throw new Error('SQS message body is not an object.');
  }

  const record = value as Record<string, unknown>;
  if (typeof record.phone !== 'string' || record.phone.length === 0) {
    throw new Error('SQS message is missing phone.');
  }

  return {
    phone: record.phone,
    imageUrl: typeof record.imageUrl === 'string' ? record.imageUrl : '',
    caption: typeof record.caption === 'string' ? record.caption : '',
    messageId: typeof record.messageId === 'string' ? record.messageId : '',
  };
}

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    const message = readQueuedSend(record.body);
    await sendToPhone(message);
  }
};
