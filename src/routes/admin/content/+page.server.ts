// src/routes/admin/content/+page.server.ts
import type { PageServerLoad } from './$types';
import { getAdminContentData } from '$lib/server/apiService.server';

export const load: PageServerLoad = async () => {
  return await getAdminContentData();
};
