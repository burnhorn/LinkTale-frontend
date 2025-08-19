<script lang="ts">
  import { browser } from '$app/environment';
  import type { CreationHistoryEntry } from '../../types';
  import Icon from '$lib/Icon.svelte';

  export let history: CreationHistoryEntry[];
  export let open: boolean = false;
  export let onClose: () => void = () => {};

  let dialog: HTMLDialogElement;

  $: if (browser && dialog) {
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }

  function handleDialogClick(event: MouseEvent) {
    if (event.target === dialog) {
      onClose();
    }
  }
</script>

<dialog 
  bind:this={dialog}
  on:close={onClose}
  on:click={handleDialogClick}
  aria-labelledby="directors-cut-title"
  class="bg-transparent p-0"
>
  <div 
    class="bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden animate-fade-in" 
  >
    <div class="flex-shrink-0 p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon name="bookOpen" class="h-6 w-6 text-cyan-400" />
        <h2 id="directors-cut-title" class="text-xl font-bold text-white">🎬 제작 과정 (Director's Cut)</h2>
      </div>
      <button on:click={onClose} class="text-slate-400 hover:text-white bg-slate-700/50 rounded-full p-1">
        <Icon name="x" class="h-6 w-6" />
      </button>
    </div>
    
    <div class="flex-1 p-4 overflow-y-auto space-y-4">
      {#each history as msg, index (index)}
        <div class="flex items-end gap-2" class:justify-end={msg.sender === 'user'} class:justify-start={msg.sender === 'ai'}>
          {#if msg.sender === 'ai'}
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Icon name="sparkle" class="h-5 w-5 text-cyan-400"/>
            </div>
          {/if}
          <div 
            class="max-w-xs md:max-w-sm rounded-xl px-4 py-2.5"
            class:bg-blue-600={msg.sender === 'user'} 
            class:text-white={msg.sender === 'user'} 
            class:rounded-br-none={msg.sender === 'user'} 
            class:bg-slate-700={msg.sender === 'ai'} 
            class:text-slate-200={msg.sender === 'ai'} 
            class:rounded-bl-none={msg.sender === 'ai'}
          >
            <p class="text-sm leading-relaxed">{msg.text ?? ''}</p>
          </div>
          {#if msg.sender === 'user'}
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Icon name="user" class="h-6 w-6 text-white"/>
            </div>
          {/if}
        </div>
      {/each}
      <div class="text-center pt-4 text-slate-500">-- 제작 기록의 끝 --</div>
    </div>
  </div>
</dialog>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.8);
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in { animation: fade-in 0.3s forwards; }
</style>

