// src/routes/(app)/bookshelf/+page.server.ts
import type { PageServerLoad } from './$types';
import { getBookshelfData } from '$lib/server/apiService.server';

export const load: PageServerLoad = async () => {
  return await getBookshelfData();
};
