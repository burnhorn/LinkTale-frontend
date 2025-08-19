// src/routes/admin/revenue/+page.server.ts
import type { PageServerLoad } from './$types';
import { getAdminRevenueData } from '$lib/server/apiService.server';

export const load: PageServerLoad = async () => {
  return await getAdminRevenueData();
};
