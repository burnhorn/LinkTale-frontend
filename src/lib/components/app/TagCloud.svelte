<script lang="ts">
  export let tags: string[];
  export let activeTag: string | null;
  export let onTagClick: (tag: string) => void = () => {};
</script>

<div class="py-6 px-2">
  <h2 class="flex items-center gap-2 text-2xl font-bold text-white mb-4">
    🧭 영감의 나침반
  </h2>
  <div class="flex flex-wrap gap-3">
    <button 
      on:click={() => onTagClick('')} 
      class="px-4 py-1.5 text-sm font-semibold rounded-full transition-colors"
      class:bg-cyan-500={!activeTag}
      class:text-white={!activeTag}
      class:shadow-lg={!activeTag}
      class:bg-slate-700={!!activeTag}
      class:hover:bg-slate-600={!!activeTag}
      class:text-slate-300={!!activeTag}
    >
      #전체
    </button>
    {#each tags as tag}
      <button 
        on:click={() => onTagClick(tag)} 
        class="px-4 py-1.5 text-sm font-semibold rounded-full transition-colors"
        class:bg-cyan-500={activeTag === tag}
        class:text-white={activeTag === tag}
        class:shadow-lg={activeTag === tag}
        class:bg-slate-700={activeTag !== tag}
        class:hover:bg-slate-600={activeTag !== tag}
        class:text-slate-300={activeTag !== tag}
      >
        {tag}
      </button>
    {/each}
  </div>
</div>
