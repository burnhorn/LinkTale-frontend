// src/lib/server/apiService.server.ts
// import { PRIVATE_BACKEND_API_URL, PRIVATE_USE_MOCK_DATA } from '$env/static/private';
import { env } from '$env/dynamic/private';
import * as mock from '$lib/mockData';

const PRIVATE_BACKEND_API_URL = env.PRIVATE_BACKEND_API_URL;
const PRIVATE_USE_MOCK_DATA = env.PRIVATE_USE_MOCK_DATA;

const useMock = PRIVATE_USE_MOCK_DATA === 'true';

const API_BASE = '/api/v1'; // API 기본 경로와 버전을 변수로 관리

async function fetchData<T>(mockData: T, apiPath: string): Promise<T> {
  if (useMock) {
    // console.log(`[Mock] Fetching data for: ${apiPath}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockData;
  } else {
    // console.log(`[API] Fetching data from: ${apiPath}`);
    const response = await fetch(`${PRIVATE_BACKEND_API_URL}${apiPath}`);
    if (!response.ok) {
      const errorBody = await response.text();
      // console.error(`API Error: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch from ${apiPath}`);
    }
    return response.json();
  }
}

// Admin - Dashboard
export const getAdminDashboardData = () => fetchData({
    kpiData: mock.kpiData,
    mainFunnelData: mock.mainFunnelData,
    hourlyActiveUsersData: mock.hourlyActiveUsersData,
}, `${API_BASE}/admin/dashboard`);

// Admin - Users
export const getAdminUsersData = () => fetchData({
    users: mock.users,
    retentionData: mock.retentionData,
    userActionsData: mock.userActionsData,
}, `${API_BASE}/admin/users`);

// Admin - Content
export const getAdminContentData = () => fetchData({
    contentKpis: mock.contentKpis,
    wordCloudData: mock.wordCloudData,
    aiAgentPreferenceData: mock.aiAgentPreferenceData,
    popularPlazaPostsData: mock.popularPlazaPostsData,
    relatedStories: mock.mockBooks,
}, `${API_BASE}/admin/content`);

// Admin - Revenue
export const getAdminRevenueData = () => fetchData({
    revenueData: mock.revenueData,
}, `${API_BASE}/admin/revenue`);

// App - Bookshelf
export const getBookshelfData = () => fetchData({
    books: mock.bookshelfBooks,
}, `${API_BASE}/app/bookshelf`);

// App - Pricing
export const getPricingData = () => fetchData({
    plans: mock.plans,
    faqs: mock.faqs,
}, `${API_BASE}/app/pricing`);

// App - Adventure
export const getAdventureData = () => fetchData({
    books: mock.adventureBooks,
}, `${API_BASE}/app/adventure`);

// App - Encyclopedia
export const getEncyclopediaData = () => fetchData({
    items: mock.encyclopediaItems,
}, `${API_BASE}/app/encyclopedia`);
