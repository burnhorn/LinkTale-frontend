<!-- src/lib/AudioPlayer.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { audioStore } from '$lib/stores';
	import Icon from '$lib/Icon.svelte';
	
	let audioPlayer: HTMLAudioElement;
	let isSeeking = false;
	let wasPlayingBeforeSeek = false;

	// --- Draggable State ---
	let playerRef: HTMLDivElement;
	let position = { x: 0, y: 0 };
	let isDragging = false;
	let dragStart = { x: 0, y: 0 };

	function onDragStart(e: MouseEvent | TouchEvent) {
		isDragging = true;
		const event = 'touches' in e ? e.touches[0] : e;
		dragStart.x = event.clientX - position.x;
		dragStart.y = event.clientY - position.y;

		window.addEventListener('mousemove', onDragMove);
		window.addEventListener('mouseup', onDragEnd);
		window.addEventListener('touchmove', onDragMove, { passive: false });
		window.addEventListener('touchend', onDragEnd);
	}

	function onDragMove(e: MouseEvent | TouchEvent) {
		if (!isDragging) return;
		e.preventDefault();

		const event = 'touches' in e ? e.touches[0] : e;
		position.x = event.clientX - dragStart.x;
		position.y = event.clientY - dragStart.y;
	}

	function onDragEnd() {
		isDragging = false;
		window.removeEventListener('mousemove', onDragMove);
		window.removeEventListener('mouseup', onDragEnd);
		window.removeEventListener('touchmove', onDragMove);
		window.removeEventListener('touchend', onDragEnd);
	}

	// --- Audio Logic ---
	$: if (browser && audioPlayer) {
		if ($audioStore.isPlaying) {
			audioPlayer.play().catch((e) => console.error('Audio play failed:', e));
		} else {
			audioPlayer.pause();
		}
	}

	function formatTime(seconds: number): string {
		if (isNaN(seconds) || seconds < 0) return '00:00';
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	function handleTimeUpdate() {
		if (audioPlayer && !isSeeking) {
			audioStore.updateTime(audioPlayer.currentTime);
		}
	}

	function handleLoadedMetadata() {
		if (audioPlayer) {
			audioStore.setDuration(audioPlayer.duration);
		}
	}

	function handleSeekStart() {
		isSeeking = true;
		wasPlayingBeforeSeek = $audioStore.isPlaying;
		if (wasPlayingBeforeSeek) {
			audioStore.pause();
		}
	}

	function handleSeekEnd(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		if (audioPlayer) {
			audioPlayer.currentTime = Number(target.value);
		}
		isSeeking = false;
		if (wasPlayingBeforeSeek) {
			audioStore.play();
		}
	}

	function handleClose() {
		audioStore.clearAudio();
	}
</script>

{#if $audioStore.src}
	<div
		bind:this={playerRef}
		class="fixed bottom-5 right-5 w-80 max-w-[90vw] bg-slate-800/80 backdrop-blur-md text-white rounded-lg shadow-2xl select-none touch-none z-50"
		style={`transform: translate(${position.x}px, ${position.y}px);`}
	>
		<audio
			bind:this={audioPlayer}
			src={$audioStore.src}
			on:timeupdate={handleTimeUpdate}
			on:loadedmetadata={handleLoadedMetadata}
			on:ended={() => audioStore.pause()}
		>
		</audio>

		<div class="flex items-center p-3">
			<div
				role="button"
				tabindex="0"
				class="flex-shrink-0 p-2 cursor-grab active:cursor-grabbing"
				on:mousedown={onDragStart}
				on:touchstart={onDragStart}
			>
				<Icon name="gripVertical" class="h-5 w-5 text-slate-400" />
			</div>

			<div class="flex-shrink-0 w-12 h-12 bg-slate-700 rounded-md mr-3">
				<Icon name="audio" class="w-full h-full p-2 text-cyan-400" />
			</div>

			<div class="flex-grow min-w-0">
				<p class="text-xs font-semibold text-slate-300 truncate">오디오 드라마</p>
				<p class="text-sm font-bold text-white">현재 이야기</p>
			</div>

			<button
				on:click={() => ($audioStore.isPlaying ? audioStore.pause() : audioStore.play())}
				class="ml-3 flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center text-white shadow-lg"
				aria-label={$audioStore.isPlaying ? 'Pause' : 'Play'}
			>
				<Icon name={$audioStore.isPlaying ? 'pause' : 'play'} class="h-5 w-5" />
			</button>

			<button on:click={handleClose} class="ml-2 flex-shrink-0 p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
				<Icon name="close" class="w-4 h-4" />
			</button>
		</div>

		<div class="px-4 pb-3">
			<input
				type="range"
				class="w-full h-1.5 bg-slate-600 rounded-full appearance-none cursor-pointer"
				min="0"
				max={$audioStore.duration || 100}
				value={$audioStore.currentTime}
				on:mousedown={handleSeekStart}
				on:input={handleSeekEnd}
				on:touchstart={handleSeekStart}
				on:touchend={handleSeekEnd}
			/>
			<div class="flex justify-between text-xs font-mono text-slate-400 mt-1">
				<span>{formatTime($audioStore.currentTime)}</span>
				<span>{formatTime($audioStore.duration)}</span>
			</div>
		</div>
	</div>
{/if}
