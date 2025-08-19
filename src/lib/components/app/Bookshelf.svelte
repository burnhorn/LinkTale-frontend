<script lang="ts">
  import { browser } from '$app/environment';
  import type { StoryBook, ChatMessage, CreationHistoryEntry } from '../../types';
  import Icon from '$lib/Icon.svelte';
  import BookSpine from './BookSpine.svelte';
  import EmptySlot from './EmptySlot.svelte';
  import DirectorsCutView from './DirectorsCutView.svelte';

  export let books: StoryBook[] = [];
  export let onSetMasterpiece: (bookId: string) => void = () => {};
  export let onStartNewStory: () => void = () => {};

  let selectedBook: StoryBook | null = null;
  let viewingHistory: ChatMessage[] | null = null;
  let bookDetailDialog: HTMLDialogElement;

  $: if (browser && bookDetailDialog) {
    if (selectedBook && !bookDetailDialog.open) {
      bookDetailDialog.showModal();
    } else if (!selectedBook && bookDetailDialog.open) {
      bookDetailDialog.close();
    }
  }

  function handleDialogClick(event: MouseEvent) {
    if (event.target === bookDetailDialog) {
      selectedBook = null;
    }
  }

  $: shelves = (() => {
    const sortedBooks = [...books].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const result = [];
    // A large number to ensure all books are on one "shelf" for horizontal scrolling
    const booksPerShelf = 100; 
    for (let i = 0; i < sortedBooks.length; i += booksPerShelf) {
      result.push(sortedBooks.slice(i, i + booksPerShelf));
    }
    return result;
  })();

  function handleSetMasterpieceClick() {
    if (selectedBook) {
      onSetMasterpiece(selectedBook.id);
      // Optimistic update
      selectedBook.isMasterpiece = !selectedBook.isMasterpiece;
      selectedBook = selectedBook;
    }
  }

  function handleViewCreationHistory() {
    if (!selectedBook) return;
    viewingHistory = selectedBook.creationHistory.map((entry, i) => ({
      id: `ch-${i}`,
      sender: entry.sender,
      text: entry.text,
      timestamp: new Date(),
    }));
  }
</script>

