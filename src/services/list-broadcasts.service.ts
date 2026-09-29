import axios from 'axios';

import { BROADCAST_IDS, parseCsv } from '../main/constants/environment';
import { zApiHeaders, zApiUrl } from './z-api.client';

const PAGE_SIZE = 100;

interface BroadcastListItem {
  broadcastId?: string;
  phones?: unknown;
}

export async function listBroadcastPhones(): Promise<string[]> {
  const allowedIds = new Set(parseCsv(BROADCAST_IDS));

  console.log('allowedIds', allowedIds);

  if (allowedIds.size === 0) {
    console.error('BROADCAST_IDS is empty; skipping forward.');
    return [];
  }

  const phones = new Set<string>();
  let page = 1;

  while (true) {
    const response = await axios.get<unknown>(zApiUrl('broadcast'), {
      headers: zApiHeaders(),
      params: { page, pageSize: PAGE_SIZE },
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Broadcast list response is not an array.');
    }

    const items = response.data as BroadcastListItem[];
    for (const item of items) {
      if (!item.broadcastId || !allowedIds.has(item.broadcastId)) continue;
      if (!Array.isArray(item.phones)) continue;

      for (const phone of item.phones) {
        if (typeof phone === 'string' && phone.length > 0) phones.add(phone);
      }
    }

    if (items.length < PAGE_SIZE) break;
    page += 1;
  }

  return [...phones];
}
