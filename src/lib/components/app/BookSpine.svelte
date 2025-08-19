<script lang="ts">
  import type { StoryBook } from '../../types';
  import { onMount } from 'svelte';
  import Icon from '$lib/Icon.svelte';

  export let book: StoryBook;
  export let onSelect: () => void = () => {};

  const bookColors = [
    'bg-red-700', 'bg-blue-700', 'bg-green-700', 'bg-yellow-700', 'bg-indigo-700', 'bg-purple-700', 'bg-pink-700',
    'bg-red-800', 'bg-blue-800', 'bg-green-800', 'bg-yellow-800', 'bg-indigo-800', 'bg-purple-800', 'bg-pink-800',
  ];

  let color = '';
  onMount(() => {
    color = bookColors[Math.floor(Math.random() * bookColors.length)];
  });

  const isRecent = new Date().getTime() - new Date(book.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
  const isOld = new Date().getTime() - new Date(book.createdAt).getTime() > 30 * 24 * 60 * 60 * 1000;

  function handleDustOff(event: MouseEvent) {
    onSelect();
    const target = event.currentTarget as HTMLElement;
    const dustEffect = target.querySelector('.dust-effect');
    if (dustEffect) {
      dustEffect.classList.add('puff');
      setTimeout(() => {
        dustEffect.classList.remove('puff');
      }, 1000);
    }
  }
</script>

<div class="relative group flex-shrink-0">
  <button
    on:click={isOld && !book.isMasterpiece ? handleDustOff : onSelect}
    class="h-64 w-12 {color} m-1 rounded-md shadow-lg text-white font-bold flex items-center justify-center relative overflow-hidden transition-all duration-300 ease-in-out transform-gpu hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:z-10"
  >
    <span 
      class="absolute top-0 left-0 right-0 h-4 bg-black/20"
      style="clip-path: polygon(0 0, 100% 0, 100% 50%, 0 100%)"
    ></span>
    <span
      class="writing-mode-v-rl transform p-2 text-sm whitespace-nowrap overflow-hidden text-shadow"
    >
      {book.title}
    </span>
    
    {#if book.isMasterpiece}
      <Icon name="sparkle" className="absolute bottom-3 w-6 h-6 text-yellow-300 animate-pulse drop-shadow-lg" />
    {/if}
    
    {#if isRecent && !isOld}
      <div class="absolute -top-1 -right-3 w-16 h-6 bg-cyan-400 text-black text-xs font-bold transform rotate-45 flex items-center justify-center shadow-lg">NEW</div>
    {/if}
    
    {#if isOld && !book.isMasterpiece}
      <div class="dust-effect absolute inset-0 bg-black/30 backdrop-filter backdrop-grayscale-[0.4] group-hover:hidden transition-opacity duration-300"></div>
    {/if}
    <span class="absolute bottom-0 left-0 right-0 h-2 bg-black/20"></span>
  </button>
  <!-- Tooltip -->
  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
    <img src={book.coverImageUrl} alt={book.title} class="w-full h-40 object-cover rounded-md mb-2" />
    <h4 class="font-bold text-white truncate">{book.title}</h4>
    <p class="text-slate-400 text-sm">{book.summary}</p>
    <div class="absolute w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-700 -bottom-2 left-1/2 -translate-x-1/2"></div>
  </div>
</div>

<style>
  .writing-mode-v-rl { writing-mode: vertical-rl; }
  .text-shadow { text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7); }
  .dust-effect.puff {
      animation: puff-out 1s ease-out forwards;
  }
  @keyframes puff-out {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.5); }
  }
</style>
