// src/routes/admin/+page.server.ts
import type { PageServerLoad } from './$types';
import { getAdminDashboardData } from '$lib/server/apiService.server';

export const load: PageServerLoad = async () => {
  // 이제 apiService에 데이터만 요청합니다.
  // 코드가 훨씬 간결해지고, 데이터의 출처를 신경쓰지 않아도 됩니다.
  return await getAdminDashboardData();
};
