import axios from 'axios';

import {
  BROADCAST_IDS,
  Z_API_BASE_URL,
  Z_API_INSTANCE_ID,
  Z_API_INSTANCE_TOKEN,
  Z_API_SECURITY_TOKEN,
  parseCsv,
} from '../main/constants/environment';
import { ForwardableGroupImage } from '../main/validation/evaluate-received-message';

const FORWARD_DELAY_SECONDS = 2;

export async function forwardToBroadcasts(message: ForwardableGroupImage) {
  const broadcastIds = parseCsv(BROADCAST_IDS);
  if (broadcastIds.length === 0) {
    console.error('BROADCAST_IDS is empty; skipping forward.');
    return;
  }

  const url = `${Z_API_BASE_URL}/instances/${Z_API_INSTANCE_ID}/token/${Z_API_INSTANCE_TOKEN}/send-image`;
  const headers = {
    'Client-Token': Z_API_SECURITY_TOKEN,
    'Content-Type': 'application/json',
  };

  for (const broadcastId of broadcastIds) {
    const body = {
      phone: broadcastId,
      image: message.imageUrl,
      caption: message.caption,
      delayMessage: FORWARD_DELAY_SECONDS,
    };

    try {
      console.log('Forward body: ', body);
      const response = await axios.post(url, body, { headers });
      console.log('Mensagem encaminhada:', broadcastId, response.data);
    } catch (error) {
      console.error('Erro ao encaminhar para', broadcastId, error);
    }
  }
}
