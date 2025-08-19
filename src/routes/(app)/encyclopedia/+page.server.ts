// src/routes/(app)/encyclopedia/+page.server.ts
import type { PageServerLoad } from './$types';
import { getEncyclopediaData } from '$lib/server/apiService.server';

export const load: PageServerLoad = async () => {
  return await getEncyclopediaData();
};
