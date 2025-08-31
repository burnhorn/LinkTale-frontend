<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import type { ChatMessage } from './types';
  import { marked } from 'marked';
  import Icon from "./Icon.svelte";
  import { imageEditorModalState } from '$lib/stores';

  export let message: ChatMessage;

  const isUser = message.sender === 'user';
  
  function formatTime(timestamp: Date): string {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }

  // 메시지 ID로부터 Scene ID를 파싱하는 함수
  function getSceneIdFromMessage(msg: ChatMessage): number | null {
    if (msg.id && typeof msg.id === 'string' && msg.id.startsWith('scene-img-')) {
      const parsedId = parseInt(msg.id.replace('scene-img-', ''));
      return isNaN(parsedId) ? null : parsedId;
    }
    return null;
  }

  // 수정 버튼 클릭 핸들러
  function openEditor() {
    const sceneId = getSceneIdFromMessage(message);
    if (sceneId && message.imageUrl) {
      imageEditorModalState.set({
        isOpen: true,
        sceneId: sceneId,
        imageUrl: message.imageUrl
      });
    } else {
      console.warn("This image cannot be edited.", message);
      alert("이 이미지는 수정할 수 없는 타입입니다.");
    }
  }
</script>

<div 
  class="flex mb-3"
  class:justify-end={isUser}
  class:justify-start={!isUser}
  in:fly={{ y: 20, duration: 400, delay: 50 }}
  out:fade={{ duration: 200 }}
>
  <div 
    class="flex items-end max-w-xs md:max-w-sm lg:max-w-md"
    class:flex-row-reverse={isUser}
    class:flex-row={!isUser}
  >
    <!-- AI 프로필 아이콘 -->
    {#if !isUser}
      <div class="self-start p-1.5 rounded-full mr-2 shrink-0" 
           class:bg-pink-500={!message.isSystem && !message.isError}
           class:bg-yellow-500={message.isError}
           class:bg-slate-600={message.isSystem}>
        {#if message.isError}
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        {:else if message.isSystem}
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        {:else}
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 16h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <!-- Simple AI/Robot Icon -->
        {/if}
      </div>
    {/if}

    <!-- 말풍선 컨테이너 -->
    <div
      class="px-4 py-3 rounded-xl shadow-md"
      class:bg-user-bubble={isUser}
      class:text-white={isUser}
      class:rounded-br-none={isUser}
      class:bg-ai-bubble={!isUser && !message.isError && !message.isSystem}
      class:text-brand-text-light={!isUser && !message.isError && !message.isSystem}
      class:bg-yellow-100={message.isError}
      class:text-yellow-800={message.isError}
      class:border={message.isError}
      class:border-yellow-400={message.isError}
      class:bg-slate-600={message.isSystem}
      class:text-slate-200={message.isSystem}
      class:rounded-bl-none={(!isUser && !message.isError && !message.isSystem) || message.isSystem}
    >
      <!-- 1. 메시지 본문 (텍스트 + 이미지) -->
      <div class="text-sm prose prose-invert max-w-none">{@html marked(message.text || '')}</div>
      
      {#if message.imageUrl}
        <!-- 'relative group'을 이곳으로 옮겨와서 이미지와 버튼을 하나로 묶습니다. -->
        <div class="mt-2 relative group">
          <img
            src={message.imageUrl}
            alt="AI generated illustration"
            class="rounded-lg max-w-full h-auto object-contain shadow-lg border-2 border-slate-600"
          />
          <!-- 수정 버튼은 이 div 내부에 위치하여 이미지 위에 나타납니다. -->
          <button
            on:click={openEditor}
            class="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Edit Image"
          >
            <!-- Icon 컴포넌트의 name을 pencilEdit으로 가정했습니다. 실제 이름에 맞게 수정해주세요. -->
            <Icon name="pencilEdit" className="w-5 h-5" /> 
          </button>
        </div>
      {/if}

      <!-- 2. AI가 스트리밍 중일 때만 표시되는 로딩 표시 -->
      {#if message.isLoading}
        <div class="flex items-center mt-2">
          <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-brand-primary mr-2"></div>
          <p class="text-xs italic opacity-70">이야기를 쓰는 중...</p>
        </div>
      {/if}
      
      <!-- 3. 타임스탬프 (항상 표시) -->
      <p class="text-xs opacity-70 mt-1" class:text-right={isUser} class:text-left={!isUser}>
        {formatTime(message.timestamp)}
      </p>
    </div>
  </div>
</div>