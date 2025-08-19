<script lang="ts">
    import Icon from '$lib/Icon.svelte';

    const faqs = [
        {
            question: "AI 스토리 생성은 어떻게 작동하나요?",
            answer: "저희 시스템은 아이와의 상호작용을 위해 정교한 AI 파이프라인을 사용합니다. 다양한 AI를 사용하여 창의적인 텍스트와 일러스트레이션를 생성함으로써 일관되고 고품질의 동화책을 만들 수 있습니다."
        },
        {
            question: "콘텐츠가 아이들에게 안전하고 적절한가요?",
            answer: "물론이죠. 저희는 검증된 콘텐츠 필터링과 안전 점검 기능을 가진 AI를 사용하고 있습니다. 생성된 모든 스토리와 이미지는 아이들에게 긍정적이고 연령에 적합한 영감을 줄 수 있도록 설계되었습니다."
        },
        {
            question: "생성된 동화책은 저장할 수 있나요?",
            answer: "생성하는 모든 스토리는 고해상도 PDF 파일로 저장할 수 있습니다. 이 형식은 어디서든지 인쇄할 수 있으며 가족 및 친구와 디지털로 공유하기에 완벽합니다."
        },
        {
            question: "스토리가 생성된 후에 변경할 수 있나요?",
            answer: "현재 저희는 아이의 단어만으로도 완전한 스토리를 생성하는 데 중점을 두고 있습니다. 초기 세대 이후 더 세분화된 편집과 사용자 지정이 가능한 기능을 개발 중입니다. 계속 지켜봐 주세요!"
        }
    ];

    let openStates = Array(faqs.length).fill(false);

    function toggleFaq(index: number) {
        openStates[index] = !openStates[index];
    }
</script>

<section id="faq" class="py-24 sm:py-32">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
                자주 묻는 질문들
            </h2>
            <p class="mt-4 text-lg leading-8 text-gray-600">
                원하는 것을 찾을 수 없다면 언제든지 저희에게 연락해 주세요.
            </p>
        </div>
        <div class="mt-16">
            <dl class="space-y-4">
                {#each faqs as faq, index}
                    <div class="border-b border-gray-200 py-6">
                        <dt>
                            <button on:click={() => toggleFaq(index)} class="flex w-full items-start justify-between text-left text-gray-900">
                                <span class="text-base font-semibold leading-7">{faq.question}</span>
                                <span class="ml-6 flex h-7 items-center">
                                    {#if openStates[index]}
                                        <Icon name="chevronUp" className="h-6 w-6" />
                                    {:else}
                                        <Icon name="chevronDown" className="h-6 w-6" />
                                    {/if}
                                </span>
                            </button>
                        </dt>
                        {#if openStates[index]}
                            <dd class="mt-2 pr-12">
                                <p class="text-base leading-7 text-gray-600">{faq.answer}</p>
                            </dd>
                        {/if}
                    </div>
                {/each}
            </dl>
        </div>
    </div>
</section>
