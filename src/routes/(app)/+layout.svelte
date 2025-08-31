<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { initializeApp, logoutAndResetSession, sendUserMessage, startNewStory } from '$lib/apiService';
  import { auth } from '$lib/authStore';
  import LeftSidebar from '$lib/components/app/LeftSidebar.svelte';
  import LiveStageSidebar from '$lib/components/app/LiveStageSidebar.svelte';
  import AuthModal from '$lib/components/app/AuthModal.svelte';
  import MobileNav from '$lib/components/app/MobileNav.svelte';
  import AudioPlayer from '$lib/AudioPlayer.svelte';
  import ImageEditorModal from '$lib/components/app/ImageEditorModal.svelte';
  import type { StoryPage, Quest } from '$lib/types';
  import { chatMessages, storyPages, isAuthModalOpen, viewMode, audioStore } from '$lib/stores';
  import Icon from '$lib/Icon.svelte';
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';

  let { children } = $props();
  let isMounted = false;

  // --- App State ---
  let authModalMode = $state<'login' | 'signup'>('login');
  let isAiTyping = $state(false);
  let isRightSidebarCollapsed = $state(false);
  let isMobileMenuOpen = $state(false);

  // --- Dummy Data ---
  let orbs = 100;
  let affinity = 75;
  let quest: Quest = { title: '새로운 모험 시작하기', description: 'AI와 대화를 시작하여 첫 페이지를 만들어보세요.' };
  let questStatus = $state<'incomplete' | 'complete'>('incomplete');
  let affinityChange: 'none' | 'increased' = 'none';

  onMount(() => {
    isMounted = true;
    initializeApp();
  });

  $effect.pre(() => {
    if (!isMounted) return;
    // This effect is no longer needed as authStore handles the logout process
    // and page reload, which re-initializes the app state correctly.
  });
  
  function handleStartNewStory() {
    startNewStory();
    isMobileMenuOpen = false;
    goto('/create');
  }

  function handleLoginClick() {
    authModalMode = 'login';
    isAuthModalOpen.set(true);
    isMobileMenuOpen = false;
  }
  
  function handleSendMessage(message: string) {
    sendUserMessage(message);
  }

  function handleToggleRightSidebar() {
    isRightSidebarCollapsed = !isRightSidebarCollapsed;
  }

  function handleToggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function handleCloseMobileMenu() {
    isMobileMenuOpen = false;
  }

  $effect(() => {
    const messages = $chatMessages;
    isAiTyping = messages.length > 0 && messages[messages.length - 1].sender === 'user';

    // --- ✅ 퀘스트 완료 로직 추가 ---
    // AI가 보낸 메시지가 하나라도 있고, 아직 퀘스트가 미완료 상태일 때
    if (messages.some(m => m.sender === 'ai') && questStatus === 'incomplete') {
      questStatus = 'complete';
      quest.description = '첫 번째 대화를 성공적으로 끝냈습니다!'; // 퀘스트 설명도 업데이트
    }
    // ---

    const newPages: StoryPage[] = [];
    messages.forEach(msg => {
      if (msg.sender === 'ai' && msg.imageUrl) {
        newPages.push({
          id: msg.id,
          type: 'image',
          content: msg.imageUrl,
          imageCaption: msg.text || "AI 생성 이미지",
          timestamp: msg.timestamp
        });
      } else if (
        msg.sender === 'ai' &&
        !msg.imageUrl &&
        !msg.isSystem &&
        msg.nodeName === 'story_sentence_generator'
      ) {
        newPages.push({
          id: msg.id,
          type: 'text',
          content: msg.text,
          timestamp: msg.timestamp
        });
      }
    });
    storyPages.set(newPages);
  });

  // 페이지 이동 시 모바일 뷰를 'story'로 자동 전환
  $effect(() => {
    // URL 경로가 변경될 때마다 모바일 뷰를 'story'로 설정합니다.
    // 이렇게 하면 사용자가 메뉴에서 새 페이지로 이동할 때 항상 해당 페이지의 콘텐츠가 표시됩니다.
    // 채팅 뷰는 MobileNav의 '채팅' 버튼을 통해 명시적으로 다시 활성화할 수 있습니다.
    if ($page.url.pathname) {
      viewMode.set('story');
    }
  });
