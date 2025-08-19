// src/routes/(app)/adventure/+page.server.ts
import type { PageServerLoad } from './$types';
import { getAdventureData } from '$lib/server/apiService.server';

export const load: PageServerLoad = async () => {
  return await getAdventureData();
};
