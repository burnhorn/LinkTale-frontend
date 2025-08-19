<script lang="ts">
  import StatCard from '$lib/components/admin/StatCard.svelte';
  import Chart from '$lib/components/admin/charts/Chart.svelte';
  import type { ChartConfiguration } from 'chart.js';

  export let data;
  let { kpiData, mainFunnelData, hourlyActiveUsersData } = data;

  // 시간대별 활성 사용자 데이터에서 피크 타임을 계산합니다.
  const hourlyData = hourlyActiveUsersData.data.datasets[0].data as number[];
  const peakValue = Math.max(...hourlyData);
  const peakHour = hourlyData.indexOf(peakValue);
</script>

<h2 class="text-3xl font-bold text-white">관리자 대시보드</h2>
<p class="text-slate-400 mt-2">환영합니다! 여기서 전체 현황을 확인하세요.</p>

<!-- KPI Cards -->
<div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard 
    title={kpiData.dau.label}
    value={kpiData.dau.value}
    change={kpiData.dau.change}
    isPositive={kpiData.dau.isPositive}
    iconName="users"
    iconColor="text-blue-400"
  />
  <StatCard 
    title={kpiData.newSignups.label}
    value={kpiData.newSignups.value}
    change={kpiData.newSignups.change}
    isPositive={kpiData.newSignups.isPositive}
    iconName="userPlus"
    iconColor="text-green-400"
  />
  <StatCard 
    title={kpiData.revenue.label}
    value={kpiData.revenue.value}
    change={kpiData.revenue.change}
    isPositive={kpiData.revenue.isPositive}
    iconName="currency"
    iconColor="text-yellow-400"
  />
  <StatCard 
    title={kpiData.storiesCreated.label}
    value={kpiData.storiesCreated.value}
    change={kpiData.storiesCreated.change}
    isPositive={kpiData.storiesCreated.isPositive}
    iconName="newStory"
    iconColor="text-purple-400"
  />
</div>

<!-- Main Charts Grid -->
<div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
  <!-- Left Column -->
  <div class="lg:col-span-2 flex flex-col gap-8">
    <!-- Hourly Active Users -->
    <div class="bg-slate-800 p-6 rounded-lg shadow-md h-96 flex flex-col">
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-bold text-white">시간대별 활성 사용자</h3>
        <p class="text-sm text-slate-400">피크 타임: <span class="font-bold text-cyan-400">{peakHour}시 ({peakValue}명)</span></p>
      </div>
      <div class="flex-grow mt-4">
        <Chart config={hourlyActiveUsersData} />
      </div>
    </div>
  </div>

  <!-- Right Column -->
  <div class="lg:col-span-1 flex flex-col gap-8">
    <!-- Main Funnel -->
    <div class="bg-slate-800 p-6 rounded-lg shadow-md h-[26rem] flex flex-col">
      <h3 class="text-xl font-bold text-white">핵심 깔때기 분석</h3>
      <div class="flex-grow mt-4">
        <Chart config={mainFunnelData} />
      </div>
    </div>
  </div>
</div>
