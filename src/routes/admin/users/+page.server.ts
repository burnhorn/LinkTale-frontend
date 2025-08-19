// src/routes/admin/users/+page.server.ts
import type { PageServerLoad } from './$types';
import { getAdminUsersData } from '$lib/server/apiService.server';

export const load: PageServerLoad = async () => {
  return await getAdminUsersData();
};