<div class="w-full h-full flex flex-col bg-slate-900 overflow-y-auto" id="bookshelf-container">
  <main class="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
    <!-- Header (now inside the main content flow) -->
    <div class="mb-8 flex-shrink-0">
      <div class="flex items-center text-slate-300">
        <!-- <Icon name="bookshelf" className="h-8 w-8 text-cyan-400 mr-4" /> -->
        <div>
          <h1 class="text-3xl font-bold text-white">📚 나의 책장</h1>
          <p class="text-slate-400 mt-1">나만의 창작 갤러리</p>
        </div>
      </div>
    </div>

    <!-- Bookshelves Container -->
    <div class="space-y-12 flex-grow flex flex-col">
      {#if books.length === 0}
        <div class="flex-grow flex flex-col items-center justify-center text-center text-slate-500 rounded-lg border-2 border-dashed border-slate-700 py-20">
          <Icon name="bookOpen" className="h-24 w-24 mb-4" />
          <h2 class="text-2xl font-semibold text-slate-300">아직 만들어진 책이 없어요</h2>
          <p class="mt-2">새로운 이야기를 시작하고 첫 번째 책을 만들어보세요!</p>
          <button
            on:click={onStartNewStory}
            class="mt-8 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            <Icon name="plus" className="h-5 w-5" />
            <span>새 이야기 시작하기</span>
          </button>
        </div>
      {:else}
        {#each shelves as shelfBooks, index (index)}
          <div class="space-y-4">
            <div class="flex items-center bg-black/20 rounded-lg p-4 shadow-inner min-h-[40rem] space-x-4 justify-center">
              {#each shelfBooks as book (book.id)}
                <BookSpine {book} onSelect={() => selectedBook = book} />
              {/each}
              <div class="ml-4 flex-shrink-0">
                <EmptySlot on:click={onStartNewStory} />
              </div>
            </div>
            <div class="h-4 bg-gradient-to-b from-black/40 to-transparent rounded-b-lg -mt-4"></div>
          </div>
        {/each}
      {/if}
    </div>
  </main>
  
  <!-- Modal -->
  <dialog bind:this={bookDetailDialog} on:close={() => (selectedBook = null)} on:click={handleDialogClick} class="bg-transparent p-0 flex items-center justify-center">
    {#if selectedBook}
      <div
        class="relative bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex overflow-hidden animate-fade-in-scale"
      >
        <button
          on:click={() => (selectedBook = null)}
          class="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-700/50 rounded-full p-1 z-50"
        >
          <Icon name="plus" className="h-6 w-6 transform rotate-45" />
        </button>

        <div class="w-1/3 flex-shrink-0 bg-slate-900">
          <img src={selectedBook.coverImageUrl} alt={selectedBook.title} class="w-full h-full object-cover" />
        </div>

        <div class="w-2/3 flex flex-col">
          <div class="p-8 flex-1 overflow-y-auto">
            <h2 class="text-4xl font-bold text-white">{selectedBook.title}</h2>
            <p class="text-slate-400 mt-2 text-lg">{selectedBook.summary}</p>

            <div class="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-sm text-slate-500">만든 날짜</p>
                <p class="text-lg font-semibold text-white">
                  {new Date(selectedBook.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div>
                <p class="text-sm text-slate-500">총 페이지 수</p>
                <p class="text-lg font-semibold text-white">{selectedBook.pages.length}</p>
              </div>
              <div>
                <p class="text-sm text-slate-500">주요 등장인물</p>
                <p class="text-lg font-semibold text-white truncate">{selectedBook.mainCharacters.join(', ')}</p>
              </div>
            </div>
            <div class="mt-8 border-t border-slate-700 pt-6">
              <h4 class="font-bold text-slate-200 mb-2">AI 편집장의 따뜻한 메모 ✍️</h4>
              <div class="bg-yellow-100/10 border border-yellow-200/20 text-yellow-100 p-4 rounded-lg italic">
                "감독님, 이 작품을 함께 만들 때가 생각나네요. 특히 마지막에 주인공이 용기를 냈던 장면은 정말 감동이었어요. 다시 한번 감상해 보시죠!"
              </div>
            </div>
          </div>

          <div class="p-6 bg-slate-900/50 border-t border-slate-700 grid grid-cols-2 gap-4">
            <div class="grid grid-cols-2 grid-rows-2 gap-2">
              <button
                on:click={() => alert('읽기 기능은 준비 중입니다!')}
                class="flex flex-col items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
              >
                <Icon name="bookOpen" className="h-6 w-6 mb-1" />
                <span class="text-xs font-semibold">지금 읽기</span>
              </button>
              <button
                on:click={() => alert('이어쓰기 기능은 준비 중입니다!')}
                class="flex flex-col items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
              >
                <Icon name="pencil" className="h-6 w-6 mb-1" />
                <span class="text-xs font-semibold">이어쓰기</span>
              </button>
              <button
                on:click={() => alert('공유 링크가 복사되었습니다!')}
                class="flex flex-col items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white"
              >
                <Icon name="share2" className="h-6 w-6 mb-1" />
                <span class="text-xs font-semibold">공유하기</span>
              </button>
              <button
                on:click={handleViewCreationHistory}
                disabled={!selectedBook.creationHistory || selectedBook.creationHistory.length === 0}
                class="flex flex-col items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="film" className="h-6 w-6 mb-1" />
                <span class="text-xs font-semibold">제작 과정</span>
              </button>
            </div>
            <button
              on:click={handleSetMasterpieceClick}
              class={`w-full flex items-center justify-center gap-3 font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 ${
                selectedBook.isMasterpiece
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <Icon
                name="star"
                className={`h-6 w-6 transition-all ${
                  selectedBook.isMasterpiece ? 'text-white' : 'text-yellow-400'
                }`}
              />
              {selectedBook.isMasterpiece ? '대표작에서 내리기' : '대표작으로 설정'}
            </button>
          </div>
        </div>
      </div>
    {/if}
  </dialog>
  
  <DirectorsCutView
    open={!!viewingHistory}
    history={viewingHistory || []}
    onClose={() => (viewingHistory = null)}
  />
</div>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.8);
  }
  @keyframes fade-in-scale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards ease-out; }

  /* Custom scrollbar for webkit browsers */
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }
  .overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
  }
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.3);
  }

  .overflow-x-auto::-webkit-scrollbar {
    height: 8px;
  }
  .overflow-x-auto::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
  }
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
  }
  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.3);
  }
</style>
