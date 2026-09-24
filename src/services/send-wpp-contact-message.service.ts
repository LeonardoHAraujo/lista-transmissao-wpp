import axios from 'axios';

import { IWhatsapp } from './interfaces/payload.interface';
import { formatContactMessage } from '../helpers/wpp-message.helper';
import { Z_API_BASE_URL, Z_API_INSTANCE_ID, Z_API_INSTANCE_TOKEN, Z_API_SECURITY_TOKEN } from '../main/constants/environment';

export async function sendWppContactMessage(data: Partial<IWhatsapp>) {
  console.log('Payload: ', data);

  const { name, phoneNumber } = data;
  const url = `${Z_API_BASE_URL}/instances/${Z_API_INSTANCE_ID}/token/${Z_API_INSTANCE_TOKEN}/send-text`;
  const headers = {
    'Client-Token': Z_API_SECURITY_TOKEN,
    'Content-Type': 'application/json'
  };

  const body = {
    phone: phoneNumber,
    message: formatContactMessage(name!),
  };

  try {
    console.log('Body: ', body);
    const response = await axios.post(url, body, { headers });
    console.log('Mensagem enviada com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
}
