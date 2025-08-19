<script lang="ts">
  import { onMount } from 'svelte';
  import StatCard from '$lib/components/admin/StatCard.svelte';
  import Chart from '$lib/components/admin/charts/Chart.svelte';
  import KeywordModal from '$lib/components/admin/KeywordModal.svelte';
  import Icon from '$lib/Icon.svelte';
  import { Chart as ChartJS, Colors } from 'chart.js';
  import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
  import type { StoryBook } from '$lib/types';

  export let data;
  let { contentKpis, wordCloudData, aiAgentPreferenceData, popularPlazaPostsData, relatedStories } = data;

  // --- State ---
  let modalData: { keyword: string; stories: StoryBook[] } | null = null;
  let curatedStories: { [id: string]: 'recommended' | 'hidden' | undefined } = {};
  let isChartReady = false; // 차트 렌더링 준비 상태

  // --- Chart Setup ---
  onMount(() => {
    ChartJS.register(WordCloudController, WordElement, Colors);
    isChartReady = true; // 컨트롤러 등록 후 렌더링 준비 완료
  });

  // --- Event Handlers ---
  function handleWordClick(event: any, elements: any[], chart: any) {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const keyword = chart.data.labels[elementIndex] as string;
      
      const stories = relatedStories.filter((book: StoryBook) => 
        book.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())) || 
        book.title.toLowerCase().includes(keyword.toLowerCase())
      );
      
      modalData = { keyword, stories };
    }
  }

  function handleCuration(bookId: string, action: 'recommended' | 'hidden') {
    curatedStories = {
      ...curatedStories,
      [bookId]: curatedStories[bookId] === action ? undefined : action
    };
  }

  // 워드클라우드 config에 onClick 핸들러를 안전하게 추가하기 위해 config를 복제합니다.
  const wordCloudConfig = {
    ...wordCloudData,
    options: {
      ...wordCloudData.options,
      onClick: handleWordClick,
    }
  };
</script>

{#if modalData}
  <KeywordModal
    open={!!modalData}
    keyword={modalData.keyword}
    stories={modalData.stories}
    onClose={() => (modalData = null)}
  />
{/if}

<h2 class="text-3xl font-bold text-white">콘텐츠 분석</h2>
<p class="text-slate-400 mt-2">생성된 이야기의 주요 키워드와 성과 지표를 확인하세요.</p>

<!-- KPI Cards -->
<div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatCard title={contentKpis.totalStories.label} value={contentKpis.totalStories.value} change={contentKpis.totalStories.change} isPositive={contentKpis.totalStories.isPositive} iconName="bookshelf" iconColor="text-blue-400" />
  <StatCard title={contentKpis.avgRating.label} value={contentKpis.avgRating.value} change={contentKpis.avgRating.change} isPositive={contentKpis.avgRating.isPositive} iconName="star" iconColor="text-yellow-400" />
  <StatCard title={contentKpis.completionRate.label} value={contentKpis.completionRate.value} change={contentKpis.completionRate.change} isPositive={contentKpis.completionRate.isPositive} iconName="checkCircle" iconColor="text-green-400" />
</div>

<!-- Charts Grid -->
<div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div class="bg-slate-800 p-6 rounded-lg shadow-md h-[32rem] flex flex-col">
    <h3 class="text-xl font-bold text-white">인기 키워드 클라우드 (클릭 가능)</h3>
    <div class="flex-grow mt-4 cursor-pointer">
      {#if isChartReady}
        <Chart config={wordCloudConfig} />
      {/if}
    </div>
  </div>
  <div class="bg-slate-800 p-6 rounded-lg shadow-md h-[32rem] flex flex-col">
    <h3 class="text-xl font-bold text-white">AI 에이전트 선호도</h3>
    <div class="flex-grow mt-4">
      {#if isChartReady}
        <Chart config={aiAgentPreferenceData} />
      {/if}
    </div>
  </div>
</div>

<!-- Popular Posts Table -->
<div class="mt-8 bg-slate-800 p-6 rounded-lg shadow-md">
  <h3 class="text-xl font-bold text-white mb-4">'모험가의 광장' 인기글 Top 10</h3>
  <div class="space-y-2 overflow-y-auto max-h-[30rem] pr-2">
    {#each popularPlazaPostsData as book, i}
      <div class="flex items-center gap-4 p-2 rounded-md hover:bg-slate-700/50">
        <span class="font-bold text-slate-400 text-lg w-6 text-center">#{i + 1}</span>
        <img src={book.coverImageUrl} alt={book.title} class="w-10 h-14 object-cover rounded-md flex-shrink-0" />
        <div class="flex-grow overflow-hidden">
          <p class="font-semibold text-white truncate">{book.title}</p>
          <p class="text-sm text-slate-500 truncate">by {book.authorName}</p>
        </div>
        <div class="flex-shrink-0 flex items-center gap-4 text-sm text-slate-300">
          <span class="flex items-center gap-1.5"><Icon name="heart" className="w-4 h-4 text-pink-500"/>{book.likes.toLocaleString()}</span>
          <span class="flex items-center gap-1.5"><Icon name="eye" className="w-4 h-4 text-cyan-500"/>{book.views.toLocaleString()}</span>
        </div>
        <div class="flex-shrink-0 flex items-center gap-2">
          <button
            on:click={() => handleCuration(book.id, 'recommended')}
            class="p-1.5 rounded-full transition-colors"
            class:bg-yellow-500={curatedStories[book.id] === 'recommended'}
            class:text-black={curatedStories[book.id] === 'recommended'}
            class:bg-slate-700={curatedStories[book.id] !== 'recommended'}
            class:text-yellow-400={curatedStories[book.id] !== 'recommended'}
            class:hover:bg-yellow-500={curatedStories[book.id] !== 'recommended'}
            class:hover:text-black={curatedStories[book.id] !== 'recommended'}
            title="추천하기"
          >
            <Icon name="star" className="w-4 h-4" />
          </button>
          <button
            on:click={() => handleCuration(book.id, 'hidden')}
            class="p-1.5 rounded-full transition-colors"
            class:bg-red-500={curatedStories[book.id] === 'hidden'}
            class:text-white={curatedStories[book.id] === 'hidden'}
            class:bg-slate-700={curatedStories[book.id] !== 'hidden'}
            class:text-red-400={curatedStories[book.id] !== 'hidden'}
            class:hover:bg-red-500={curatedStories[book.id] !== 'hidden'}
            class:hover:text-white={curatedStories[book.id] !== 'hidden'}
            title="숨기기"
          >
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>
