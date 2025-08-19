<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import type { IconName } from '$lib/icons';

  export let title: string;
  export let value: string;
  export let iconName: IconName;
  export let iconColor: string = 'text-cyan-400';
  export let change: string | undefined = undefined;
  export let isPositive: boolean | undefined = undefined;
</script>

<div class="bg-slate-800 p-6 rounded-lg shadow-md">
  <div class="flex items-center">
    <div class="p-3 rounded-full bg-slate-700">
      <Icon name={iconName} className={`h-6 w-6 ${iconColor}`} />
    </div>
    <p class="ml-4 text-slate-400">{title}</p>
  </div>
  <div class="mt-4 flex items-baseline">
    <p class="text-3xl font-bold text-white">{value}</p>
    {#if change !== undefined && isPositive !== undefined}
      <span class="ml-2 text-sm font-semibold" class:text-green-400={isPositive} class:text-red-400={!isPositive}>
        {isPositive ? '▲' : '▼'} {change}
      </span>
    {/if}
  </div>
</div>