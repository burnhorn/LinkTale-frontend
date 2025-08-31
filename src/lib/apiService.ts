// src/lib/apiService.ts
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

import {
	chatMessages,
	storyPages,
	currentStoryTitle,
	isLoading as globalIsLoading,
	isAudioLoading,
	audioStore,
	isReady,
  storyScenes
} from '$lib/stores';
import type { LogEntry, Scene, ChatHistoryResponse } from '$lib/types';
import { get } from 'svelte/store';
import { auth } from '$lib/authStore';


const	PUBLIC_CHAT_API_BASE_URL = env.PUBLIC_CHAT_API_BASE_URL;
const	PUBLIC_EXPORT_API_BASE_URL = env.PUBLIC_EXPORT_API_BASE_URL;
const	PUBLIC_TOKEN_API_BASE_URL = env.PUBLIC_TOKEN_API_BASE_URL;
const	PUBLIC_WS_BASE_URL = env.PUBLIC_WS_BASE_URL;
const	PUBLIC_SCENES_API_BASE_URL = env.PUBLIC_SCENES_API_BASE_URL;

// 💡 백엔드 주소 확인 및 session_id를 동적으로 추가하도록 변경 
// HTTP URL은 슬래시(/)로 시작하는 경로만 남깁니다.
const BASE_HTTP_URL = PUBLIC_CHAT_API_BASE_URL;
const BASE_HTTP_URL_export = PUBLIC_EXPORT_API_BASE_URL;

// WebSocket URL은 더 이상 최상위 레벨에서 정의하지 않습니다.
let BASE_WS_URL: string;

// WebSocket URL을 동적으로 생성합니다.
if (browser) {
    BASE_WS_URL = PUBLIC_WS_BASE_URL; // 개발/프로덕션 모두 환경변수 기반
}

// --- 기존 WebSocket 및 인증 관련 코드 (변경 없음) ---

class WebSocketService {
    private socket: WebSocket | null = null;
    private sessionId: string | null = null; 
    private isConnecting: boolean = false;

    constructor() {
      // 생성자는 비어있습니다.
    }

    public async start() {
        if (!browser) return; // 💡 SSR 환경에서는 아무것도 하지 않습니다.

        if (get(isReady) || this.isConnecting) {
            console.log("Start cancelled: already ready or connection in progress.");
            return;
        }
        
        this.isConnecting = true;
        isReady.set(false);
        globalIsLoading.set(true);

        const sessionToRestore = sessionStorage.getItem('chatSessionId');

        try {
            const newSessionId = await this._connectAndGetSession();
            this.sessionId = newSessionId;
            sessionStorage.setItem('chatSessionId', this.sessionId);

            if (sessionToRestore) {
                await this.fetchHistory();
            } else {
                this.showWelcomeMessageIfNeeded();
            }
            isReady.set(true);
        } catch (error) {
            console.error("Failed to start chat service:", error);
            isReady.set(false);
        } finally {
            globalIsLoading.set(false);
            this.isConnecting = false;
        }
    }

