<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from '$lib/Icon.svelte';
	import { loginAndSync, registerUser } from '$lib/apiService'; // API 함수 임포트

	type Mode = 'login' | 'signup';

	export let open = false;
	export let mode: Mode = 'login';
	export let onClose: () => void = () => {};
	export let onSwitch: (mode: Mode) => void = () => {};

	let dialog: HTMLDialogElement;
	let termsAgreed = false;
	let email = '';
	let password = '';
	let username = '';
	let error: string | null = null;
	let isLoading = false;

	$: if (browser && dialog) {
		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}

	async function handleSubmit() {
		// console.log('[AuthModal] handleSubmit triggered. Mode:', mode);
		error = null;
		isLoading = true;

		try {
			if (isLogin) {
				// console.log(`[AuthModal] Attempting login for email: ${email}`);
				await loginAndSync(email, password);
				// console.log('[AuthModal] Login successful.');
				onClose(); // 성공 시 모달 닫기
			} else {
				// console.log(`[AuthModal] Attempting to register user: ${username}`);
				await registerUser(username, email, password);
				// console.log('[AuthModal] Registration successful. Switching to login mode.');
				// 회원가입 성공 후 로그인 모드로 전환 또는 자동 로그인 처리
				onSwitch('login');
			}
		} catch (err) {
			console.error('[AuthModal] Error:', err);
			error = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
		} finally {
			isLoading = false;
		}
	}

	// The 'close' event on the dialog element is triggered by the ESC key or `dialog.close()`
	function handleDialogClose() {
		onClose();
	}

	function handleSwitch() {
		// 모드 전환 시 입력 필드와 에러 메시지 초기화
		email = '';
		password = '';
		username = '';
		error = null;
		onSwitch(isLogin ? 'signup' : 'login');
	}

	// Close modal if backdrop is clicked
	function handleClick(event: MouseEvent) {
		if (event.target === dialog) {
			handleDialogClose();
		}
	}

	$: isLogin = mode === 'login';
	$: title = isLogin ? '로그인' : '회원가입';
	$: subtitle = isLogin ? '다시 오셨네요! 모험을 계속해 보세요.' : '환영합니다! 나만의 세계를 만들 준비, 되셨나요?';
	$: socialButtonText = isLogin ? '로그인' : '1초 만에 시작하기';
	$: dividerText = isLogin ? '또는 이메일로 로그인' : '또는 이메일로 가입하기';
	$: mainButtonText = isLogin ? '로그인' : '회원가입';
	$: footerText = isLogin ? '처음 오셨나요?' : '이미 모험가이신가요?';
	$: footerLinkText = isLogin ? '회원가입' : '로그인';
</script>

<dialog
	bind:this={dialog}
	on:close={handleDialogClose}
	on:click={handleClick}
	aria-labelledby="auth-title"
	class="bg-transparent z-[100] p-4"
>
	<div
		class="bg-slate-800 border border-slate-700/50 w-full max-w-md rounded-2xl shadow-2xl p-8 relative animate-scale-in"
	>
		<button
			on:click={handleDialogClose}
			class="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
		>
			<Icon name="x" className="h-6 w-6" />
		</button>

		<div class="text-center mb-6">
			<h1 id="auth-title" class="text-3xl font-bold text-white">{title}</h1>
			<p class="text-slate-400 mt-2">{subtitle}</p>
		</div>

		<div class="space-y-3 mb-6">
			<button
				class="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
			>
				<span class="font-bold">[G]</span>
				Google 계정으로 {socialButtonText}
			</button>
			<button
				class="w-full flex items-center justify-center gap-3 bg-yellow-400 text-black font-semibold py-2.5 rounded-lg hover:bg-yellow-500 transition-colors"
			>
				<span class="font-bold">[k]</span>
				Kakao 계정으로 {socialButtonText}
			</button>
		</div>

		<div class="flex items-center gap-4 my-6">
			<hr class="flex-grow border-t border-slate-700" />
			<span class="text-slate-500 text-sm">{dividerText}</span>
			<hr class="flex-grow border-t border-slate-700" />
		</div>

		<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
			{#if !isLogin}
				<div>
					<label for="username" class="block text-sm font-medium text-slate-300 mb-1"
						>사용자 이름 (닉네임)</label
					>
					<input
						bind:value={username}
						type="text"
						id="username"
						required
						class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
					/>
					<p class="text-xs text-slate-500 mt-1">모험가님의 멋진 이름이 될 거예요.</p>
				</div>
			{/if}

			<div>
				<label for="email" class="block text-sm font-medium text-slate-300 mb-1">이메일</label>
				<input
					bind:value={email}
					type="email"
					id="email"
					required
					class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-slate-300 mb-1"
					>비밀번호</label
				>
				<input
					bind:value={password}
					type="password"
					id="password"
					required
					class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
				/>
			</div>

			{#if !isLogin}
				<div class="flex items-center">
					<input
						type="checkbox"
						id="terms"
						bind:checked={termsAgreed}
						class="h-4 w-4 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-600"
					/>
					<label for="terms" class="ml-2 text-sm text-slate-400">
						(필수)
						<button type="button" class="underline hover:text-cyan-400">서비스 이용약관</button>
						및
						<button type="button" class="underline hover:text-cyan-400"
							>개인정보 처리방침</button
						>에 동의합니다.
					</label>
				</div>
			{/if}

			{#if error}
				<div class="text-red-400 text-sm bg-red-900/50 border border-red-800 rounded-lg p-3 text-center">
					{error}
				</div>
			{/if}

			<div class="pt-2">
				<button
					type="submit"
					disabled={(!isLogin && !termsAgreed) || isLoading}
					class="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
				>
					{#if isLoading}
						<Icon name="loader" className="animate-spin h-5 w-5 mr-3" />
						Processing...
					{:else}
						{mainButtonText}
					{/if}
				</button>
			</div>
		</form>

		<div class="text-center mt-6">
			<p class="text-sm text-slate-400">
				{footerText}
				<button
					on:click={handleSwitch}
					class="font-semibold text-cyan-400 hover:underline">{footerLinkText}</button
				>
			</p>
		</div>
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(30, 41, 59, 0.8);
		-webkit-backdrop-filter: blur(2px);
		backdrop-filter: blur(2px);
		animation: fade-in 0.2s ease-out forwards;
	}
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes scale-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	.animate-scale-in {
		animation: scale-in 0.2s ease-out forwards;
	}
</style>
