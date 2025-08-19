import { writable, type Writable } from 'svelte/store';
import type { LogEntry, ChatMessage, StoryPage, AudioState, ViewMode } from '$lib/types';

function createAudioStore() {
  const { subscribe, update, set } = writable<AudioState>({
    src: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  return {
    subscribe,
    setAudio: (newSrc: string) => {
      update(state => ({
        ...state,
        src: newSrc,
        isPlaying: false,
        currentTime: 0,
      }));
    },
    play: () => update(state => ({ ...state, isPlaying: true })),
    pause: () => update(state => ({ ...state, isPlaying: false })),
    updateTime: (time: number) => update(state => ({ ...state, currentTime: time })),
    setDuration: (duration: number) => update(state => ({ ...state, duration: duration })),
    clearAudio: () => set({ src: null, isPlaying: false, currentTime: 0, duration: 0 }),
  };
}


function createChatMessageStore() {
  const { subscribe, update, set } = writable<ChatMessage[]>([]);

  return {
    subscribe,
    set,
    initializeMessages:  (history: LogEntry[]) => {
      const formattedMessages: ChatMessage[] = history.map(log => {
        let text = log.content || "";
        let imageUrl: string | null = null;
        
        // 백엔드에서 온 이미지 로그 처리
        if (log.message_type === 'image') {
          try { // ChatMessage 객체
            imageUrl = log.image_url || null;
            // image_caption이 있다면 text로 사용하고, 없다면 빈 문자열로 둡니다.
            text = log.image_caption || ""; 
          } catch (e) {
            console.error("Failed to parse image log content:", log.content);
            text = "[이미지 로딩 실패]";
          }
        }

        // 백엔드 LogEntry 객체를 프론트엔드 ChatMessage 객체로 변환
        return {
          id: log.id,
          sender: log.sender as 'user' | 'ai',
          text: text,
          imageUrl: imageUrl,
          timestamp: new Date(log.created_at), // 필드명을 백엔드 모델과 일치 (created_at)
          // ✅ message_type에 따라 isSystem 플래그 설정
          // log.message_type의 값이 'system' 이거나 또는 'audio' 라면 isSystem을 true로 설정하고, 둘 다 아니라면 false로 설정
          isSystem: log.message_type === 'system' || log.message_type === 'audio',
          isLoading: false,
          isError: false,
        };
      });
      
      // 스토어의 전체 상태를 새로 가져온 기록으로 교체합니다.
      set(formattedMessages);
    },
    // 🔥 addMessage는 파라미터로 객체 하나만 받습니다.
    addMessage: (messageData: { 
      sender: 'user' | 'ai'; 
      text: string; 
      imageUrl?: string | null 
    }) => {
      const newMessage: ChatMessage = {
        id: Date.now() + Math.random(),
        sender: messageData.sender,
        text: messageData.text,
        imageUrl: messageData.imageUrl || null, // imageUrl이 없으면 null로 설정
        timestamp: new Date(),
        isSystem: false,
        isLoading: false,
        isError: false
      };
      update(messages => [...messages, newMessage]);
    },
    addSystemMessage: (text: string) => {
      update(messages => [
        ...messages,
        { id: Date.now() + Math.random(), sender: 'ai' as const, text, isSystem: true, timestamp: new Date() }
      ]);
    },
    // ✨✨✨ 기존 객체의 속성을 직접 수정하지 않는 함수(Svelte가 변경 감지 가능)로 작성합니다. ✨✨✨
    updateLastAiMessage: (textChunk: string, nodeName?: string) => {
      update(messages => {
        if (messages.length === 0) return messages; // 비어있으면 그대로 반환

        const lastMessage = messages[messages.length - 1];

        if (lastMessage.sender === 'ai' && !lastMessage.isSystem && !lastMessage.imageUrl) {
          // 1. 기존 마지막 메시지를 복사하고, text와 isLoading만 수정한 '새로운' 객체를 만듭니다.
          const updatedMessage = {
            ...lastMessage,
            text: lastMessage.text + textChunk,
            isLoading: true,
          };
          // 2. 마지막 요소를 제외한 배열의 복사본(...slice)과 새로운 객체를 합쳐, '완전히 새로운' 배열을 반환합니다.
          return [...messages.slice(0, -1), updatedMessage];
        } else {
          // 3. 새 메시지를 추가할 때도, 기존 배열에 push하는 대신 새 배열을 만듭니다.
          const newAiMessage: ChatMessage = {
            id: Date.now() + Math.random(),
            sender: 'ai' as const,
            text: textChunk,
            isLoading: true,
            timestamp: new Date(),
            nodeName: nodeName
          };
          return [...messages, newAiMessage];
        }
      });
    },
    // `image_generated` 이벤트를 처리하기 위한 함수
    addAiImageMessage: (imageUrl: string, textContent: string) => {
      const newImageMessage = {
            id: Date.now() + Math.random(),
            sender: 'ai' as const,
            text: textContent,
            imageUrl: imageUrl,
            isLoading: false,
            timestamp: new Date()
        };
        update(messages => [...messages, newImageMessage]);
    },
    // `tool_end` 이벤트 등에서 로딩 상태를 종료하기 위한 함수
    finishLastAiMessage: () => {
      update(messages => {
        if (messages.length === 0) return messages;
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.sender === 'ai') {
          const updatedMessage = { ...lastMessage, isLoading: false };
          return [...messages.slice(0, -1), updatedMessage];
        }
        return messages;
      });
    },
    setErrorOnLastAiMessage: (errorMessage: string) => {
      update(messages => {
        const lastLoadingMsgIndex = messages.findIndex(m => m.isLoading);
        
        if (lastLoadingMsgIndex !== -1) {
          // 1. 수정할 객체를 복사하여 새로운 객체를 만듭니다.
          const updatedMessage = {
            ...messages[lastLoadingMsgIndex],
            text: errorMessage,
            isLoading: false,
            isError: true,
          };
          // 2. 기존 배열을 복사하고, 수정된 객체로 교체합니다.
          const newMessages = [...messages];
          newMessages[lastLoadingMsgIndex] = updatedMessage;
          return newMessages;
        } else {
          // 에러 메시지를 새 메시지로 추가합니다.
          return [
            ...messages,
            {
              id: Date.now() + Math.random(),
              sender: 'ai',
              text: errorMessage,
              isError: true,
              isLoading: false,
              timestamp: new Date()
            }
          ];
        }
        });
      },
      clearMessages: () => set([]),
    };
  }

export const chatMessages = createChatMessageStore();

function createStoryPageStore() {
  const { subscribe, update, set } = writable<StoryPage[]>([]);
  return {
    subscribe,
    set,
    // 초기화 함수
    initializePages: (pages: StoryPage[]) => {
      set(pages);
    },
    addPage: (type: 'text' | 'image', content: string, prompt: string = '', imageCaption: string = '', title: string = '') => {
      update(pages => [
        ...pages,
        { id: Date.now() + Math.random(), type, content, prompt, imageCaption, title, timestamp: new Date() }
      ]);
    },
    clearPages: () => set([])
  };
}
export const storyPages = createStoryPageStore();

export const currentStoryTitle: Writable<string> = writable("나만의 AI 동화");
export const isLoading: Writable<boolean> = writable(false);
export const isAudioLoading: Writable<boolean> = writable(false);
export const sidebarOpen: Writable<boolean> = writable(true);
export const audioStore = createAudioStore();
export const isAuthModalOpen: Writable<boolean> = writable(false);

// 🔥 모바일 뷰 모드를 위한 타입을 정의합니다.
export type ViewMode = 'story' | 'chat';

// 🔥 모바일에서 현재 어떤 뷰를 보여줄지 관리하는 스토어를 만듭니다.
//    기본값은 'chat'으로 설정하여, 모바일에서 처음 열면 채팅창이 보이도록 합니다.
export const viewMode: Writable<ViewMode> = writable('chat');

/** 앱이 백엔드와 통신할 준비가 되었는지 나타내는 전역 상태 */
export const isReady = writable<boolean>(false);
