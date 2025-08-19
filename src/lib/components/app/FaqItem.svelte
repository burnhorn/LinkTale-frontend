<script lang="ts">
  import Icon from '$lib/Icon.svelte';

  export let q: string;
  export let a: string;

  let isOpen = false;
</script>

<div class="border-b border-slate-700">
  <button on:click={() => (isOpen = !isOpen)} class="w-full flex justify-between items-center text-left py-4">
    <span class="font-semibold text-slate-200">{q}</span>
    <Icon name="chevronDown" className={`h-6 w-6 text-slate-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
  </button>
  <div class="overflow-hidden transition-all duration-300 ease-in-out" class:max-h-96={isOpen} class:max-h-0={!isOpen}>
    <p class="text-slate-300 pb-4 pr-6">{a}</p>
  </div>
</div>
