<script lang="ts">
  import type { IconName } from '$lib/icons';
  import Icon from '$lib/Icon.svelte';

  export let active = false;
  export let label: string;
  export let iconName: IconName;
  export let href: string | null = null;
</script>

{#if href}
  <a 
    {href}
    class="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left"
    class:bg-slate-700={active}
    class:text-white={active}
    class:text-slate-300={!active}
    class:hover:bg-slate-700={!active}
    class:hover:text-white={!active}
    aria-current={active ? 'page' : undefined}
  >
    <Icon name={iconName} className="h-5 w-5" />
    <span class="ml-3">{label}</span>
  </a>
{:else}
  <button 
    type="button"
    on:click
    class="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left"
    class:bg-slate-700={active}
    class:text-white={active}
    class:text-slate-300={!active}
    class:hover:bg-slate-700={!active}
    class:hover:text-white={!active}
  >
    <Icon name={iconName} className="h-5 w-5" />
    <span class="ml-3">{label}</span>
  </button>
{/if}
