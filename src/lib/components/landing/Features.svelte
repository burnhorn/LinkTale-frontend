<script lang="ts">
    import Icon from '$lib/Icon.svelte';

    const primaryFeatures = [
        {
            name_alt: '무한한 이야기의 가능성.',
            description: '간단한 프롬프트만 제공하면 AI가 기승전결이 완벽하지만 독특하고 매혹적인 스토리를 엮어냅니다. 구체적인 스토리를 고민할 필요가 없습니다.',
            icon_name: "sparkle",
            imageUrl: "https://picsum.photos/seed/feature1/500/500",
        },
        {
            name_alt: '아이, 주인공',
            description: "캐릭터, 이름, 심지어 성격 특성까지 쉽게 사용자 지정할 수 있습니다. 자녀를 자신만의 모험의 주인공으로 만들어 자녀가 소중히 여길 매력적인 동화책도 만들어 보세요.",
            icon_name: "userCircle",
            imageUrl: "https://picsum.photos/seed/feature2/500/500",
        },
        {
            name_alt: '삽화로 생동감이 넘치는 이야기',
            description: '진행 상황에 맞게 생성된 놀랍고 고품질의 일러스트로 스토리에 생동감을 불어넣으세요. 다양한 이미지 스타일 중에서 선택하여 스토리에 완벽한 모습을 찾아보세요.',
            icon_name: "paintBrush",
            imageUrl: "https://picsum.photos/seed/feature3/500/500",
        },
    ];

    const howItWorksSteps = [
        { number: "1", title: "간단한 시작", description: "'달로 날아가고 싶은 용감한 다람쥐' 같은 간단한 아이디어부터 시작하세요."},
        { number: "2", title: "초개인화된 명령", description: "구체적인 주인공의 모습과 삽화 스타일를 AI에게 지시할 수도 있습니다."},
        { number: "3", title: "즐기기", description: "아름다운 삽화가 그려진 동화책을 읽고 공유할 수 있습니다."}
    ];
</script>

<section id="features" class="py-24 sm:py-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h2 class="text-base font-semibold leading-7 text-purple-600">어떻게 동화책을 만들 수 있을까요?</h2>
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
                아이디어, 구체화, 책까지 3단계의 간단한 단계
            </p>
            <p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-600">
                직관적인 제작 흐름은 이야기를 쉽게 만들어 줍니다. <br /> 아이가 간단한 단어만을 제공하더라도 가장 적합한 스토리와 삽화를 생성할 수 있습니다.
            </p>
        </div>
        
        <div class="mt-20 max-w-lg sm:mx-auto md:max-w-none">
            <div class="grid grid-cols-1 gap-y-16 md:grid-cols-3 md:gap-x-12 md:gap-y-16">
                {#each howItWorksSteps as step}
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-purple-600 text-white">
                                <span class="text-xl font-bold">{step.number}</span>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold leading-6 text-gray-900">{step.title}</h4>
                            <p class="mt-2 text-base text-gray-600">{step.description}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <div class="mt-32 space-y-20">
            {#each primaryFeatures as feature, index}
                <div class="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8">
                    {#if index % 2 === 1}
                        <!-- Reversed layout for odd items -->
                        <div class="mt-6 lg:mt-0 lg:col-start-8 lg:col-span-5">
                            <div class="flex items-center">
                                <div class="p-2 bg-purple-600/10 rounded-md">
                                    <Icon name="sparkle" className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 class="ml-3 text-2xl font-bold font-display text-gray-900">{feature.name_alt}</h3>
                            </div>
                            <p class="mt-4 text-lg text-gray-600">{feature.description}</p>
                        </div>
                        <div class="flex-auto lg:col-start-1 lg:row-start-1 lg:col-span-7">
                            <div class="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100 shadow-lg">
                                <img src={feature.imageUrl} alt={feature.name_alt} class="object-cover" />
                            </div>
                        </div>
                    {:else}
                        <!-- Default layout for even items -->
                        <div class="mt-6 lg:mt-0 lg:col-span-5">
                            <div class="flex items-center">
                                <div class="p-2 bg-purple-600/10 rounded-md">
                                    <Icon name="userCircle" className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 class="ml-3 text-2xl font-bold font-display text-gray-900">{feature.name_alt}</h3>
                            </div>
                            <p class="mt-4 text-lg text-gray-600">{feature.description}</p>
                        </div>
                        <div class="flex-auto lg:col-start-6 lg:col-span-7">
                            <div class="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100 shadow-lg">
                                <img src={feature.imageUrl} alt={feature.name_alt} class="object-cover" />
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>