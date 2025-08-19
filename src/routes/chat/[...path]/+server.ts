import type { RequestHandler } from '@sveltejs/kit';

// import { PRIVATE_BACKEND_API_URL } from '$env/static/private';
import { env } from '$env/dynamic/private';
const PRIVATE_BACKEND_API_URL = env.PRIVATE_BACKEND_API_URL;

export const fallback: RequestHandler = async ({ request, params, url }) => {
  const newUrl = `${PRIVATE_BACKEND_API_URL}/chat/${params.path}${url.search}`;

  return fetch(newUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    // @ts-ignore
    duplex: 'half'
  });
};
