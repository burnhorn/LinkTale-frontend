<script lang="ts">
    import Icon from '$lib/Icon.svelte';

    const testimonials = [
        {
            text: "부모로서 이것은 마법과도 같습니다. 이야기 속 자신을 보는 딸의 얼굴이 환해졌어요! 동화를 만드는 과정은 매우 간단했고 결과는 놀라웠습니다.",
            author: '베타 테스터',
            handle: '블로거',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        },
        {
            text: "일러스트가 놀라울 정도로 아름답고 스토리와 일관성이 있습니다. 동화책 서비스 산업을 바꿀 수 있는 제품입니다. 강력히 추천합니다!",
            author: '알파 테스터',
            handle: '유치원 교사',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
        },
        {
            text: "동생이 심심하다고 해서 같이 사용했는데 가장 독특한 서비스였어요. 동생은 이 서비스로 만든 동화책을 매일 밤에 읽습니다. 원하는 스토리와 일러스트 생성 기능이 제일 마음에 들어요!",
            author: '베타 테스터',
            handle: '일반인',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
        }
    ];
</script>

<section id="testimonials" class="py-24 sm:py-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h2 class="text-base font-semibold leading-7 text-purple-600">Social Proof</h2>
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
                부모, 교육자, 아이들을 위한 제품
            </p>
            <p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-600">
                이 서비스를 실제 사용한 사람들의 후기를 보세요!
                <br /> 마법 같은 동화책 창작물에 대해 이렇게 말하고 있습니다.
            </p>
        </div>
        <div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {#each testimonials as testimonial}
                <div class="flex flex-col bg-white p-6 rounded-lg shadow-lg border border-gray-100 h-full">
                    <div class="flex text-yellow-400">
                        {#each Array(5) as _, i}
                            <Icon name="starFilled" className="h-5 w-5 fill-current" />
                        {/each}
                    </div>
                    <p class="mt-4 text-gray-600 flex-grow">"{testimonial.text}"</p>
                    <div class="mt-6 flex items-center">
                        <img src={testimonial.avatar} alt={testimonial.author} class="h-12 w-12 rounded-full" />
                        <div class="ml-4">
                            <p class="font-semibold text-gray-900">{testimonial.author}</p>
                            <p class="text-sm text-gray-600">{testimonial.handle}</p>
                        </div>
                        <Icon name="twitter" className="ml-auto h-6 w-6 text-blue-400" />
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>