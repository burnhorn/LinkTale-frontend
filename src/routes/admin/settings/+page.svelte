<h2 class="text-3xl font-bold text-white">설정</h2>
<p class="text-slate-400 mt-2">관리자 대시보드의 설정을 변경합니다.</p>

<div class="mt-8 space-y-6 max-w-2xl">
  <div class="bg-slate-800 p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-bold text-white">일반 설정</h3>
    <div class="mt-4 space-y-4">
      <div>
        <label for="site-name" class="block text-slate-300 mb-1">사이트 이름</label>
        <input type="text" id="site-name" class="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" value="My SvelteKit App">
      </div>
      <div>
        <label for="admin-email" class="block text-slate-300 mb-1">관리자 이메일</label>
        <input type="email" id="admin-email" class="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" value="admin@example.com">
      </div>
    </div>
  </div>

  <div class="bg-slate-800 p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-bold text-white">알림 설정</h3>
    <div class="mt-4 space-y-2">
      <label class="flex items-center space-x-3">
        <input type="checkbox" class="h-5 w-5 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-600" checked>
        <span class="text-slate-300">신규 사용자 가입 시 이메일 알림</span>
      </label>
      <label class="flex items-center space-x-3">
        <input type="checkbox" class="h-5 w-5 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-600">
        <span class="text-slate-300">신규 주문 발생 시 이메일 알림</span>
      </label>
    </div>
  </div>

  <div>
    <button class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
      설정 저장
    </button>
  </div>
</div>
