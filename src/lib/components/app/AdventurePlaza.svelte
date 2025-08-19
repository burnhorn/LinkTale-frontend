<script lang="ts">
  import type { StoryBook } from '../../types';
  import StoryCard from './StoryCard.svelte';
  import PlazaRow from './PlazaRow.svelte';
  import TagCloud from './TagCloud.svelte';
  import Icon from '$lib/Icon.svelte';
  import { onMount, onDestroy } from 'svelte';

  export let books: StoryBook[] = [];
  export let onReadBook: (bookId: string) => void = () => {};
  export let onLikeBook: (bookId:string) => void = () => {};

  let modalBook: StoryBook | null = null;
  let activeTag: string;
  let dialog: HTMLDialogElement;

  // Memoized values using reactive statements
  $: masterpiece = books.find(b => b.isMasterpiece);
  $: trendingBooks = [...books].sort((a,b) => (b.views / 2 + b.likes) - (a.views / 2 + a.likes)).slice(0, 10);
  $: hallOfFameBooks = [...books].sort((a, b) => b.likes - a.likes).slice(0, 10);
  
  $: allTags = (() => {
    const tagSet = new Set<string>();
    books.forEach(book => book.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  })();
  
  $: taggedBooks = (() => {
    if (!activeTag) return null;
    return books.filter(book => book.tags.includes(activeTag));
  })();

  function handleLikeClick() {
    if(modalBook) {
      onLikeBook(modalBook.id);
      // Optimistic update
      modalBook.likes += 1;
      modalBook = modalBook;
    }
  }
  
  function handleReadClick() {
    if (modalBook) {
      onReadBook(modalBook.id);
      closeModal();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function handleDialogClick(event: MouseEvent) {
    if (event.target === dialog) {
      closeModal();
    }
  }

  function openModal(book: StoryBook) {
    modalBook = book;
    dialog?.showModal();
  }

  function closeModal() {
    dialog?.close();
  }

  function handleDialogClose() {
    modalBook = null;
  }

</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex-1 flex flex-col bg-slate-800 overflow-y-auto">
  <div class="p-6">
    <!-- Hero Section -->
    {#if masterpiece}
      <button type="button" class="relative rounded-xl overflow-hidden mb-8 group cursor-pointer text-left w-full" on:click={() => onReadBook(masterpiece.id)}>
        <img src={masterpiece.coverImageUrl} alt={masterpiece.title} class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-8 text-white">
          <h2 class="text-sm font-bold tracking-widest uppercase text-cyan-300">✨ 이달의 최고 모험 이야기</h2>
          <h1 class="text-4xl font-black mt-2">{masterpiece.title}</h1>
          <p class="mt-2 max-w-lg text-slate-300">{masterpiece.summary}</p>
        </div>
      </button>
    {/if}
    
    {#if taggedBooks}
      <div class="py-4">
        <h2 class="flex items-center gap-2 text-2xl font-bold text-white mb-4 px-2">
           태그: {activeTag}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {#each taggedBooks as book (book.id)}
            <StoryCard {book} on:click={() => openModal(book)} />
          {/each}
        </div>
      </div>
    {:else}
      <!-- Rows -->
      <PlazaRow title="지금 뜨는 이야기" icon="🔥" books={trendingBooks} onClick={(book) => openModal(book)} />
      <PlazaRow title="명예의 전당" icon="🌟" books={hallOfFameBooks} onClick={(book) => openModal(book)} />
    {/if}

    <!-- Tag Cloud -->
    <TagCloud tags={allTags} {activeTag} onTagClick={(tag) => activeTag = tag} />
  </div>
  
  <!-- Modal -->
  {#if modalBook}
    <dialog bind:this={dialog} on:click={handleDialogClick} on:close={handleDialogClose} class="bg-transparent p-0 m-0 max-w-none max-h-none w-full h-full justify-center items-center">
      <div role="document" class="relative bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-scale">
        <button on:click={closeModal} class="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-700/50 rounded-full p-1 z-10">
          <Icon name="plus" className="h-6 w-6 transform rotate-45" />
        </button>
        <div class="flex-shrink-0 h-64 bg-slate-900">
          <img src={modalBook.coverImageUrl} alt={modalBook.title} class="w-full h-full object-cover" />
        </div>
        <div class="p-6 flex-1 overflow-y-auto">
          <h2 id="modal-title" class="text-3xl font-bold text-white">{modalBook.title}</h2>
          <p class="text-slate-400 mt-1">글쓴이: {modalBook.authorName}</p>
          <p class="mt-4 text-slate-300 leading-relaxed">{modalBook.summary}</p>
          <div class="mt-4 flex items-center gap-6 text-slate-300">
            <span class="flex items-center gap-2"><Icon name="bookOpen" className="h-5 w-5" /> {modalBook.pages.length} 페이지</span>
            <span class="flex items-center gap-2"><Icon name="heart" className="h-5 w-5" /> {modalBook.likes.toLocaleString()}</span>
            <span class="flex items-center gap-2"><Icon name="eye" className="h-5 w-5" /> {modalBook.views.toLocaleString()}</span>
          </div>
        </div>
        <div class="p-6 bg-slate-900/50 border-t border-slate-700 grid grid-cols-3 gap-4">
          <button on:click={handleLikeClick} class="flex items-center justify-center gap-2 bg-slate-700 hover:bg-pink-600 hover:text-white text-pink-400 font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105">
            <Icon name="heart" className="h-6 w-6" /> 좋아요!
          </button>
          <button on:click={() => alert(`${modalBook?.authorName}님의 다른 작품을 둘러봅니다.`)} class="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105">
            <Icon name="user" className="h-6 w-6" /> 모험가
          </button>
          <button on:click={handleReadClick} class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 col-span-3 lg:col-span-1">
            이야기 읽기
          </button>
        </div>
      </div>
    </dialog>
  {/if}
</div>

<style>
  @keyframes fade-in-scale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards; }

  dialog::backdrop {
    background: rgba(0,0,0,0.7);
  }
  dialog[open] {
    display: flex;
  }
</style>