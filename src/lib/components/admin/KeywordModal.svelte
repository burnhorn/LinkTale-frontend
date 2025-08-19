<script lang="ts">
  import type { StoryBook } from '$lib/types';
  import Icon from '$lib/Icon.svelte';

  export let open: boolean = false;
  export let keyword: string;
  export let stories: StoryBook[];
  export let onClose: () => void = () => {};

  let dialog: HTMLDialogElement;

  $: if (dialog && open) {
    dialog.showModal();
  } else if (dialog && !open) {
    dialog.close();
  }

  function handleDialogClose() {
    onClose();
  }
  
  function handleBackdropClick(event: MouseEvent) {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      handleDialogClose();
    }
  }
</script>

{#if open}
<dialog
  bind:this={dialog}
  on:close={handleDialogClose}
  on:click={handleBackdropClick}
  class="bg-transparent p-4 backdrop:bg-black/70 fixed inset-0 z-50 flex items-center justify-center"
>
  <div
    class="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
  >
    <div class="flex items-center justify-between p-4 border-b border-slate-700">
      <h3 class="text-lg font-bold text-white">
        키워드 '{keyword}' 관련 이야기 ({stories.length}개)
      </h3>
      <button on:click={handleDialogClose} class="p-1 rounded-full text-slate-400 hover:text-white">
        <Icon name="x" className="w-5 h-5" />
      </button>
    </div>
    <div class="p-4 overflow-y-auto space-y-3">
      {#if stories.length > 0}
        {#each stories as story}
          <div class="flex items-center gap-4 p-2 bg-slate-900/50 rounded-md">
            <img src={story.coverImageUrl} alt={story.title} class="w-10 h-14 object-cover rounded-sm" />
            <div>
              <p class="font-semibold text-white">{story.title}</p>
              <p class="text-sm text-slate-400">by {story.authorName}</p>
            </div>
          </div>
        {/each}
      {:else}
        <p class="text-slate-400 text-center py-8">관련된 이야기가 없습니다.</p>
      {/if}
    </div>
    <div class="p-4 border-t border-slate-700 text-right">
      <button on:click={handleDialogClose} class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
        닫기
      </button>
    </div>
  </div>
</dialog>
{/if}

