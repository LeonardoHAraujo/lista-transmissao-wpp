import {
  ALLOWED_PARTICIPANT_PHONES,
  SOURCE_GROUP_ID,
  parseCsv,
} from '../constants/environment';

export interface ForwardableGroupMessage {
  messageId: string;
  messagePhone: string;
  imageUrl: string;
  caption: string;
}

export type ReceivedMessageDecision =
  | { forward: true; message: ForwardableGroupMessage }
  | { forward: false; reason: string };

interface ReceivedImage {
  imageUrl: string;
  caption: string;
}

interface ReceivedCallbackPayload {
  type?: string;
  isGroup?: boolean;
  phone?: string;
  messageId?: string;
  participantPhone?: string | null;
  image?: ReceivedImage | null;
  text?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readImage(value: unknown): ReceivedImage | null {
  if (!isRecord(value)) return null;
  if (typeof value.imageUrl !== 'string' || value.imageUrl.length === 0) return null;

  return {
    imageUrl: value.imageUrl,
    caption: typeof value.caption === 'string' ? value.caption : '',
  };
}

function readText(value: unknown): string {
  if (!isRecord(value)) return '';
  return typeof value.message === 'string' ? value.message.trim() : '';
}

function readPayload(value: unknown): ReceivedCallbackPayload | null {
  if (!isRecord(value)) return null;

  return {
    type: typeof value.type === 'string' ? value.type : undefined,
    isGroup: typeof value.isGroup === 'boolean' ? value.isGroup : undefined,
    phone: typeof value.phone === 'string' ? value.phone : undefined,
    messageId: typeof value.messageId === 'string' ? value.messageId : undefined,
    participantPhone: typeof value.participantPhone === 'string' || value.participantPhone === null
      ? value.participantPhone
      : undefined,
    image: isRecord(value.image) ? readImage(value.image) : value.image === null ? null : undefined,
    text: readText(value.text),
  };
}

export function evaluateReceivedMessage(payload: unknown): ReceivedMessageDecision {
  const message = readPayload(payload);
  if (!message) return { forward: false, reason: 'invalid payload' };

  if (message.type && message.type !== 'ReceivedCallback') {
    return { forward: false, reason: `unsupported type ${message.type}` };
  }

  if (message.isGroup !== true) {
    return { forward: false, reason: 'not a group message' };
  }

  if (!SOURCE_GROUP_ID || message.phone !== SOURCE_GROUP_ID) {
    return { forward: false, reason: 'source group mismatch' };
  }

  if (!message.messageId) {
    return { forward: false, reason: 'missing messageId' };
  }

  const allowedParticipants = parseCsv(ALLOWED_PARTICIPANT_PHONES);
  if (allowedParticipants.length > 0) {
    const participant = message.participantPhone ?? '';
    if (!allowedParticipants.includes(participant)) {
      return { forward: false, reason: 'participant not allowed' };
    }
  }

  const imageUrl = (message.image?.imageUrl ?? '').trim();
  const caption = (imageUrl ? (message.image?.caption ?? '') : (message.text ?? '')).trim();
  if (!imageUrl && !caption) {
    return { forward: false, reason: 'missing image and text' };
  }

  return {
    forward: true,
    message: {
      messageId: message.messageId,
      messagePhone: message.phone!,
      imageUrl,
      caption,
    },
  };
}
