<script lang="ts">
  import PricingPage from '$lib/components/app/PricingPage.svelte';
  
  /** @type {import('./$types').PageData} */
  let { data } = $props();

</script>

<PricingPage 
  plans={data.plans}
  faqs={data.faqs}
/>
