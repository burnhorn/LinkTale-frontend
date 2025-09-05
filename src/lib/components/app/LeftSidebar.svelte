<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/Icon.svelte';
	import NavButton from './NavButton.svelte';
	import { auth } from '$lib/authStore';
	import { logoutUser, sendAction, downloadStoryAsPdf } from '$lib/apiService';
	import { audioStore, isAudioLoading } from '$lib/stores';

	// Svelte 5: Props are declared with `let` or `export let`.
	// We define the types for the function props that will be passed down from the parent.
	let {
		onStartNewStory = () => {},
		onLoginClick = () => {}
	}: {
		onStartNewStory?: () => void;
		onLoginClick?: () => void;
	} = $props();

	async function handleLogout() {
		try {
			await logoutUser();
			// authStore의 logout 메서드에서 페이지 새로고침을 처리하므로,
			// 여기서는 별도의 추가 작업이 필요 없습니다.
		} catch (error) {
			console.error('Logout failed:', error);
			alert('로그아웃 중 오류가 발생했습니다.');
		}
	}

	function handleAudioAction() {
		if ($isAudioLoading) return; // 로딩 중에는 아무것도 하지 않음

		if ($audioStore.src) {
			audioStore.play();
		} else {
			sendAction('generate_audio');
		}
	}

	async function handleDownloadPdf() {
		try {
			await downloadStoryAsPdf();
		} catch (e) {
			// apiService에서 이미 alert를 띄우므로, 여기서는 콘솔에만 기록합니다.
			console.error('PDF download failed:', e);
		}
	}
</script>

<div
	class="bg-slate-900/70 backdrop-blur-sm text-white w-64 flex-shrink-0 flex flex-col p-4 space-y-2 border-r border-slate-700/50 h-full"
>
	<a href="/" class="flex items-center space-x-2 px-4 pb-4 group">
		<Icon name="logo" className="h-8 w-8 text-cyan-400 group-hover:animate-pulse" />
		<span class="text-xl font-bold">LinkTale</span>
	</a>

	<div class="flex-grow space-y-1">
		<NavButton
			href="/create"
			iconName="newStory"
			label="현재 이야기"
			active={$page.url.pathname.startsWith('/create')}
		/>
		<NavButton on:click={handleDownloadPdf} iconName="pdf" label="PDF로 저장" />
		<!-- <NavButton
			on:click={handleAudioAction}
			iconName="audio"
			label={$isAudioLoading ? '생성 중...' : $audioStore.src ? '오디오 드라마 듣기' : '오디오 드라마 만들기'}
			disabled={$isAudioLoading}
		/> -->

		<div class="px-4 pt-6 pb-2">
			<button
				onclick={onStartNewStory}
				class="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-transform transform hover:scale-105"
			>
				<Icon name="plus" className="h-5 w-5 mr-2" />
				새로운 동화 만들기
			</button>
		</div>

		<div class="pt-4 space-y-1">
			<NavButton
				href="/bookshelf"
				iconName="bookshelf"
				label="나의 책장"
				active={$page.url.pathname.startsWith('/bookshelf')}
			/>
			<NavButton
				href="/encyclopedia"
				iconName="encyclopedia"
				label="세계관 도감"
				active={$page.url.pathname.startsWith('/encyclopedia')}
			/>
			<NavButton
				href="/adventure"
				iconName="search"
				label="모험가의 광장"
				active={$page.url.pathname.startsWith('/adventure')}
			/>
		</div>
	</div>

	{#if $auth.user}
		<div class="flex flex-col space-y-2 p-2 bg-slate-800 rounded-lg">
			<div class="text-center text-slate-300 p-2">
				환영합니다, <span class="font-bold text-cyan-400">{$auth.user.username}</span>님!
			</div>
			<button
				onclick={handleLogout}
				class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
			>
				로그아웃
			</button>
		</div>
	{:else}
		<div class="flex flex-col space-y-2 p-2 bg-slate-800 rounded-lg">
			<a
				href="/pricing"
				class="relative w-full flex justify-center bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-2 px-4 rounded-lg text-sm transition-transform transform hover:scale-105"
			>
				<span
					class="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-300 text-black text-xs font-bold px-2 py-0.5 rounded-full"
					>-80%</span
				>
				전체 기능 잠금 해제
			</a>
			<button
				onclick={onLoginClick}
				class="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-lg text-sm"
			>
				로그인
			</button>
		</div>
	{/if}
</div>
