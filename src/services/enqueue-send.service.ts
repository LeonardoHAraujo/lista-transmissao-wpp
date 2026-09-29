import { SendMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';

import { SEND_MESSAGE_QUEUE_URL, SQS_ENDPOINT } from '../main/constants/environment';
import { ForwardableGroupMessage } from '../main/validation/evaluate-received-message';
import { QueuedSend } from './queued-send';

const BATCH_SIZE = 10;
const MIN_DELIVERY_DELAY_SECONDS = 5;
const MAX_DELIVERY_DELAY_SECONDS = 10;

function randomDeliveryDelaySeconds(): number {
  const span = MAX_DELIVERY_DELAY_SECONDS - MIN_DELIVERY_DELAY_SECONDS + 1;
  return MIN_DELIVERY_DELAY_SECONDS + Math.floor(Math.random() * span);
}

function createSqsClient(): SQSClient {
  return new SQSClient(SQS_ENDPOINT ? { endpoint: SQS_ENDPOINT } : {});
}

export async function enqueueBroadcastSends(
  message: ForwardableGroupMessage,
  phones: string[],
): Promise<void> {
  const imageUrl = message.imageUrl.trim();
  const caption = message.caption.trim();
  if (!imageUrl && !caption) {
    console.log('Message has no image or caption; skipping enqueue.', message.messageId);
    return;
  }

  if (phones.length === 0) {
    console.log('No broadcast phones to enqueue.', message.messageId);
    return;
  }

  if (!SEND_MESSAGE_QUEUE_URL) {
    throw new Error('SEND_MESSAGE_QUEUE_URL is not configured.');
  }

  const client = createSqsClient();
  const bodies: QueuedSend[] = phones.map((phone) => ({
    phone,
    imageUrl,
    caption,
    messageId: message.messageId,
  }));

  for (let offset = 0; offset < bodies.length; offset += BATCH_SIZE) {
    const chunk = bodies.slice(offset, offset + BATCH_SIZE);
    const result = await client.send(new SendMessageBatchCommand({
      QueueUrl: SEND_MESSAGE_QUEUE_URL,
      Entries: chunk.map((body, index) => ({
        Id: String(index),
        MessageBody: JSON.stringify(body),
        DelaySeconds: randomDeliveryDelaySeconds(),
      })),
    }));

    if (result.Failed && result.Failed.length > 0) {
      const reasons = result.Failed.map((failed) => `${failed.Id}: ${failed.Message}`).join(', ');
      throw new Error(`Failed to enqueue messages: ${reasons}`);
    }
  }
}
