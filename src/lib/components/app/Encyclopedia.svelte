<script lang="ts">
  import { browser } from '$app/environment';
  import type { WorldAsset, WorldAssetCategory } from '../../types';
  import Icon from '$lib/Icon.svelte';
  import type { IconName } from '$lib/icons';

  export let items: WorldAsset[] = [];
  export let onStartStory: (itemName: string) => void = () => {};

  const CATEGORY_CONFIG: { [key in WorldAssetCategory]: { label: string; iconName: IconName; color: string } } = {
    character: { label: '등장인물', iconName: 'user', color: 'text-blue-400' },
    place: { label: '장소', iconName: 'castle', color: 'text-green-400' },
    item: { label: '아이템', iconName: 'sword', color: 'text-yellow-400' },
    ability: { label: '마법/능력', iconName: 'sparkle', color: 'text-purple-400' },
  };

  let searchQuery = '';
  let activeCategory: WorldAssetCategory | 'all' = 'all';
  let sortOrder: 'newest' | 'oldest' | 'name' = 'newest';
  let selectedItem: WorldAsset | null = null;
  let encyclopediaDialog: HTMLDialogElement;

  $: if (browser && encyclopediaDialog) {
    if (selectedItem && !encyclopediaDialog.open) {
      encyclopediaDialog.showModal();
    } else if (!selectedItem && encyclopediaDialog.open) {
      encyclopediaDialog.close();
    }
  }

  function handleDialogClick(event: MouseEvent) {
    if (event.target === encyclopediaDialog) {
      selectedItem = null;
    }
  }

  $: filteredAndSortedItems = (() => {
    let processedItems = [...items];

    if (activeCategory !== 'all') {
      processedItems = processedItems.filter(item => item.category === activeCategory);
    }

    if (searchQuery.trim() !== '') {
      processedItems = processedItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    processedItems.sort((a, b) => {
      switch (sortOrder) {
        case 'name':
          return a.name.localeCompare(b.name, 'ko');
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return processedItems;
  })();
  
  function handleStartStory() {
    if(selectedItem) {
      onStartStory(selectedItem.name);
      selectedItem = null;
    }
  }

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
</script>

<div class="flex-1 flex flex-col bg-slate-800 p-6 overflow-y-auto relative">
  <div class="flex items-center mb-6 text-slate-300">
    <!-- <Icon name="encyclopedia" className="h-8 w-8 text-cyan-400 mr-3" /> -->
    <div>
      <h1 class="text-2xl font-bold text-white">📇 세계관 도감</h1>
      <p class="text-slate-400">내가 만든 세계의 모든 것을 확인해보세요.</p>
    </div>
  </div>

  <!-- Filters and Search -->
  <div class="mb-6 bg-slate-900/50 p-4 rounded-lg sticky top-0 z-10 backdrop-blur-sm">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="relative flex-grow">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        <input
          type="text"
          placeholder="캐릭터나 장소의 이름을 입력해보세요!"
          bind:value={searchQuery}
          class="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      <div class="flex items-center gap-2">
        <select
          bind:value={sortOrder}
          class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 h-full"
        >
          <option value="newest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="name">이름순</option>
        </select>
      </div>
    </div>
    <div class="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
      <button on:click={() => activeCategory = 'all'} class="px-4 py-1.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap" class:bg-cyan-500={activeCategory === 'all'} class:text-white={activeCategory === 'all'} class:bg-slate-700={activeCategory !== 'all'} class:hover:bg-slate-600={activeCategory !== 'all'} class:text-slate-300={activeCategory !== 'all'}>모두</button>
      {#each Object.entries(CATEGORY_CONFIG) as [key, config]}
        <button on:click={() => activeCategory = key as WorldAssetCategory} class="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap" class:bg-cyan-500={activeCategory === key} class:text-white={activeCategory === key} class:bg-slate-700={activeCategory !== key} class:hover:bg-slate-600={activeCategory !== key} class:text-slate-300={activeCategory !== key}>
          <Icon name={config.iconName} className="h-5 w-5" /> {config.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each filteredAndSortedItems as item (item.id)}
      <button on:click={() => selectedItem = item} class="bg-slate-800/50 rounded-lg overflow-hidden shadow-lg group text-left transition-transform transform hover:-translate-y-1 hover:shadow-cyan-500/20">
        <div class="relative aspect-video">
          <img src={item.imageUrl} alt={item.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div class={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full bg-slate-900/70 backdrop-blur-sm ${CATEGORY_CONFIG[item.category].color}`}>
            {CATEGORY_CONFIG[item.category].label}
          </div>
          {#if new Date(item.createdAt) > oneWeekAgo}
            <span class="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-400 text-black animate-pulse">NEW</span>
          {/if}
        </div>
        <div class="p-4">
          <h3 class="font-bold text-lg text-white truncate">{item.name}</h3>
          <p class="text-slate-400 text-sm mt-1 truncate">{item.summary}</p>
        </div>
      </button>
    {/each}
  </div>

  <!-- Modal -->
  <dialog bind:this={encyclopediaDialog} on:close={() => (selectedItem = null)} on:click={handleDialogClick} class="bg-transparent p-0">
    {#if selectedItem}
      <div class="relative bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-fade-in-scale">
        <button on:click={() => selectedItem = null} class="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-700/50 rounded-full p-1 z-20">
          <Icon name="plus" className="h-6 w-6 transform rotate-45" />
        </button>
        
        <!-- Left Column: Image -->
        <div class="w-full md:w-1/3 flex-shrink-0 bg-slate-900 h-80 md:h-auto">
          <img src={selectedItem.imageUrl} alt={selectedItem.name} class="w-full h-full object-contain" />
        </div>

        <!-- Right Column: Content -->
        <div class="w-full md:w-2/3 flex flex-col">
          <div class="p-6 flex-1 overflow-y-auto">
            <h2 class="text-3xl font-bold text-white">{selectedItem.name}</h2>
            <div class={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full mt-2 bg-slate-700 ${CATEGORY_CONFIG[selectedItem.category].color}`}>
              <Icon name={CATEGORY_CONFIG[selectedItem.category].iconName} className="h-5 w-5" />
              {CATEGORY_CONFIG[selectedItem.category].label}
            </div>
            <p class="mt-4 text-slate-300 leading-relaxed">{selectedItem.description}</p>
            
            {#if selectedItem.appearanceHistory.length > 0}
              <div class="mt-6">
                <h4 class="font-bold text-slate-200">출현 기록:</h4>
                <ul class="mt-2 space-y-1 text-sm list-disc list-inside text-slate-400">
                  {#each selectedItem.appearanceHistory as app}
                    <li>
                      <span class="text-cyan-400">{app.storyTitle}</span> - {app.pageNumber} 페이지
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>

          <div class="p-6 bg-slate-900/50 border-t border-slate-700">
            <button on:click={handleStartStory} class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              이것으로 새 이야기 시작하기!
            </button>
          </div>
        </div>
      </div>
    {/if}
  </dialog>
</div>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(2px);
  }
  @keyframes fade-in-scale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in-scale {
    animation: fade-in-scale 0.3s forwards;
  }
</style>
