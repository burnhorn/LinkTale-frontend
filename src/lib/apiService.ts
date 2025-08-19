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
	isReady
} from '$lib/stores';
import type { LogEntry } from '$lib/types';
import { get } from 'svelte/store';
import { auth } from '$lib/authStore';


const	PUBLIC_CHAT_API_BASE_URL = env.PUBLIC_CHAT_API_BASE_URL;
const	PUBLIC_EXPORT_API_BASE_URL = env.PUBLIC_EXPORT_API_BASE_URL;
const	PUBLIC_TOKEN_API_BASE_URL = env.PUBLIC_TOKEN_API_BASE_URL;
const	PUBLIC_WS_BASE_URL = env.PUBLIC_WS_BASE_URL;

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
        case 'image_generated':
          const { image_url, image_caption } = parsed.data;
          chatMessages.addMessage({ 
                    sender: 'ai', 
                    text: image_caption || '', 
                    imageUrl: image_url 
                });
          break;
        case 'audio_generated':
          const audioData = parsed.data.final_audio_data;
          if (audioData && audioData.audio_url) {
              audioStore.setAudio(audioData.audio_url);
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
        case 'error':
          chatMessages.setErrorOnLastAiMessage(parsed.data);
          break;
        case 'tool_end':
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
            
            const history: LogEntry[] = await response.json();

            if (history && history.length > 0) {
                chatMessages.initializeMessages(history);
              const hasAudio = history.some(log => log.message_type === 'audio');
              if (hasAudio) {
                  this.fetchLatestAudio();
                }
      } else {
        const hasWelcomed = sessionStorage.getItem('hasBeenWelcomed');
        if (!hasWelcomed) {
          chatMessages.addSystemMessage("안녕하세요, 꼬마 창작자님! 오늘은 어떤 멋진 이야기를 만들어 볼까요? 제게 이야기를 들려달라고 하거나 재미있는 그림을 그려달라고 해보세요! 🎨✨");
          sessionStorage.setItem('hasBeenWelcomed', 'true');
        }          
      }
    } catch (error) {
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