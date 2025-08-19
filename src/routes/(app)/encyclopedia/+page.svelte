<script lang="ts">
  import Encyclopedia from '$lib/components/app/Encyclopedia.svelte';
  
  /** @type {import('./$types').PageData} */
  let { data } = $props();

  function handleStartStory(itemName: string) {
    alert(`Starting a new story with: ${itemName}`);
  }
</script>

<div class="p-4 md:p-8 h-full">
  <Encyclopedia
    items={data.items}
    onStartStory={handleStartStory}
  />
</div>
