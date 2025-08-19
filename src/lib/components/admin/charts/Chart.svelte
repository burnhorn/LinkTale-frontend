<!-- src/lib/components/admin/charts/Chart.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import type { ChartConfiguration } from 'chart.js';

  export let config: ChartConfiguration;
  export let className: string | undefined = undefined;

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  onMount(() => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      chart = new Chart(ctx, config);
    }
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });

  // config가 변경될 때 차트를 업데이트하는 로직
  $: if (chart && config) {
    chart.data = config.data;
    // options가 변경될 때 onClick을 포함하여 모든 옵션을 업데이트합니다.
    chart.options = config.options || {};
    chart.update();
  }
</script>

<div class={`w-full h-full ${className || ''}`}>
  <canvas bind:this={canvas}></canvas>
</div>
