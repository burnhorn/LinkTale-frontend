<script lang="ts">
  import { viewMode, type ViewMode } from '$lib/stores';
  import Icon from '$lib/Icon.svelte';

  function setView(mode: ViewMode) {
    viewMode.set(mode);
  }
</script>

<!-- 
  md:hidden: 이 컴포넌트는 중간 크기(medium) 화면 이상에서는 보이지 않습니다. 모바일 전용입니다.
-->
<nav class="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 flex md:hidden z-30">
  <button
    on:click={() => setView('story')}
    class="flex-1 flex flex-col items-center justify-center transition-colors"
    class:text-cyan-400={$viewMode === 'story'}
    class:text-slate-400={$viewMode !== 'story'}
    aria-label="스토리 뷰 보기"
  >
    <Icon name="book" class="w-6 h-6 mb-1" />
    <span class="text-xs font-medium">스토리</span>
  </button>
  <button
    on:click={() => setView('chat')}
    class="flex-1 flex flex-col items-center justify-center transition-colors"
    class:text-cyan-400={$viewMode === 'chat'}
    class:text-slate-400={$viewMode !== 'chat'}
    aria-label="채팅창 보기"
  >
    <Icon name="chat" class="w-6 h-6 mb-1" />
    <span class="text-xs font-medium">채팅</span>
  </button>
</nav>
