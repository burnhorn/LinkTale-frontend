<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let text: string;
  export let speed = 50;
  export let className = '';
  export let onComplete: () => void = () => {};

  let displayedText = '';
  let intervalId: any;

  function startTyping() {
    displayedText = '';
    let i = 0;
    
    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
      if (i < text.length) {
        displayedText += text.charAt(i);
        i++;
      } else {
        clearInterval(intervalId);
        onComplete();
      }
    }, speed);
  }

  // text prop이 변경될 때마다 타이핑을 다시 시작
  $: if (text) {
    startTyping();
  }

  onMount(() => {
    startTyping();
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>

<p class={className}>
  {displayedText}
</p>
