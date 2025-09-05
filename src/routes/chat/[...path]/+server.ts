import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
const PRIVATE_BACKEND_API_URL = env.PRIVATE_BACKEND_API_URL;


export const fallback: RequestHandler = async ({ request, params, url, getClientAddress }) => {
  // console.log('--- SvelteKit Server Route (+server.ts) ---');
  // console.log('PRIVATE_BACKEND_API_URL:', PRIVATE_BACKEND_API_URL);

  const newUrl = `${PRIVATE_BACKEND_API_URL}/chat/${params.path}${url.search}`;
  // console.log('Forwarding request to:', newUrl);
  // console.log('-------------------------------------------');

  try {

    // ✅ 1. SvelteKit이 인식한 가장 정확한 클라이언트 IP를 가져옵니다.
    const clientAddress = getClientAddress();

    // ✅ 2. 전달할 헤더를 새로 구성합니다.
    const headers = new Headers();
    headers.set('Content-Type', request.headers.get('Content-Type') || 'application/json');
    headers.set('Authorization', request.headers.get('Authorization') || '');
    headers.set('session-id', request.headers.get('session-id') || '');
    
    // ✅ 3. 'x-forwarded-for' 헤더를 명시적으로 설정합니다.
    //    브라우저가 보낸 기존 헤더가 있다면 그것을 사용하고, 없다면 SvelteKit이 감지한 IP를 사용합니다.
    headers.set('x-forwarded-for', request.headers.get('x-forwarded-for') || clientAddress);


    const backendResponse = await fetch(newUrl, {
      method: request.method,
      headers: headers, // ✅ 새로 구성한 헤더를 사용합니다.
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    });

    // console.log('--- Backend Response Received ---');
    // console.log('Response Status:', backendResponse.status, backendResponse.statusText);
    // console.log('--------------------------------');

    if (!backendResponse.ok) {
      // 백엔드가 에러를 반환하면, 그 에러를 그대로 클라이언트로 전달
      const errorBody = await backendResponse.text();
      return new Response(errorBody, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
      });
    }

    // 1. 백엔드 응답의 body를 JSON으로 '완전히 읽어들입니다'.
    const data = await backendResponse.json();

    // ✅✅✅ 결정적인 디버깅 로그 ✅✅✅
    // 백엔드로부터 받은 JSON 데이터를 파싱한 후, 그 내용 자체를 출력합니다.
    // JSON.stringify를 사용하여 객체 내용을 문자열로 보기 좋게 만듭니다.
    // console.log('--- Parsed JSON Data from Backend ---');
    // console.log(JSON.stringify(data, null, 2)); // 2는 들여쓰기 옵션입니다.
    // console.log('------------------------------------');

    // 2. SvelteKit의 'json' 헬퍼 함수를 사용하여,
    //    읽어들인 데이터를 담은 '새롭고 안정적인' Response 객체를 생성하여 반환합니다.
    return json(data);

  } catch (error) {
    // console.error('Error in SvelteKit server route:', error);
    // 네트워크 오류 등 fetch 자체가 실패했을 때
    return json({ error: 'Backend fetch failed' }, { status: 500 });
  }
};