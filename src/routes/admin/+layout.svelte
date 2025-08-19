<script lang="ts">
  import { page } from '$app/stores';
  import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import { fly, fade } from 'svelte/transition';

  let { children } = $props();
  let isMobileAdminMenuOpen = $state(false);

  function toggleMobileAdminMenu() {
    isMobileAdminMenuOpen = !isMobileAdminMenuOpen;
  }

  // 페이지 이동 시 모바일 메뉴 닫기
  $effect(() => {
    if ($page.url.pathname) {
      isMobileAdminMenuOpen = false;
    }
  });
</script>

<div class="flex h-screen bg-gray-900 text-white">
  <!-- Desktop Sidebar -->
  <div class="hidden md:block flex-shrink-0">
    <AdminSidebar />
  </div>

  <div class="flex-1 flex flex-col min-w-0">
    <!-- Mobile Header -->
    <div class="md:hidden">
      <AdminHeader onToggle={toggleMobileAdminMenu} />
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
      {@render children()}
    </main>
  </div>
</div>

<!-- Mobile Sidebar (Overlay) -->
{#if isMobileAdminMenuOpen}
  <button
    transition:fade={{ duration: 200 }}
    class="md:hidden fixed inset-0 bg-black/60 z-40"
    onclick={toggleMobileAdminMenu}
    aria-label="Close admin menu"
  ></button>
  <div transition:fly={{ x: -300, duration: 300 }} class="md:hidden fixed top-0 left-0 bottom-0 z-50">
    <AdminSidebar />
  </div>
{/if}
