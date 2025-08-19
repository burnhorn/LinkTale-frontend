<script lang="ts">
  import type { StoryBook } from '../../types';
  import StoryCard from './StoryCard.svelte';
  import Icon from '$lib/Icon.svelte';

  export let title: string;
  export let icon: string; // Emoji or other string
  export let books: StoryBook[];
  export let onClick: (book: StoryBook) => void = () => {};

  let scrollContainer: HTMLDivElement;

  function scroll(direction: 'left' | 'right') {
    if (scrollContainer) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
</script>

<div class="py-4">
  <div class="flex items-center justify-between mb-3 px-2">
    <h2 class="flex items-center gap-2 text-2xl font-bold text-white">
      <span>{icon}</span> {title}
    </h2>
    <div class="flex gap-2">
      <button on:click={() => scroll('left')} class="p-1 rounded-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"><Icon name="chevronLeft" /></button>
      <button on:click={() => scroll('right')} class="p-1 rounded-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"><Icon name="chevronRight" /></button>
    </div>
  </div>
  <div bind:this={scrollContainer} class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
    {#each books as book (book.id)}
      <StoryCard {book} on:click={() => onClick(book)} />
    {/each}
  </div>
</div>

<style>
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
</style>
