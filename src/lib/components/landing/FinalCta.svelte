<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		const module = await import('@lottiefiles/lottie-player');
	});
</script>

<div class="relative bg-white">
	<div class="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:py-32">
		<div
			class="relative isolate overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 px-6 pt-16 text-white shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0"
		>
			<div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
				<h2 class="text-3xl font-bold font-display tracking-tight sm:text-4xl">
					우리 아이의 마법 같은 이야기를<br /> 만들 준비가 되셨나요?
				</h2>
				<p class="mt-6 text-lg leading-8 text-purple-100">
					아이의 창의력과 상상력을 펼쳐 보세요! 결제 없이 무료로 첫 번째 이야기를 만들어 볼 수
					있습니다.
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
					<a
						href="/create"
						class="transform rounded-md bg-white px-5 py-3 text-base font-semibold text-purple-600 shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
					>
						무료로 동화책 만들기 &rarr;
					</a>
					<a
						href="#features"
						class="group text-base font-semibold leading-6 text-white transition-colors duration-300 hover:text-purple-100"
					>
						더 알아보기 <span
							aria-hidden="true"
							class="inline-block transition-transform duration-300 group-hover:translate-x-1"
							>→</span
						>
					</a>
				</div>
			</div>
			<div class="relative mt-16 h-80 lg:mt-8">
				<div class="absolute left-0 top-0 w-[57rem] max-w-none">
					<lottie-player
						src="/confetti1.json"
						background="transparent"
						speed="1"
						style="width: 100%; height: 100%;"
						loop
						autoplay
					></lottie-player>
				</div>
			</div>
		</div>
	</div>
</div>

