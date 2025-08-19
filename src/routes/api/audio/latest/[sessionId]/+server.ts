// src/routes/api/audio/latest/[sessionId]/+server.ts
// import { PRIVATE_BACKEND_API_URL } from '$env/static/private';
import { env } from '$env/dynamic/private';
const PRIVATE_BACKEND_API_URL = env.PRIVATE_BACKEND_API_URL;

import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, fetch, request }) => {
  const sessionId = params.sessionId;
  // The original call in apiService was to `${BASE_HTTP_URL}/audio/latest/${this.sessionId}`
  // where BASE_HTTP_URL is '/chat'. So the backend URL is /chat/audio/latest/{sessionId}
  const backendUrl = `${PRIVATE_BACKEND_API_URL}/chat/audio/latest/${sessionId}`;

  const authToken = request.headers.get('Authorization');
  const headers = new Headers();
  if (authToken) {
    headers.append('Authorization', authToken);
  }

  try {
    const response = await fetch(backendUrl, { headers });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorBody);
      } catch (e) {
        errorJson = { detail: errorBody || response.statusText };
      }
      return json(errorJson, { status: response.status });
    }

    const data = await response.json();
    return json(data, { status: 200 });

  } catch (error) {
    console.error(`[API Proxy Error] Failed to fetch ${backendUrl}:`, error);
    return json({ detail: 'Internal Server Error' }, { status: 500 });
  }
};
