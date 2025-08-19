<script lang="ts">
  import AdventurePlaza from '$lib/components/app/AdventurePlaza.svelte';
  
  /** @type {import('./$types').PageData} */
  let { data } = $props();

  function handleReadBook(bookId: string) {
    alert(`Reading book: ${bookId}`);
  }

  function handleLikeBook(bookId: string) {
    alert(`Liked book: ${bookId}`);
    // Optimistic update could be handled here if needed
  }
</script>

<AdventurePlaza 
  books={data.books}
  onReadBook={handleReadBook}
  onLikeBook={handleLikeBook}
/>

