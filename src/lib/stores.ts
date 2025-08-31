import { writable, type Writable } from 'svelte/store';
import type { LogEntry, ChatMessage, StoryPage, AudioState, ViewMode, Scene, ChatHistoryResponse } from '$lib/types';

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
  const { subscribe, set, update } = writable<ChatMessage[]>([]);

  return {
    subscribe,
    set,
    
    initializeFromHistory: (history: ChatHistoryResponse) => {
      // 1. 'logs' 배열을 'ChatMessage' 배열로 변환합니다.
      const messagesFromLogs: ChatMessage[] = (history.logs || []).map(log => ({
        id: log.id.toString(),
        sender: log.sender,
        text: log.content || "",
        imageUrl: log.message_type === 'image' ? log.image_url : null,
        timestamp: new Date(log.created_at),
        isSystem: log.message_type === 'system' || log.message_type === 'audio',
      }));

      // 2. 'scenes' 배열을 'ChatMessage' 배열로 변환합니다.
      const messagesFromScenes: ChatMessage[] = (history.scenes || [])
        .flatMap(scene => {
          // 각 scene에서 텍스트 메시지와 이미지 메시지를 별도로 생성합니다.
          const sceneMessages: ChatMessage[] = [];
          
          // 2-1. 장면 텍스트 메시지 (항상 존재)
          sceneMessages.push({
            id: `scene-${scene.id}`, // 고유 ID를 위해 접두사 추가
            sender: 'ai',
            // 확정된 장면 텍스트임을 명시
            text: `[${scene.scene_number}번째 장면]\n${scene.text_content}`,
            imageUrl: null,
            // 백엔드 Scene 모델에 created_at => new Date()를 사용하여 Date 객체로 변환
            timestamp: new Date(scene.created_at),
            isSystem: false, 
          });

          // 2-2. 장면 이미지 메시지 (이미지가 있을 경우에만)
          if (scene.sas_url) {
            sceneMessages.push({
              id: `scene-img-${scene.id}`,
              sender: 'ai',
              text: scene.text_content, // 캡션을 텍스트로 사용
              imageUrl: scene.sas_url,
              timestamp: new Date(scene.created_at),
              isSystem: false,
            });
          }
          
          return sceneMessages;
        });

      // 3. 변환된 두 배열을 합칩니다.
      const allMessages = [...messagesFromLogs, ...messagesFromScenes];

      // 4. 최종적으로 시간 순서대로 정렬합니다.
      allMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // 5. 스토어 상태를 업데이트합니다.
      set(allMessages);
    },
    // 🔥 addMessage는 파라미터로 객체 하나만 받습니다.
    addMessage: (messageData: { 
      sender: 'user' | 'ai'; 
      text: string; 
      imageUrl?: string | null;
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


function createSceneStore() {
  const { subscribe, set, update } = writable<Scene[]>([]);

  return {
    subscribe,
    initializeScenes: (scenes: Scene[]) => {
      // 백엔드에서 받은 Scene 데이터로 스토어를 초기화합니다.
      // 필요하다면 여기서 프론트엔드에 맞게 데이터를 가공할 수 있습니다.
      set(scenes);
    },
    // 나중에 이미지 수정 후 특정 Scene만 업데이트하는 함수 등을 추가할 수 있습니다.
    updateSceneImage: (sceneId: number, newImageUrl: string) => {
      update(scenes => {
        return scenes.map(scene => 
          scene.id === sceneId ? { ...scene, imageUrl: newImageUrl } : scene
        );
      });
    }
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


export const storyScenes = createSceneStore();
