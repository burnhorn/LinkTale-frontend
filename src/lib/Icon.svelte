<script lang="ts">
  import { icons, type IconName } from './icons';

  export let name: IconName;
  export let className: string = '';

  $: iconHtml = icons[name];
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  {...$$restProps}
>
  {@html iconHtml}
</svg>
