<script lang="ts">
  import Chart from '$lib/components/admin/charts/Chart.svelte';
  import Icon from '$lib/Icon.svelte';
  import type { StoryBook } from '$lib/types';

  export let data;
  let { users, retentionData, userActionsData } = data;

  // --- State for Search and Sort ---
  let searchTerm = '';
  let sortKey: keyof (typeof users)[0] = 'nickname';
  let sortDirection: 'asc' | 'desc' = 'asc';

  // --- Helper function for 'lastSeen' sorting ---
  function parseLastSeen(lastSeen: string): number {
    const now = new Date();
    const value = parseInt(lastSeen.split(/ |주|일|시간|분/)[0]);
    if (lastSeen.includes('분 전')) {
      return value;
    }
    if (lastSeen.includes('시간 전')) {
      return value * 60;
    }
    if (lastSeen.includes('일 전')) {
      return value * 60 * 24;
    }
    if (lastSeen.includes('주 전')) {
      return value * 60 * 24 * 7;
    }
    return Infinity; // Should not happen
  }

  // --- Reactive Logic for Filtering and Sorting ---
  let filteredUsers = users;
  let retentionChartConfig: ChartConfiguration;
  $: {
    // 1. Filter by search term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(lowerCaseSearch) ||
        user.nickname.toLowerCase().includes(lowerCaseSearch)
      );
    } else {
      filteredUsers = users;
    }

    // 2. Sort the filtered users
    if (sortKey) {
      filteredUsers = [...filteredUsers].sort((a, b) => {
        let aValue: string | number = a[sortKey];
        let bValue: string | number = b[sortKey];

        // Use special parsers for specific columns
        if (sortKey === 'lastSeen') {
          aValue = parseLastSeen(aValue as string);
          bValue = parseLastSeen(bValue as string);
        } else if (sortKey === 'spend') {
          aValue = Number(String(aValue).replace(/[₩,]/g, ''));
          bValue = Number(String(bValue).replace(/[₩,]/g, ''));
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 3. Create a safe chart config on the client-side
    retentionChartConfig = {
      type: 'bar',
      data: retentionData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8' } }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: { color: '#94a3b8' },
            grid: { color: '#334155' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            ticks: { 
              color: '#94a3b8',
              callback: (value: string | number) => `${value}%`
            },
            grid: { drawOnChartArea: false }
          },
          x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
        }
      }
    };
  }

  // --- Event Handlers ---
  function handleSort(key: keyof (typeof users)[0]) {
    if (sortKey === key) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDirection = 'asc';
    }
  }

  function handleViewDetails(userId: number) {
    // In a real app, you would navigate to a user detail page
    // e.g., goto(`/admin/users/${userId}`);
    alert(`사용자 ID ${userId}의 상세 정보를 봅니다.`);
  }
</script>

<h2 class="text-3xl font-bold text-white">사용자 관리</h2>
<p class="text-slate-400 mt-2">사용자 데이터와 활동 패턴을 분석합니다.</p>

<!-- Charts Grid -->
<div class="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
  <div class="lg:col-span-3 flex flex-col gap-8">
    <div class="bg-slate-800 p-6 rounded-lg shadow-md h-96 flex flex-col">
      <h3 class="text-xl font-bold text-white">사용자 리텐션 (최근 7일)</h3>
      <div class="flex-grow mt-4">
        <Chart config={retentionChartConfig} />
      </div>
    </div>
  </div>
  <div class="lg:col-span-2 flex flex-col gap-8">
    <div class="bg-slate-800 p-6 rounded-lg shadow-md h-96 flex flex-col">
      <h3 class="text-xl font-bold text-white">주요 사용자 활동</h3>
      <div class="flex-grow mt-4">
        <Chart config={userActionsData} />
      </div>
    </div>
  </div>
</div>

<!-- Search and Table Section -->
<div class="mt-8 bg-slate-800 p-6 rounded-lg shadow-md">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
    <h3 class="text-xl font-bold text-white">사용자 목록</h3>
    <div class="relative w-full md:w-auto">
      <span class="absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon name="search" className="w-5 h-5 text-slate-400" />
      </span>
      <input 
        type="text" 
        bind:value={searchTerm}
        placeholder="이메일 또는 닉네임 검색..."
        class="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  </div>
  
  <div class="overflow-x-auto">
    <table class="w-full text-left">
      <thead class="text-xs text-slate-400 uppercase bg-slate-700">
        <tr>
          <th scope="col" class="px-6 py-3 cursor-pointer" on:click={() => handleSort('email')}>
            이메일 {#if sortKey === 'email'}{#if sortDirection === 'asc'}▲{:else}▼{/if}{/if}
          </th>
          <th scope="col" class="px-6 py-3 cursor-pointer" on:click={() => handleSort('nickname')}>
            닉네임 {#if sortKey === 'nickname'}{#if sortDirection === 'asc'}▲{:else}▼{/if}{/if}
          </th>
          <th scope="col" class="px-6 py-3 cursor-pointer" on:click={() => handleSort('lastSeen')}>
            최근 접속 {#if sortKey === 'lastSeen'}{#if sortDirection === 'asc'}▲{:else}▼{/if}{/if}
          </th>
          <th scope="col" class="px-6 py-3 cursor-pointer" on:click={() => handleSort('stories')}>
            이야기 수 {#if sortKey === 'stories'}{#if sortDirection === 'asc'}▲{:else}▼{/if}{/if}
          </th>
          <th scope="col" class="px-6 py-3 cursor-pointer" on:click={() => handleSort('spend')}>
            총 사용액 {#if sortKey === 'spend'}{#if sortDirection === 'asc'}▲{:else}▼{/if}{/if}
          </th>
          <th scope="col" class="px-6 py-3 text-center">상세보기</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredUsers as user (user.id)}
          <tr class="border-b border-slate-700 hover:bg-slate-700/50">
            <td class="px-6 py-4 font-medium text-white whitespace-nowrap">{user.email}</td>
            <td class="px-6 py-4 text-slate-300">{user.nickname}</td>
            <td class="px-6 py-4 text-slate-300">{user.lastSeen}</td>
            <td class="px-6 py-4 text-slate-300">{user.stories}</td>
            <td class="px-6 py-4 text-green-400">{user.spend}</td>
            <td class="px-6 py-4 text-center">
              <button 
                on:click={() => handleViewDetails(user.id)} 
                class="text-cyan-400 hover:text-cyan-300"
                title="상세보기"
              >
                <Icon name="eye" className="w-5 h-5" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
