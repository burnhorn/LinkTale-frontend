<script lang="ts">
  import { onMount } from 'svelte';

  import type { ChatMessage, Quest } from '../../types';
  import Icon from '$lib/Icon.svelte';

  // --- Props (기존과 동일) ---
  export let messages: ChatMessage[] = [];
  export let isAiTyping: boolean = false;
  export let orbs: number = 0;
  export let affinity: number = 0;
  export let quest: Quest = { title: '퀘스트', description: 'AI와 대화를 시작해보세요.'};
  export let questStatus: 'incomplete' | 'complete' = 'incomplete';
  export let collapsed = false;
  export let onSendMessage: (message: string) => void = () => {};

  // --- Local State ---
  let inputValue = '';
  let chatEndRef: HTMLDivElement;
  let lottiePlayer: any;
  let isLottieReady = false;
  let prevMessageCount = 0;

  onMount(async () => {
    // 클라이언트 측에서만 웹 컴포넌트를 동적으로 import 합니다.
    await import('@lottiefiles/lottie-player');
  });

  // --- Logic (기존과 동일) ---
  function handleSubmit() {
    if (inputValue.trim() && !isAiTyping) {
      onSendMessage(inputValue.trim());
      inputValue = '';
    }
  }

  // --- Reactive Statements (애니메이션의 핵심!) ---
  $: if (chatEndRef) {
    chatEndRef.scrollIntoView({ behavior: 'smooth' });
  }

  // AI 메시지 도착 시 애니메이션 재생
  $: {
    if (isLottieReady && messages.length > prevMessageCount) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai') {
        lottiePlayer?.stop();
        lottiePlayer?.play();
      }
    }
    prevMessageCount = messages.length;
  }

  $: questClasses = questStatus === 'complete'
    ? 'bg-green-900/50 border-green-700 text-green-200'
    : 'bg-cyan-900/50 border-cyan-700 text-cyan-200';
</script>

<div class="bg-slate-900/70 backdrop-blur-sm text-white flex-shrink-0 flex flex-col border-l border-slate-700/50 h-full transition-all duration-300"
  class:w-96={!collapsed}
  class:w-0={collapsed}
  class:overflow-hidden={collapsed}
>
  <div class="w-96 flex flex-col h-full">
    <!-- HUD -->
    <div class="p-4 border-b border-slate-700/50">
      <div class="flex justify-around bg-slate-800 p-2 rounded-lg">
        <div class="flex items-center space-x-2">
          <Icon name="sparkle" className="h-6 w-6 text-yellow-300" />
          <div>
            <div class="text-xs text-slate-400">상상력 구슬</div>
            <div class="font-bold text-lg">{orbs}</div>
          </div>
        </div>
        <div class="border-r border-slate-700"></div>
        <div class="flex items-center space-x-2">
          <Icon name="heart" className="h-6 w-6 text-pink-500" />
          <div>
            <div class="text-xs text-slate-400">AI 호감도</div>
            <div class="font-bold text-lg">{affinity}%</div>
          </div>
        </div>
      </div>
      <div class="mt-3 border p-2 rounded-lg text-xs transition-all duration-300 {questClasses}">
          <p class="font-bold">{questStatus === 'complete' ? '✅ 퀘스트 완료!' : quest.title}</p>
          <p class:text-green-300={questStatus === 'complete'} class:text-cyan-300={questStatus !== 'complete'}>{quest.description}</p>
      </div>
    </div>

    <!-- ✅ Live Chatbot Stage -->
    <div class="w-full h-20 bg-slate-900/50 flex-shrink-0 flex justify-center items-center">
      <div class="w-48 h-48">
        <lottie-player
          bind:this={lottiePlayer}
          src="/confetti.json"
          background="transparent"
          on:ready={() => isLottieReady = true}
        ></lottie-player>
      </div>
    </div>
    
    <!-- Chat History -->
    <div class="flex-1 p-4 overflow-y-auto space-y-4">
      {#each messages as msg (msg.id)}
        <div class="flex items-end gap-2" class:justify-end={msg.sender === 'user'} class:justify-start={msg.sender === 'ai'}>
          {#if msg.sender === 'ai'}
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Icon name="robot" className="h-5 w-5 text-cyan-400"/>
            </div>
          {/if}
          <div class="max-w-xs md:max-w-sm rounded-xl px-4 py-2.5" class:bg-blue-600={msg.sender === 'user'} class:text-white={msg.sender === 'user'} class:rounded-br-none={msg.sender === 'user'} class:bg-slate-700={msg.sender === 'ai'} class:text-slate-200={msg.sender === 'ai'} class:rounded-bl-none={msg.sender === 'ai'}>
            <p class="text-sm leading-relaxed">{msg.text}</p>
            {#if msg.text}
            <div class="text-xs opacity-60 text-right mt-1">
              {msg.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </div>
            {/if}
          </div>
        </div>
      {/each}
      {#if isAiTyping}
        <div class="flex items-end gap-2 justify-start">
           <div class="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Icon name="robot" className="h-5 w-5 text-cyan-400 animate-pulse"/>
           </div>
           <div class="max-w-xs md:max-w-sm rounded-xl px-4 py-2.5 bg-slate-700 text-slate-200 rounded-bl-none">
              <div class="flex items-center space-x-1">
                  <span class="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span class="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span class="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
           </div>
        </div>
      {/if}
      <div bind:this={chatEndRef}></div>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t border-slate-700/50">
      <div class="flex gap-2 mb-3">
          <button on:click={() => onSendMessage("이 장면에 어울리는 그림을 그려줘!")} class="flex-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg py-2 px-3 transition-colors disabled:opacity-50" disabled={isAiTyping}>✨ 그림 요청하기</button>
          <button on:click={() => onSendMessage("다음엔 어떤 일이 일어날까? 아이디어를 줘!")} class="flex-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg py-2 px-3 transition-colors disabled:opacity-50" disabled={isAiTyping}>💡 아이디어 제안</button>
      </div>
      <form on:submit|preventDefault={handleSubmit} class="flex items-center bg-slate-800 rounded-lg p-1">
        <input
          type="text"
          bind:value={inputValue}
          placeholder="AI에게 다음 내용을 알려주세요..."
          disabled={isAiTyping}
          class="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none px-3 py-2"
        />
        <button type="submit" disabled={isAiTyping || !inputValue.trim()} class="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors">
          <Icon name="send" className="h-5 w-5" />
        </button>
      </form>
    </div>
  </div>
</div>