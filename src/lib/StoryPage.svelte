<script lang="ts">
  import type { StoryPage as StoryPageType } from '$lib/types';

  export let page: StoryPageType;
  export let pageNumber: number;
  export let totalPages: number;
</script>

<div class="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl h-full flex flex-col animate-fadeIn">
  <header class="mb-4">
    {#if page.title && pageNumber === 1} <!-- Show title only on first page or if explicitly set for page -->
      <h2 class="text-2xl md:text-3xl font-bold text-brand-accent mb-1">{page.title}</h2>
    {/if}
    {#if page.prompt}
      <p class="text-xs text-brand-text-dark italic">AI의 응답: "{page.prompt}"</p>
    {/if}
  </header>

  <div class="flex-grow overflow-y-auto prose prose-sm md:prose-base prose-invert max-w-none prose-p:text-slate-200 prose-headings:text-brand-primary">
    {#if page.type === 'text'}
      {#each page.content.split(/\n{2,}/) as paragraph} <!-- Split by double newlines for paragraphs -->
        <p class="mb-3 leading-relaxed">{paragraph.trim()}</p>
      {/each}
    {:else if page.type === 'image'}
      <div class="my-4 flex flex-col items-center">
        <img 
          src={page.content} 
          alt={page.imageCaption || `AI 생성 이미지: ${page.prompt}`}
          class="max-w-full h-auto max-h-[60vh] md:max-h-[50vh] rounded-lg shadow-lg object-contain border-4 border-slate-700"
        />
        {#if page.imageCaption}
          <p class="mt-3 text-sm text-center text-slate-400 italic">{page.imageCaption}</p>
        {/if}
      </div>
    {/if}
  </div>

  <footer class="mt-auto pt-4 text-center">
    <p class="text-xs text-brand-text-dark">페이지 {pageNumber} / {totalPages}</p>
  </footer>
</div>

<style>
  /* .prose { */
    /* You can further customize prose styles here if needed */
  /* } */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
</style>