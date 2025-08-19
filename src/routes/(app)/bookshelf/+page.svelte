<script lang="ts">
  import Bookshelf from '$lib/components/app/Bookshelf.svelte';
  
  /** @type {import('./$types').PageData} */
  let { data } = $props();

  function handleSetMasterpiece(bookId: string) {
    alert(`Book ${bookId} has been set as a masterpiece.`);
    // In a real app, you'd call an API to update this in the database.
  }

  function handleStartNewStory() {
    alert(`Starting a new story.`);
    // In a real app, you'd navigate to the creation page with this book's context.
  }
</script>


<Bookshelf 
  books={data.books}
  onSetMasterpiece={handleSetMasterpiece}
  onStartNewStory={handleStartNewStory}
/>
