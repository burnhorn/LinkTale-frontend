<script lang="ts">
  import { onMount } from 'svelte';
  import { imageEditorModalState } from '$lib/stores';
  import Icon from '$lib/Icon.svelte';
  import { editSceneImage } from '$lib/apiService';

  let canvasElement: HTMLCanvasElement;
  let prompt = '';
  let penColor = '#000000';
  let isDrawing = false;
  let isLoading = false;
  let backgroundImage: HTMLImageElement | null = null;
  
  // Svelte의 스토어 자동 구독($) 문법을 사용하여 코드를 더 간결하게 만듭니다.
  // 이 컴포넌트가 활성화되어 있을 때만 스토어를 구독하므로 메모리 누수 걱정이 없습니다.
  $: state = $imageEditorModalState;

  // Svelte의 반응형 구문($:)을 사용하여 state.imageUrl이 변경될 때마다 자동으로 실행됩니다.
  $: if (canvasElement && state.isOpen && state.imageUrl) {
    console.log('[ImageEditor] 이미지 로딩을 시작합니다:', state.imageUrl);
    loadImageToCanvas(state.imageUrl);
  } else if (canvasElement && !state.isOpen) {
    // 모달이 닫히면 캔버스를 깨끗하게 정리합니다.
    clearCanvas(true);
  }

  function loadImageToCanvas(imageUrl: string) {
    const img = new Image();
    // ✅ 1. CORS 허용을 요청하는 가장 중요한 부분
    img.crossOrigin = "Anonymous"; 

    img.src = imageUrl;

    // ✅ 2. 이미지 로딩이 성공했을 때 실행
    img.onload = () => {
      console.log('[ImageEditor] 이미지 로딩 성공!');
      backgroundImage = img;
      drawImageToCanvas();
    };

    // ✅ 3. 이미지 로딩 실패(주로 CORS 문제) 시 실행
    img.onerror = () => {
      console.error('[ImageEditor] 이미지 로딩 실패! CORS 정책을 확인하세요. 서버에서 Access-Control-Allow-Origin 헤더를 보내고 있는지 확인해야 합니다.');
      alert('이미지를 불러오는 데 실패했습니다. 서버의 CORS 설정을 확인해야 할 수 있습니다.');
      // 실패 시에도 사용자가 그림을 그릴 수 있도록 흰 배경을 유지합니다.
      clearCanvas(true);
    };
  }

  function drawImageToCanvas() {
    if (!canvasElement || !backgroundImage) return;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    
    console.log('[ImageEditor] 캔버스에 이미지를 그립니다.');
    // 캔버스를 먼저 흰색으로 채웁니다. (투명한 PNG 이미지를 대비)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    
    // 불러온 이미지를 캔버스에 그립니다.
    ctx.drawImage(backgroundImage, 0, 0, canvasElement.width, canvasElement.height);
  }

  const getCoordinates = (e: MouseEvent | TouchEvent) => {
    const rect = canvasElement.getBoundingClientRect();
    const scaleX = canvasElement.width / rect.width;
    const scaleY = canvasElement.height / rect.height;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawing = true;
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing = false;
  };

  function clearCanvas(isInitialization = false) {
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    // 지우개 버튼을 눌렀을 때(초기화가 아닐 때), 기존 배경 이미지를 다시 그려줍니다.
    if (!isInitialization && backgroundImage) {
       drawImageToCanvas();
    }
  }

  function closeModal() {
    imageEditorModalState.set({ isOpen: false, sceneId: null, imageUrl: null });
  }

  function handleFileUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          backgroundImage = img;
          drawImageToCanvas();
        };
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  async function handleSubmit() {
    // `state.sceneId`를 사용하도록 수정합니다.
    if (!prompt.trim() || !state.sceneId) {
      alert('수정 내용을 입력해주세요.');
      return;
    }
    isLoading = true;
    
    canvasElement.toBlob(async (blob) => {
      if (!blob) {
        alert('이미지 데이터를 생성하는 데 실패했습니다.');
        isLoading = false;
        return;
      }
      try {
        await editSceneImage(state.sceneId!, prompt, blob);
        alert('이미지 수정 요청이 성공적으로 전송되었습니다! AI가 그림을 완성하면 알려드릴게요.');
        closeModal();
      } catch (error) {
        console.error('Image edit submission failed:', error);
        alert(`이미지 수정 요청 실패: ${error}`);
      } finally {
        isLoading = false;
      }
    }, 'image/png');
  }
</script>

{#if $imageEditorModalState.isOpen}
  <div 
    class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm" 
    on:click|self={closeModal}
    on:keydown={(e) => e.key === 'Escape' && closeModal()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
    tabindex="-1"
  >
    <div 
      class="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-4xl animate-fade-in-up"
      role="document"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 id="dialog-title" class="text-2xl font-bold text-white">AI 이미지 편집기</h2>
        <button on:click={closeModal} class="text-slate-400 hover:text-white" aria-label="편집기 닫기">
          <Icon name="plus" className="h-6 w-6 transform rotate-45" />
        </button>
      </div>

      <!-- Canvas & Controls -->
      <div class="mb-4">
        <canvas
          bind:this={canvasElement}
          width={960}
          height={540}
          class="w-full h-auto border-2 border-slate-600 rounded-md cursor-crosshair bg-white"
          on:mousedown={startDrawing} on:mousemove={draw} on:mouseup={stopDrawing} on:mouseleave={stopDrawing}
          on:touchstart={startDrawing} on:touchmove={draw} on:touchend={stopDrawing}
        ></canvas>
        <div class="flex items-center gap-4 mt-2">
            <input type="color" bind:value={penColor} class="w-10 h-10 rounded-md" aria-label="펜 색상 선택" />
            <button type="button" on:click={() => clearCanvas(false)} class="btn-secondary">지우개</button>
            <label class="btn-secondary cursor-pointer">
              이미지 업로드
              <input type="file" accept="image/*" class="hidden" on:change={handleFileUpload} />
            </label>
        </div>
      </div>

      <!-- Input Form -->
      <form on:submit|preventDefault={handleSubmit} class="flex items-center gap-2">
        <input
          type="text"
          bind:value={prompt}
          placeholder="AI에게 원하는 수정 사항을 자세히 알려주세요. (예: '동그라미 친 곳을 돌고래 인형으로 바꿔줘')"
          disabled={isLoading}
          class="flex-1 bg-slate-700 text-slate-200 placeholder-slate-400 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="수정 프롬프트 입력"
        />
        <button type="submit" disabled={isLoading || !prompt.trim()} class="btn-primary flex items-center justify-center w-28">
          {#if isLoading}
            <Icon name="pencilEdit" className="animate-spin" />
          {:else}
            <Icon name="send" />
            <span>전송</span>
          {/if}
        </button>
      </form>
    </div>
  </div>
{/if}

<style>
  .btn-primary {
    @apply bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center gap-2;
  }
  .btn-secondary {
    @apply bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors;
  }
  /* 간단한 애니메이션 추가 */
  @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fade-in-up 0.3s both ease-out; }
</style>