    private _connectAndGetSession(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!browser) return reject(new Error("WebSocket can only be used in the browser."));

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                if (this.sessionId) return resolve(this.sessionId);
            }
            
            const token = sessionStorage.getItem('user_token');
            const existingSessionId = sessionStorage.getItem('chatSessionId');
            
            let url = BASE_WS_URL;
            const params = new URLSearchParams();
            if (token) params.append('token', token);
            if (existingSessionId) params.append('session_id', existingSessionId);
            
            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;
            
            this.socket = new WebSocket(url);

            const timeoutId = setTimeout(() => {
                if (this.socket) {
                    this.socket.onmessage = null;
                    this.socket.onerror = null;
                }
                reject(new Error("Session creation timed out."));
            }, 10000);

            const cleanup = () => {
                clearTimeout(timeoutId);
            };
            
            this.socket.onmessage = (event: MessageEvent) => {
                try {
                    const parsed = JSON.parse(event.data);
                    if (parsed && parsed.event === 'session_created' && parsed.session_id) {
                        cleanup();
                        console.log(`Received session ID: ${parsed.session_id}`);
                        if (this.socket) {
                            this.socket.onmessage = this.handleMainMessages;
                        }
                        resolve(parsed.session_id);
                    }
                } catch (e) {
                    console.error("Error parsing initial WebSocket message:", e);
                }
            };

            this.socket.onopen = () => console.log('WebSocket: Connection established, waiting for session ID...');
            this.socket.onerror = (err) => {
                cleanup();
                reject(new Error(`WebSocket connection failed. Event: ${err.type}`));
            };
            this.socket.onclose = (event) => {
                cleanup();
                if (!event.wasClean) {
                    reject(new Error(`WebSocket closed unexpectedly. Code: ${event.code}`));
                }
           };
        });
    }

    private handleMainMessages = (event: MessageEvent) => {
        const parsed = JSON.parse(event.data);
        if (parsed.event === 'session_created') return;
        this.handleStreamMessage(parsed);
    }

    private handleStreamMessage(parsed: any) {
        switch (parsed.event) {
        case 'token':
          chatMessages.updateLastAiMessage(parsed.data, parsed.node_name);
          break;
        // ✅ 1. 'image_generated' 이벤트 처리 (이미지 메시지 '생성')
        // 백엔드가 이미지를 성공적으로 만들었다는 신호입니다.
        // 이 시점의 메시지는 아직 '임시 출입증' 상태일 수 있습니다.
        case 'image_generated': { // case 블록 내에서 변수 선언을 위해 중괄호 사용
          const { image_url, image_caption, scene_id } = parsed.data;
          
          // chatMessages 스토어에 새로운 AI 이미지 메시지를 '추가'합니다.
          // 이 메시지는 나중에 'scenes_updated' 이벤트로 ID가 업데이트 될 것입니다.
          chatMessages.addAiImageMessage(image_url, image_caption || '', scene_id);
          break;
        }

        // ✅ 2. 'scenes_updated' 이벤트 처리 (장면 목록 '업데이트' 및 ID '확정')
        // 백엔드가 대화 기록을 데이터베이스에 성공적으로 저장(장면 확정)했다는 신호입니다.
        case 'scenes_updated': {
          const { scenes } = parsed.data; // 백엔드로부터 받은 장면 목록 전체
          
          // storyScenes 스토어를 최신 상태로 업데이트합니다.
          // 책장(Bookshelf)이나 스토리 리더(StoryReader)가 이 데이터를 사용합니다.
          storyScenes.initializeScenes(scenes);

          // chatMessages 스토어와 동기화하여 '임시 출입증'을 '주민등록번호'로 교체합니다.
          // 이 함수는 stores.ts에 새로 만들어야 합니다.
          chatMessages.syncWithScenes(scenes);
          break;
        }
        case 'audio_generated':
          // console.log('Received audio_generated event:', parsed); // 전체 데이터 확인용 로그
          const audioUrl = parsed.data.audio_url;
          if (audioUrl) {
              audioStore.setAudio(audioUrl);
              chatMessages.addSystemMessage("오디오 드라마 생성이 완료되었어요! 🎧 하단의 플레이어로 감상해보세요.");
          }
          isAudioLoading.set(false);
          break;
        case 'page_created':
          const pageData = parsed.data;
          storyPages.addPage(
            pageData.type,
            pageData.content,
            undefined,
            pageData.imageCaption
          );
          break;
        case 'image_edit_complete': {
          const { scene_id, new_image_url } = parsed.data;
          
          // 1. Scene 목록 상태 업데이트 요청
          storyScenes.updateSceneImage(scene_id, new_image_url);
          
          // 2. 채팅 메시지 상태 업데이트 요청
          chatMessages.updateMessageImage(scene_id, new_image_url);
          
          break;
        }
        case 'error':
          chatMessages.setErrorOnLastAiMessage(parsed.data);
          break;
        case 'end_of_turn':
          globalIsLoading.set(false);
          chatMessages.finishLastAiMessage();
          break;
        default:
          break;
      }
    }
    
    private async fetchHistory() {
      if (!this.sessionId || !browser) return;
      globalIsLoading.set(true);
      try {
          const token = sessionStorage.getItem('user_token');
          const headers: HeadersInit = {};
          if (token) headers['Authorization'] = `Bearer ${token}`;
          
          const response = await fetch(`${BASE_HTTP_URL}/history/${this.sessionId}`, { headers });
          if (!response.ok) throw new Error(`Failed to fetch history: ${response.statusText}`);
          
          // 1. API 응답을 새로운 ChatHistoryResponse 타입으로 받습니다.
          const responseData: ChatHistoryResponse = await response.json();
          // console.log(responseData)
          // 2. 응답 데이터가 유효한지 확인합니다.
          if (responseData && (responseData.logs?.length || responseData.scenes?.length)) {
        
              // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
              //      'responseData' 객체 전체를 스토어 함수에 전달합니다.
              // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
              chatMessages.initializeFromHistory(responseData);
              storyScenes.initializeScenes(responseData.scenes || []); // storyScenes는 scenes 배열만 받음
              
              // -----------------------------------------------------------
              //    오디오 확인 로직은 initializeFromHistory 내부에서 처리하거나,
              //    여기서 responseData.logs를 사용하여 수행할 수 있습니다.
              const hasAudio = responseData.logs?.some(log => log.message_type === 'audio');
              if (hasAudio) {
                  this.fetchLatestAudio();
              }

          } else {
              // 로그와 장면이 모두 없을 때만 새로운 세션으로 간주하고 환영 메시지를 보냅니다.
              const hasWelcomed = sessionStorage.getItem('hasWelcomed');
              if (!hasWelcomed) {
                  chatMessages.addSystemMessage("안녕하세요, 꼬마 창작자님! 오늘은 어떤 멋진 이야기를 만들어 볼까요? 제게 이야기를 들려달라고 하거나 재미있는 그림을 그려달라고 해보세요! 🎨✨");
                  sessionStorage.setItem('hasWelcomed', 'true');
              }
          }
      } catch (error) {
          console.error("Fetch history error:", error); // 디버깅을 위해 콘솔 에러 추가
          chatMessages.addSystemMessage("이전 대화 기록을 불러오는 데 실패했습니다.");
      } finally {
          globalIsLoading.set(false);
      }
    }

    private showWelcomeMessageIfNeeded() {
        if (!browser) return;
        const hasWelcomed = sessionStorage.getItem('hasBeenWelcomed');
        if (!hasWelcomed) {
            chatMessages.addSystemMessage("안녕하세요, 꼬마 창작자님! 오늘은 어떤 멋진 이야기를 만들어 볼까요? 제게 이야기를 들려달라고 하거나 재미있는 그림을 그려달라고 해보세요! 🎨✨");
            sessionStorage.setItem('hasBeenWelcomed', 'true');
        }
    }
  
    public async resetSession(isLogout: boolean = false) {
      if (!browser) return;
      console.log(`Resetting session. Is it for logout? ${isLogout}`);
      globalIsLoading.set(true);

      this.disconnect(); 
      sessionStorage.removeItem('chatSessionId');
      
      if (isLogout) {
          sessionStorage.removeItem('user_token');
      }
      
      chatMessages.set([]);
      storyPages.clearPages();
      currentStoryTitle.set("나만의 AI 동화");
      audioStore.clearAudio();
      
      await this.start();
  }
    
    public disconnect() {
        if (this.socket) {
            this.socket.onclose = null;
            this.socket.close(1000, "Client initiated disconnect");
            this.socket = null;
        }
        this.sessionId = null;
        isReady.set(false);
    }

  public getSessionId = () => this.sessionId;

  public sendMessage(message: { content: string; action?: string }) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket is not connected.");
        chatMessages.addSystemMessage("서버와 연결되어 있지 않습니다. 페이지를 새로고침해주세요.");
        return;
      }
      this.socket.send(JSON.stringify(message));
      globalIsLoading.set(true);
  }

  private async fetchLatestAudio() {
    if (!browser || !this.sessionId) return;
    try {
        const token = sessionStorage.getItem('user_token');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Call the new SvelteKit 
        const response = await fetch(`${BASE_HTTP_URL_export}/audio/latest/${this.sessionId}`, { headers });

        if (!response.ok) {
            // Don't throw an error, just log it, as this is a background fetch.
            console.error(`Failed to fetch latest audio: ${response.statusText}`);
            return;
        }
        const data = await response.json();
        
        if (data && data.audio_url) {
            audioStore.setAudio(data.audio_url);
        }
    } catch (error) {
        console.error("Error fetching latest audio:", error);
    }
  }
}

