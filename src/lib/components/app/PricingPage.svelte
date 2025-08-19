<script lang="ts">
  import PlanCard from './PlanCard.svelte';
  import FaqItem from './FaqItem.svelte';
  import type { Plan, Faq } from '$lib/types';

  export let plans: Plan[];
  export let faqs: Faq[];
</script>

<div class="flex-1 flex flex-col bg-slate-800 overflow-y-auto p-6 md:p-12 items-center">
  <div class="text-center mb-12">
    <h1 class="text-4xl md:text-5xl font-black text-white leading-tight">당신의 상상력을 위한 플랜들</h1>
    <p class="text-lg text-slate-300 mt-4 max-w-2xl">Spark Weaver의 모든 가능성을 열어보고, 세상에 단 하나뿐인 당신의 이야기를 완성하세요.</p>
  </div>
  
  <div class="flex flex-wrap justify-center items-stretch gap-8 w-full">
    {#each plans as p}
      <PlanCard plan={p} />
    {/each}
  </div>

  <div class="w-full max-w-3xl mt-20">
    <h2 class="text-3xl font-bold text-white text-center mb-8">자주 묻는 질문 (FAQ)</h2>
    <div class="bg-slate-900/50 rounded-lg p-4">
      {#each faqs as faq}
        <FaqItem q={faq.q} a={faq.a} />
      {/each}
    </div>
  </div>
  
  <div class="mt-16 text-center text-slate-500">
    <p class="font-semibold">안전한 결제 시스템</p>
    <div class="flex justify-center items-center gap-4 mt-2">
      <span>Visa</span>
      <span>Mastercard</span>
      <span>PayPal</span>
      <span>Toss</span>
    </div>
    <p class="text-xs mt-2">SSL 보안 연결을 통해 안전하게 처리됩니다.</p>
  </div>
</div>
