<script lang="ts">
  import Icon from '$lib/Icon.svelte';
</script>

<div class="relative group flex-shrink-0 h-64 w-12 m-1 flex items-center justify-center">
  <button on:click class="w-full h-full border-2 border-dashed border-slate-600 rounded-md flex items-center justify-center transition-all duration-300 hover:bg-slate-700/50 hover:border-cyan-500">
    <Icon name="plus" className="h-8 w-8 text-slate-500 group-hover:text-cyan-400 transition-colors" />
  </button>
  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-2 text-center bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
    <p class="text-white font-semibold">새 이야기 만들기</p>
    <p class="text-slate-400 text-sm">이곳을 당신의 걸작으로 채워보세요!</p>
    <div class="absolute w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-700 -bottom-2 left-1/2 -translate-x-1/2"></div>
  </div>
</div>
