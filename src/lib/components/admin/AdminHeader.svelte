<script lang="ts">
  import Icon from '$lib/Icon.svelte';

  export let onToggle: () => void = () => {};
</script>

<div class="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
  <button on:click={onToggle} class="text-white p-2" aria-label="Toggle sidebar">
    <Icon name="menu" class="w-6 h-6" />
  </button>
  <h1 class="text-xl font-bold text-white">Admin Menu</h1>
  <div class="w-8"></div> <!-- Spacer -->
</div>
