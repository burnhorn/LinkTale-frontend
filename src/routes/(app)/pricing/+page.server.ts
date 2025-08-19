// src/routes/(app)/pricing/+page.server.ts
import type { PageServerLoad } from './$types';
import { getPricingData } from '$lib/server/apiService.server';

export const load: PageServerLoad = async () => {
  return await getPricingData();
};
