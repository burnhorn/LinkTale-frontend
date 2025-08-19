<script lang="ts">
  import RevenueCard from '$lib/components/admin/RevenueCard.svelte';
  import Chart from '$lib/components/admin/charts/Chart.svelte';
  import type { ChartConfiguration } from 'chart.js';

  export let data;
  const { revenueData } = data;

  // chart.js에 전달할 전체 config 객체를 생성합니다.
  const chartConfig: ChartConfiguration = {
    type: 'bar', // 차트 유형을 명시
    data: {
      labels: revenueData.revenueBySource.map(item => item.source),
      datasets: [
        {
          label: '소스별 수익',
          data: revenueData.revenueBySource.map(item => item.value),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: '소스별 수익 분포',
          color: '#FFFFFF',
          font: {
            size: 18,
          }
        },
      },
      scales: {
        y: {
          ticks: { color: '#94a3b8' },
          grid: { color: '#334155' }
        },
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: '#334155' }
        }
      }
    }
  };
</script>

<h2 class="text-3xl font-bold text-white">수익 분석</h2>
<p class="text-slate-400 mt-2">월간 수익, 소스별 기여도, 인기 상품을 확인하세요.</p>

<div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="md:col-span-1 lg:col-span-1">
    <RevenueCard
      title="총 수익"
      period="이번 달"
      value={revenueData.monthlyRevenue}
    />
  </div>
</div>

<div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
  <!-- <ul> 목록을 Chart 컴포넌트로 교체 -->
  <div class="bg-slate-800 p-6 rounded-lg shadow-md h-96">
    <Chart config={chartConfig} />
  </div>

  <!-- Top Selling Products -->
  <div class="bg-slate-800 p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-bold text-white">인기 판매 상품</h3>
    <div class="overflow-x-auto">
      <table class="w-full mt-4 text-left">
        <thead class="text-xs text-slate-400 uppercase bg-slate-700">
          <tr>
            <th scope="col" class="px-6 py-3">상품명</th>
            <th scope="col" class="px-6 py-3">판매량</th>
            <th scope="col" class="px-6 py-3">수익</th>
          </tr>
        </thead>
        <tbody>
          {#each revenueData.topSellingProducts as product}
            <tr class="border-b border-slate-700 hover:bg-slate-700/50">
              <td class="px-6 py-4 font-medium text-white whitespace-nowrap">{product.name}</td>
              <td class="px-6 py-4 text-slate-300">{product.sales}</td>
              <td class="px-6 py-4 text-green-400">
                {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.revenue)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>