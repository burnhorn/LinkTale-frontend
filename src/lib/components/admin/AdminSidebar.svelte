<script lang="ts">
  import { page } from '$app/stores';
  import Icon from '$lib/Icon.svelte';
  import type { IconName } from '$lib/icons';

  interface MenuItem {
    href: string;
    label: string;
    iconName: IconName;
  }

  const menuItems: MenuItem[] = [
    { href: '/admin', label: '대시보드', iconName: 'home' },
    { href: '/admin/users', label: '사용자 관리', iconName: 'users' },
    { href: '/admin/content', label: '콘텐츠 분석', iconName: 'documentText' },
    { href: '/admin/revenue', label: '수익 분석', iconName: 'currency' },
    { href: '/admin/settings', label: '설정', iconName: 'cog' },
  ];
</script>

<aside class="w-64 bg-slate-900 p-4 flex-shrink-0 border-r border-slate-700 h-full flex flex-col">
  <a href="/admin" class="text-white text-2xl font-bold mb-8 px-4">Admin Panel</a>
  <nav class="flex flex-col space-y-2 text-slate-300">
    {#each menuItems as item}
      <a 
        href={item.href} 
        class="flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors"
        class:bg-slate-700={$page.url.pathname === item.href}
        class:text-white={$page.url.pathname === item.href}
        class:hover:bg-slate-700={!($page.url.pathname === item.href)}
        class:hover:text-white={!($page.url.pathname === item.href)}
      >
        <Icon name={item.iconName} className="w-5 h-5" />
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>
</aside>