const webSocketService = new WebSocketService();

export function sendUserMessage(prompt: string) {
    if (!browser) return;
    chatMessages.addMessage({sender: 'user', text: prompt});
    webSocketService.sendMessage({ content: prompt });
}

export async function downloadStoryAsPdf() {
  if (!browser) return;
  const sessionId = webSocketService.getSessionId(); 
  
  if (!sessionId) {
    alert("아직 이야기가 시작되지 않았거나 서버와 연결되지 않았습니다.");
    console.error("Cannot download PDF without a session ID.");
    return;
  }

  try {
    const response = await fetch(`${BASE_HTTP_URL_export}/pdf/${sessionId}`);
    if (!response.ok) {
      const errorText = await response.text();
      alert(`PDF 생성 실패: ${errorText}`);
      throw new Error(`PDF 생성 실패: ${errorText}`);
    }
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_ai_story_${sessionId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    alert("PDF를 다운로드하는 중 오류가 발생했습니다.");
  }
}

export function sendAction(action: 'generate_audio', content: string = '🎧 오디오 생성을 요청했습니다.') {
    if (!browser) return;
    // Add a system message immediately to give user feedback.
    chatMessages.addSystemMessage(content);
    if (action === 'generate_audio') {
        isAudioLoading.set(true);
    }
    webSocketService.sendMessage({ content: content, action: action });
}

const BASE_URL = PUBLIC_TOKEN_API_BASE_URL;

export async function loginUser(email: string, password: string) {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || '로그인에 실패했습니다.');
  }
  return response.json();
}

