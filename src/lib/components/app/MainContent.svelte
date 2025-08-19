<script lang="ts">
  import { onMount } from 'svelte';
  import type { StoryPage } from '$lib/types';
  import Icon from '$lib/Icon.svelte';
  import Typewriter from './Typewriter.svelte';

  let { pages = [], onPageChange = (index: number) => {} } = $props<{ 
    pages?: StoryPage[],
    onPageChange?: (index: number) => void
  }>();

  let currentPageIndex = $state(0);
  let showImage = $state(true); // 기본값을 true로 변경하여 깜빡임 방지
  let isTyping = $state(true);

  let currentPage = $derived(pages[currentPageIndex]);

  $effect(() => {
    if (currentPage) {
      isTyping = true;
    }
  });

  function handleTypingComplete() {
    isTyping = false;
  }

  function handleShare() {
    const pageToShare = currentPage;
    if (pageToShare) {
      const textToShare = currentPage.type === 'text' ? currentPage.content : currentPage.imageCaption;
      alert(`"${textToShare?.substring(0, 50)}..." 페이지를 공유합니다!`);
    }
  }

  function changePage(direction: 'next' | 'prev') {
    let newIndex = currentPageIndex;
    if (direction === 'next' && currentPageIndex < pages.length - 1) {
      newIndex++;
    } else if (direction === 'prev' && currentPageIndex > 0) {
      newIndex--;
    }
    
    if (newIndex !== currentPageIndex) {
      currentPageIndex = newIndex;
      onPageChange(newIndex);
    }
  }
</script>

<div class="flex-1 flex flex-col bg-slate-900 h-full">
  <!-- Header (Mobile Only) -->
  <div class="flex items-center p-4 text-slate-300 border-b border-slate-700/50 md:hidden">
    <Icon name="bookOpen" className="h-7 w-7 text-cyan-400 mr-3" />
    <div>
      <h1 class="text-lg font-bold text-white">Spark AI Agent</h1>
      <p class="text-xs text-slate-400">나만의 AI 동화</p>
    </div>
  </div>

  {#if currentPage}
    {@const textToShow = currentPage.type === 'text' ? currentPage.content : currentPage.imageCaption}

    <!-- Desktop: Overlay Layout -->
    <div class="hidden md:flex flex-1 flex-col items-center justify-center p-6 relative">
      <div 
        class="relative w-full max-w-4xl aspect-[16/9] bg-slate-900 rounded-lg shadow-lg flex items-center justify-center transition-opacity duration-700 ease-in-out"
        class:opacity-100={showImage} 
        class:opacity-0={!showImage}
      >
        {#if currentPage.type === 'image' && currentPage.content}
          <img src={currentPage.content} alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-110" />
          <img src={currentPage.content} alt={currentPage.imageCaption || 'Story illustration'} class="relative w-full h-full object-contain" />
        {:else}
          <div class="text-slate-500 flex flex-col items-center">
            <Icon name="image" className="h-24 w-24 mb-4" />
            <p>AI가 아직 이미지를 생성하지 않았어요.</p>
          </div>
        {/if}
        
        {#if textToShow}
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <Typewriter text={textToShow} speed={25} className="text-white text-lg md:text-2xl leading-relaxed font-semibold" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.7);" onComplete={handleTypingComplete} />
        </div>
        {/if}
      </div>
      <!-- Desktop Controls -->
      <div class="absolute top-4 right-4 z-10 flex items-center justify-center">
        <button onclick={() => changePage('prev')} class="p-2 text-white hover:text-cyan-300 disabled:text-slate-500 transition-colors" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);" disabled={currentPageIndex <= 0}><Icon name="chevronLeft" /></button>
        <span class="mx-2 text-white font-semibold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">{currentPageIndex + 1} / {pages.length}</span>
        <button onclick={() => changePage('next')} class="p-2 text-white hover:text-cyan-300 disabled:text-slate-500 transition-colors" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);" disabled={currentPageIndex >= pages.length - 1}><Icon name="chevronRight" /></button>
        <button onclick={handleShare} disabled={isTyping || !currentPage} class="ml-4 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-3 rounded-lg transition-all disabled:bg-slate-600 text-sm"><Icon name="share" className="h-5 w-5"/><span>공유</span></button>
      </div>
    </div>

    <!-- Mobile: Classic Vertical Layout -->
    <div class="md:hidden flex-1 flex flex-col overflow-y-auto">
      <!-- Image Area -->
      <div class="aspect-[16/9] bg-slate-900 flex-shrink-0">
        {#if currentPage.type === 'image' && currentPage.content}
          <img src={currentPage.content} alt={currentPage.imageCaption || 'Story illustration'} class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full flex flex-col items-center justify-center text-slate-500">
            <Icon name="image" className="h-16 w-16 mb-2" />
            <p class="text-sm">이미지가 없습니다.</p>
          </div>
        {/if}
      </div>
      <!-- Text Area -->
      <div class="p-4 flex-grow">
        {#if textToShow}
          <Typewriter text={textToShow} speed={25} className="text-slate-200 text-base leading-relaxed" onComplete={handleTypingComplete} />
        {/if}
      </div>
    </div>
    <!-- Mobile Controls -->
    <div class="md:hidden flex items-center justify-center p-2 border-t border-slate-700/50 bg-slate-800">
      <button onclick={() => changePage('prev')} class="p-2 text-slate-400 hover:text-white disabled:text-slate-600" disabled={currentPageIndex <= 0}><Icon name="chevronLeft" /></button>
      <span class="mx-4 text-slate-300 font-semibold text-sm">{currentPageIndex + 1} / {pages.length}</span>
      <button onclick={() => changePage('next')} class="p-2 text-slate-400 hover:text-white disabled:text-slate-600" disabled={currentPageIndex >= pages.length - 1}><Icon name="chevronRight" /></button>
      <button onclick={handleShare} disabled={isTyping || !currentPage} class="ml-auto flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-3 rounded-lg text-sm"><Icon name="share" className="h-5 w-5"/><span>공유</span></button>
    </div>

  {:else}
    <div class="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-4">
      <p class="text-xl">아직 생성된 페이지가 없습니다.</p>
      <p>오른쪽 채팅창에서 AI와 대화를 시작해보세요!</p>
    </div>
  {/if}
</div>