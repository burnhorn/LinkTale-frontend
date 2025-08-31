// src/lib/types.ts

export interface LogEntry {
  id: number;
  session_id: string;
  sender: 'user' | 'ai';
  message_type: 'text' | 'image' | 'audio' | 'system';
  content?: string | null; 
  image_url?: string | null;
  image_caption?: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  imageUrl?: string | null;
  timestamp: Date;
  isSystem?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  nodeName?: string;
  sceneId?: number;
}

/**
 * 이야기의 생성 기록(로그)을 위한 전용 인터페이스입니다.
 * ChatMessage와 구조는 비슷하지만, 목적이 다르므로 별도로 정의하여
 * 각자의 목적에 맞게 독립적으로 발전할 수 있도록 합니다.
 */
export interface CreationHistoryEntry {
  sender: 'user' | 'ai';
  text: string;
  // 나중에 여기에 'model_name', 'token_usage' 등의 속성을 추가할 수 있습니다.
}

// export interface ChatMessage_ {
//   id: string;
//   sender: 'user' | 'ai';
//   text: string;
//   imageUrl?: string | null;
//   timestamp: string;
//   isSystem?: boolean;
//   isLoading?: boolean;
//   isError?: boolean;
//   nodeName?: string;
// }


export interface StoryPage {
  id: string;
  type: 'text' | 'image';
  content: string;
  prompt?: string;
  imageCaption?: string;
  title?: string;
  timestamp: Date;
}

export interface StoryBook {
  id: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  isMasterpiece: boolean;
  createdAt: Date;
  pages: any[]; // 실제 페이지 타입으로 교체 필요
  mainCharacters: string[];
  creationHistory: CreationHistoryEntry[]; // ChatMessage[]에서 변경됨
  authorName: string;
  likes: number;
  views: number;
  tags: string[];
}

export type WorldAssetCategory = 'character' | 'place' | 'item' | 'ability';

export interface Appearance {
  storyTitle: string;
  pageNumber: number;
}

export interface WorldAsset {
  id: string;
  name: string;
  category: WorldAssetCategory;
  summary: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  appearanceHistory: Appearance[];
}

export interface AudioState {
  src: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export type ViewMode = 'story' | 'chat';

import type { IconName } from '$lib/icons';

// --- Pricing Page Types ---

export interface Plan {
	iconName: IconName;
	title: string;
	description: string;
	price: string;
	benefits: string[];
	cta: string;
	ctaAction?: () => void;
	isCurrent?: boolean;
	isPopular?: boolean;
	subtext?: string;
	colors: {
		bg: string;
		iconBg: string;
		priceBg: string;
		ctaBg: string;
		ctaHoverBg: string;
		ctaText: string;
	};
}

export interface Faq {
	q: string;
	a: string;
}

export interface Quest {
	title: string;
	description: string;
}


export interface Scene {
  id: number;
  scene_number: number;
  text_content: string;
  illustration_prompt?: string | null;
  characters_in_scene: string[]; // "A list of the names of the characters in this scene"
  blob_url?: string | null; // DB에 저장될 영구적인 URL
  sas_url?: string | null; // 클라이언트에게 임시로 제공될 SAS URL
  created_at: string; // API 응답이 문자열이므로 string으로 정의
}


// 백엔드의 /history API 응답 전체의 구조를 정의하는 타입.
export interface ChatHistoryResponse {
  logs: LogEntry[];
  scenes: Scene[];
}