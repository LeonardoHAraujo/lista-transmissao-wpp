import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { evaluateReceivedMessage } from './validation/evaluate-received-message';
import { Z_API_WEBHOOK_SECRET } from './constants/environment';
import { badRequestErrorResponse } from '../helpers/bad-request-error-response.helper';
import { notFoundErrorResponse } from '../helpers/not-found-error-response.helper';
import { unauthorizedErrorResponse } from '../helpers/unauthorized-error-response.helper';
import { internalServerErrorResponse } from '../helpers/internal-server-error-response.helper';
import { successResponse } from '../helpers/success-response.helpe';
import { enqueueBroadcastSends } from '../services/enqueue-send.service';
import { listBroadcastPhones } from '../services/list-broadcasts.service';

const RECEIVED_WEBHOOK_ROUTE = 'POST /webhooks/z-api/received/{webhookSecret}';

export const handler = async (event: APIGatewayProxyEventV2) => {
  console.log('ROUTE: ', event.routeKey);
  console.log('BODY: ', event.body);

  switch (event.routeKey) {
    case RECEIVED_WEBHOOK_ROUTE:
      return handleReceivedWebhook(event);

    default:
      return notFoundErrorResponse('Endpoint not found.');
  }
};

async function handleReceivedWebhook(event: APIGatewayProxyEventV2) {
  const webhookSecret = event.pathParameters?.webhookSecret;
  if (!Z_API_WEBHOOK_SECRET || webhookSecret !== Z_API_WEBHOOK_SECRET) {
    return unauthorizedErrorResponse();
  }

  if (!event.body) return badRequestErrorResponse({ message: 'Request body is required.' });

  let payload: unknown;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return badRequestErrorResponse({ message: 'Invalid JSON body.' });
  }

  const decision = evaluateReceivedMessage(payload);
  if (!decision.forward) {
    console.log('Webhook ignored:', decision.reason);
    return successResponse('Accepted.');
  }

  try {
    const phones = await listBroadcastPhones();
    await enqueueBroadcastSends(decision.message, phones);
  } catch (error) {
    console.error('Falha ao enfileirar envios:', error);
    return internalServerErrorResponse('Failed to enqueue messages.');
  }

  return successResponse('Accepted.');
}
