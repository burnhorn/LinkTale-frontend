<script lang="ts">
  import { browser } from '$app/environment';
  import type { StoryBook } from '../../types'; // Adjust path as needed
  import Icon from '$lib/Icon.svelte';

  export let book: StoryBook | null;
  export let open: boolean = false;
  export let onClose: () => void = () => {};
  export let onStartInspiredStory: (title: string) => void = () => {};

  let pageIndex = 0;
  let imageLoaded = false;
  let dialog: HTMLDialogElement;

  $: if (browser && dialog) {
    if (open && !dialog.open) {
      dialog.showModal();
      pageIndex = 0; // Reset page index when opening
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }

  $: currentPage = book?.pages[pageIndex];
  $: isLastPage = book ? pageIndex === book.pages.length - 1 : false;

  // currentPage가 변경될 때마다 이미지 로딩 상태를 리셋하고 다시 로드
  $: if (currentPage?.imageUrl) {
    imageLoaded = false;
    const img = new Image();
    img.src = currentPage.imageUrl;
    img.onload = () => {
      imageLoaded = true;
    };
  } else if (currentPage) {
    imageLoaded = true; // No image to load
  }

  function goToNextPage() {
    if (book && pageIndex < book.pages.length - 1) {
      pageIndex += 1;
    }
  }

  function goToPrevPage() {
    if (pageIndex > 0) {
      pageIndex -= 1;
    }
  }

  function handleInspirationClick() {
    if (book) {
      onStartInspiredStory(book.title);
    }
  }

  function handleDialogClick(event: MouseEvent) {
    if (event.target === dialog) {
      onClose();
    }
  }
</script>

<dialog bind:this={dialog} on:close={onClose} on:click={handleDialogClick} class="bg-transparent p-0">
  {#if book}
    <div class="w-screen h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      {#if !currentPage}
        <div class="bg-slate-800 p-8 rounded-lg text-center">
          <h2 class="text-2xl font-bold mb-4">앗, 아직 이야기가 없어요!</h2>
          <p class="text-slate-400 mb-6">이 책은 아직 페이지가 작성되지 않았어요.</p>
          <button on:click={onClose} class="bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg">닫기</button>
        </div>
      {:else}
        <div class="relative w-full max-w-4xl aspect-[4/3] bg-slate-900 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden">
          <!-- Image -->
          <div class="w-full h-full transition-opacity duration-500" class:opacity-100={imageLoaded} class:opacity-0={!imageLoaded}>
            {#if currentPage.imageUrl}
              {#key currentPage.imageUrl}
                <img src={currentPage.imageUrl} alt={currentPage.imageCaption || `"${book.title}"의 삽화`} class="w-full h-full object-cover" />
              {/key}
            {/if}
          </div>
          {#if !imageLoaded}
            <div class="absolute inset-0 flex items-center justify-center text-slate-400">이미지 로딩 중...</div>
          {/if}
          
          <!-- Text Overlay -->
          <div class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent p-8 flex items-end">
            {#key currentPage.content}
              <p class="text-white text-xl leading-relaxed animate-fade-in-up">
                {currentPage.content}
              </p>
            {/key}
          </div>
          
          <!-- Last Page Inspiration Button -->
          {#if isLastPage}
            <div class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center animate-fade-in">
              <h2 class="text-4xl font-black text-white">이야기의 끝</h2>
              <p class="text-slate-300 mt-2">이 모험이 마음에 드셨나요?</p>
              <button 
                on:click={handleInspirationClick}
                class="mt-8 flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105">
                <Icon name="sparkle" />
                이 모험에 영감 받아 새 이야기 만들기!
              </button>
            </div>
          {/if}
        </div>
        
        <!-- Controls -->
        <div class="flex items-center justify-between w-full max-w-4xl mt-4">
          <button on:click={goToPrevPage} disabled={pageIndex === 0} class="p-2 text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition-colors">
            <Icon name="chevronLeft" className="h-8 w-8" />
          </button>
          <span class="text-slate-300 font-semibold">{pageIndex + 1} / {book.pages.length}</span>
          <button on:click={goToNextPage} disabled={isLastPage} class="p-2 text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition-colors">
            <Icon name="chevronRight" className="h-8 w-8" />
          </button>
        </div>

        <!-- Close Button -->
        <button on:click={onClose} class="absolute top-4 right-4 text-slate-300 hover:text-white bg-black/50 rounded-full p-2">
          <Icon name="plus" className="h-6 w-6 transform rotate-45" />
        </button>
      {/if}
    </div>
  {/if}
</dialog>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.9);
  }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  .animate-fade-in { animation: fade-in 0.5s forwards; }
  @keyframes fade-in-up { 
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fade-in-up 0.6s 0.2s both ease-out; }
</style>