</script>

<div class="h-screen bg-brand-bg text-brand-text-light flex flex-col md:flex-row">
  <!-- Left Sidebar (Desktop) -->
  <div class="hidden md:block flex-shrink-0">
    <LeftSidebar onStartNewStory={handleStartNewStory} onLoginClick={handleLoginClick} />
  </div>

  <!-- Mobile Menu (Overlay) -->
  {#if isMobileMenuOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div 
      transition:fade={{ duration: 200 }}
      class="md:hidden fixed inset-0 bg-black/60 z-40"
      onclick={handleCloseMobileMenu}
      role="button"
      aria-label="Close mobile menu"
      tabindex="0"
    ></div>
    <div transition:fly={{ x: -300, duration: 300 }} class="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-slate-900 z-50">
      <LeftSidebar onStartNewStory={handleStartNewStory} onLoginClick={handleLoginClick} />
    </div>
  {/if}

  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col h-full min-w-0 relative">
    <!-- Mobile Header -->
    <header class="md:hidden flex items-center justify-between p-4 bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50">
      <button onclick={handleToggleMobileMenu} class="z-50 text-slate-300 hover:text-white">
        <Icon name="menu" class="h-6 w-6" />
      </button>
      <a href="/" class="flex items-center space-x-2">
        <Icon name="logo" className="h-7 w-7 text-cyan-400" />
        <span class="text-lg font-bold">Spark Weaver</span>
      </a>
      <div class="w-6"></div>
    </header>

    <!-- Desktop Content -->
    <div class="hidden md:flex flex-1 h-full">
      {@render children()}
    </div>

    <!-- Mobile Content -->
    <div class="md:hidden flex-1 overflow-y-auto pb-16">
      {#if $viewMode === 'story'}
        {@render children()}
      {:else}
        <div class="h-full">
          <LiveStageSidebar 
            messages={$chatMessages}
            {isAiTyping}
            {orbs}
            {affinity}
            {quest}
            {questStatus}
            {affinityChange}
            collapsed={false}
            onSendMessage={handleSendMessage}
          />
        </div>
      {/if}
    </div>
  </main>
  
  <!-- Right Sidebar (Desktop) -->
  <div class="hidden md:block flex-shrink-0 relative">
    <button
      onclick={handleToggleRightSidebar}
      class="absolute top-1/2 -left-4 -translate-y-1/2 z-20 w-8 h-16 rounded-lg bg-slate-800 hover:bg-slate-700 border-2 border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300"
      aria-label="오른쪽 사이드바 토글"
    >
      <Icon name="chevronRight" class={`h-5 w-5 transition-transform ${isRightSidebarCollapsed ? '' : 'rotate-180'}`} />
    </button>

    <LiveStageSidebar 
      messages={$chatMessages}
      {isAiTyping}
      {orbs}
      {affinity}
      {quest}
      {questStatus}
      {affinityChange}
      collapsed={isRightSidebarCollapsed}
      onSendMessage={handleSendMessage}
    />
  </div>

  <!-- Mobile Navigation -->
  <div class="fixed bottom-0 left-0 right-0 z-40 md:hidden">
    <MobileNav />
  </div>

  <!-- Global Audio Player -->
  {#if $audioStore.src}
    <AudioPlayer />
  {/if}

  {#if $isAuthModalOpen}
    <AuthModal
      open={$isAuthModalOpen}
      mode={authModalMode}
      onClose={() => isAuthModalOpen.set(false)}
      onSwitch={(newMode) => (authModalMode = newMode)}
    />
  {/if}
  <ImageEditorModal />
</div>

<style>
  .bg-brand-bg {
    background-color: #1a202c;
  }
  .text-brand-text-light {
    color: #e2e8f0;
  }
</style>

