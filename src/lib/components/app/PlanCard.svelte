<script lang="ts">
  import Icon from '$lib/Icon.svelte';
  import type { IconName } from '$lib/icons';

  // A simplified type for the plan object, adjust as needed
  export let plan: {
    iconName: IconName;
    title: string;
    description: string;
    price: string;
    benefits: string[];
    cta: string;
    ctaAction?: () => void;
    isCurrent?: boolean;
    isPopular?: boolean;
    colors: {
      bg: string;
      iconBg: string;
      priceBg: string;
      ctaBg: string;
      ctaHoverBg: string;
      ctaText: string;
    };
    subtext?: string;
  };
</script>

<div class={`relative w-full max-w-sm flex flex-col rounded-2xl shadow-lg transition-transform transform hover:-translate-y-2 ${plan.isPopular ? 'border-2 border-violet-400' : 'border border-slate-700'}`}>
  {#if plan.isPopular}
    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-400 text-white text-sm font-bold px-4 py-1 rounded-full shadow-md">
      ⭐ 가장 인기있는 선택
    </div>
  {/if}
  <div class={`p-8 rounded-t-2xl ${plan.colors.bg}`}>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class={`p-3 rounded-full ${plan.colors.iconBg}`}>
          <Icon name={plan.iconName} class="h-6 w-6" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-white">{plan.title}</h3>
          <p class="text-slate-300">{plan.description}</p>
        </div>
      </div>
      <div class={`px-4 py-1 rounded-full text-sm font-bold ${plan.colors.priceBg}`}>{plan.price}</div>
    </div>
  </div>
  <div class="bg-slate-800 p-8 rounded-b-2xl flex-grow flex flex-col">
    <h4 class="font-bold text-slate-200 mb-4">제공 혜택:</h4>
    <ul class="space-y-3 text-slate-300 flex-grow">
      {#each plan.benefits as benefit}
        <li class="flex items-start">
          <Icon name="sparkles" class="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
          <span>{benefit}</span>
        </li>
      {/each}
    </ul>
    <div class="mt-8">
      <button 
        on:click={() => plan.ctaAction && plan.ctaAction()} 
        disabled={plan.isCurrent}
        class={`w-full text-center font-bold py-3 px-6 rounded-lg shadow-lg transition-all ${plan.isCurrent ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : `${plan.colors.ctaBg} ${plan.colors.ctaHoverBg} ${plan.colors.ctaText} transform hover:scale-105`}`}
      >
        {plan.isCurrent ? '✔️ 현재 플랜' : plan.cta}
      </button>
      {#if plan.subtext}
        <p class="text-center text-xs text-slate-500 mt-3">{plan.subtext}</p>
      {/if}
    </div>
  </div>
</div>
