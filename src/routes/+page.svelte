<script lang="ts">
    import Header from "$lib/components/landing/Header.svelte";
    import Hero from "$lib/components/landing/Hero.svelte";
    import Trust from "$lib/components/landing/Trust.svelte";
    import Features from "$lib/components/landing/Features.svelte";
    import SocialProof from "$lib/components/landing/SocialProof.svelte";
    import Faq from "$lib/components/landing/Faq.svelte";
    import FinalCta from "$lib/components/landing/FinalCta.svelte";
    import Footer from "$lib/components/landing/Footer.svelte";
</script>

<Header />
<main>
    <Hero />
    <Trust />
    <Features />
    <SocialProof />
    <Faq />
    <FinalCta />
</main>
<Footer />