import axios from 'axios';

import { QueuedSend } from './queued-send';
import { FORWARD_DELAY_SECONDS, zApiHeaders, zApiUrl } from './z-api.client';

export async function sendToPhone(message: QueuedSend): Promise<void> {
  const imageUrl = message.imageUrl.trim();
  const caption = message.caption.trim();

  if (!imageUrl && !caption) {
    console.log('Skipping empty message for', message.phone);
    return;
  }

  const headers = zApiHeaders();

  if (imageUrl) {
    const url = zApiUrl('send-image');
    const body: { phone: string; image: string; caption?: string; delayMessage: number } = {
      phone: message.phone,
      image: imageUrl,
      delayMessage: FORWARD_DELAY_SECONDS,
    };
    if (caption) body.caption = caption;

    const response = await axios.post(url, body, { headers });
    console.log('Imagem encaminhada:', message.phone, response.data);
    return;
  }

  const response = await axios.post(zApiUrl('send-text'), {
    phone: message.phone,
    message: caption,
    delayMessage: FORWARD_DELAY_SECONDS,
  }, { headers });
  console.log('Texto encaminhado:', message.phone, response.data);
}