export async function registerUser(username: string, email: string, password: string) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || '회원가입에 실패했습니다.');
  }
  return response.json();
}

export function initializeApp() { if (browser) webSocketService.start(); }
export function startNewStory() { if (browser) webSocketService.resetSession(false); }

export async function loginAndSync(email: string, password: string) {
    if (!browser) return;
    const userData = await loginUser(email, password);
    auth.login(userData.access_token);
    webSocketService.disconnect();
    webSocketService.start();
}

export function logoutUser() {
	if (!browser) return;
	// auth.logout()이 내부적으로 sessionStorage를 비우고 페이지를 새로고침합니다.
	auth.logout();
}

export function logoutAndResetSession() {
    if (!browser) return;
    webSocketService.disconnect();
    webSocketService.start();
}


/**
 * AI에게 장면 이미지 수정을 요청합니다.
 * @param sceneId 수정할 장면의 ID
 * @param prompt 사용자가 입력한 수정 요청 프롬프트
 * @param imageBlob 캔버스에서 생성된 이미지 파일 (Blob)
 */
export async function editSceneImage(sceneId: number, prompt: string, imageBlob: Blob) {
  if (!browser) return;
  
  const sessionId = webSocketService.getSessionId();
  if (!sessionId) {
    throw new Error("활성화된 세션이 없습니다.");
  }

  const token = sessionStorage.getItem('user_token');
  const headers: HeadersInit = {};

  // ✅ 'session-id' 헤더를 추가합니다.
  headers['session-id'] = sessionId;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // 백엔드가 Form 데이터를 기대하므로 FormData 객체를 생성합니다.
  const formData = new FormData();
  formData.append('modification_request', prompt);
  formData.append('file', imageBlob, 'edited-image.png'); // 세 번째 인자는 파일명입니다.

  // SvelteKit의 fetch를 사용하여 PUT 요청을 보냅니다.
  // 백엔드 API 주소 형식 `/scenes/{scene_id}/image` 에 맞춥니다.
  const response = await fetch(`${PUBLIC_SCENES_API_BASE_URL}/scenes/${sceneId}/image`, {
    method: 'PUT',
    headers, // 인증 헤더를 포함합니다.
    body: formData, // JSON.stringify 대신 FormData를 그대로 보냅니다.
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData); 
    throw new Error(errorData.detail || '이미지 수정에 실패했습니다.');
  }

  // 백엔드가 202 Accepted를 반환하므로, 특별한 데이터 없이 성공 여부만 확인합니다.
  return response.status === 202;
}