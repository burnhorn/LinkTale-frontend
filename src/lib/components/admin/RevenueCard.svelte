<script lang="ts">
  export let title: string;
  export let value: number;
  export let period: string;

  // Format number as currency
  const formattedValue = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
</script>

<div class="bg-slate-800 p-6 rounded-lg shadow-md">
  <p class="text-slate-400">{period} {title}</p>
  <p class="mt-4 text-3xl font-bold text-white">{formattedValue}</p>
</div>
