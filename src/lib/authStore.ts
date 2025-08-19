// src/lib/authStore.ts
import { writable } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';

// SvelteKit을 사용하지 않으므로, 브라우저 환경인지 직접 확인합니다.
const isBrowser = typeof window !== 'undefined';

// --- 스토어가 관리할 데이터의 형태(Interface)를 확장합니다. ---
interface UserProfile {
  username: string;
  // 토큰에 다른 정보가 있다면 여기에 추가할 수 있습니다. 예: exp (만료 시간)
  exp: number; 
}

// 스토어가 관리할 데이터의 형태를 정의합니다 (TypeScript)
export interface AuthState {
  token: string | null;
  user: UserProfile | null;
}

function createAuthStore() {
  const initialToken = isBrowser ? sessionStorage.getItem('user_token') : null;
  
  // 토큰이 존재하면, 초기 사용자 정보도 함께 설정합니다.
  let initialUser: UserProfile | null = null;
  if (initialToken) {
    try {
      // JWT의 'sub' 클레임이 username입니다.
      const decoded = jwtDecode<{ sub: string; exp: number }>(initialToken);
      initialUser = { username: decoded.sub, exp: decoded.exp };
    } catch (error) {
      console.error("저장된 토큰을 디코딩하는데 실패했습니다:", error);
      // 토큰이 유효하지 않으면 초기값을 null로 유지합니다.
    }
  }

  const { subscribe, set } = writable<AuthState>({ 
    token: initialToken, 
    user: initialUser // 스토어의 초기값에 사용자 정보를 추가합니다.
  });

  return {
    subscribe,
    
    login: (token: string) => {
      try {
        const decoded = jwtDecode<{ sub: string; exp: number }>(token);
        const user: UserProfile = { username: decoded.sub, exp: decoded.exp };

        // 로그인 시 토큰과 사용자 정보를 '함께' 저장합니다.
        set({ token, user });
        if (isBrowser) {
          sessionStorage.setItem('user_token', token);
        }
      } catch (error) {
        console.error("새로운 토큰을 디코딩하는데 실패했습니다:", error);
        // 디코딩 실패 시 안전하게 로그아웃 상태로 처리합니다.
        set({ token: null, user: null });
        if (isBrowser) {
          sessionStorage.removeItem('user_token');
          sessionStorage.removeItem('chatSessionId');
        }
      }
    },

    logout: () => {
      console.log("AuthStore: Logging out and clearing session data.");
      // 로그아웃 시 토큰과 사용자 정보를 '함께' 비웁니다.
      set({ token: null, user: null });
      if (isBrowser) {
        sessionStorage.removeItem('user_token');
        sessionStorage.removeItem('chatSessionId');
        
        // 페이지를 새로고침하여 상태를 초기화합니다.
        window.location.reload();
      }
    }
  };
}

export const auth = createAuthStore();