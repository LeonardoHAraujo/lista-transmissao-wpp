import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { validateWppPayload } from './validation/validate-wpp-payload';
import { validateWppContactPayload } from './validation/validate-wpp-contact-payload';
import { sendWppMessage } from '../services/send-wpp-message.service';
import { AUTH_TOKEN } from './constants/environment';
import { badRequestErrorResponse } from '../helpers/bad-request-error-response.helper';
import { notFoundErrorResponse } from '../helpers/not-found-error-response.helper';
import { unauthorizedErrorResponse } from '../helpers/unauthorized-error-response.helper';
import { successResponse } from '../helpers/success-response.helpe';
import { sendWppContactMessage } from '../services/send-wpp-contact-message.service';

export const handler = async (event: APIGatewayProxyEventV2) => {
  console.log('BODY: ', event.body);

  if (!event.headers['x-auth-key'] || event.headers['x-auth-key'] !== AUTH_TOKEN) return unauthorizedErrorResponse();
  if (!event.body) return badRequestErrorResponse({ message: 'Request body is required.' });

  const payload = JSON.parse(event.body);

  switch (event.routeKey) {
    case 'POST /send-wpp-contact':
      const validationWppContactResult = validateWppContactPayload(payload);
      if (!validationWppContactResult.success) return badRequestErrorResponse(validationWppContactResult.errors);

      await sendWppContactMessage(validationWppContactResult.data?.whatsapp!);
      break;

    case 'POST /send-wpp-cotation':
      const validationWppResult = validateWppPayload(payload);
      if (!validationWppResult.success) return badRequestErrorResponse(validationWppResult.errors);

      await sendWppMessage(validationWppResult.data?.whatsapp!);
      break;

    default:
      return notFoundErrorResponse('Endpoint not found.');
  }

  return successResponse();
};
