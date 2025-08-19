<script lang="ts">
  import MainContent from '$lib/components/app/MainContent.svelte';
  import { storyPages } from '$lib/stores';

  function handlePageChange(pageIndex: number) {
    // This is a placeholder for actual page change logic
    console.log('Page changed to:', pageIndex);
  }
</script>


<MainContent 
  pages={$storyPages} 
  onPageChange={handlePageChange} 
/>
