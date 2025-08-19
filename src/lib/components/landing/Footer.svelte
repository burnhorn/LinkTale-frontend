<script lang="ts">
    import Icon from '$lib/Icon.svelte';
</script>

<footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="xl:grid xl:grid-cols-3 xl:gap-8">
            <div class="space-y-8 xl:col-span-1">
                <div class="flex items-center">
                    <Icon name="worldExplorer" className="h-8 w-8 text-purple-600" />
                    <span class="ml-3 text-2xl font-bold font-display text-gray-900">SparkWeaver AI</span>
                </div>
                <p class="text-gray-500 text-base">
                    최신 AI를 사용하여 마법 같은 맞춤형 어린이 동화책를 만들어 보세요. 아이의 상상력을 자극하고 독서 습관을 기르는 데 도움을 줍니다.
                </p>
                <!-- <div class="flex space-x-6">
                   <a href="/" class="text-gray-400 hover:text-gray-500">
                       <span class="sr-only">Twitter</span>
                       <Icon name="twitter" className="h-6 w-6" />
                   </a>
                   <a href="/" class="text-gray-400 hover:text-gray-500">
                       <span class="sr-only">GitHub</span>
                       <Icon name="github" className="h-6 w-6" />
                   </a>
                </div> -->
            </div>
            <div class="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                <div class="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                        <h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase">Solutions</h3>
                        <ul class="mt-4 space-y-4">
                            <li><a href="#features" class="text-base text-gray-500 hover:text-gray-900">AI Story Writer</a></li>
                            <li><a href="#features" class="text-base text-gray-500 hover:text-gray-900">Illustration Generator</a></li>
                            <li><a href="#features" class="text-base text-gray-500 hover:text-gray-900">Personalized Books</a></li>
                        </ul>
                    </div>
                    <div class="mt-12 md:mt-0">
                        <h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase">Support</h3>
                        <ul class="mt-4 space-y-4">
                            <li><a href="#faq" class="text-base text-gray-500 hover:text-gray-900">FAQ</a></li>
                            <li><a href="/" class="text-base text-gray-500 hover:text-gray-900">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div class="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                        <h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase">Company</h3>
                        <ul class="mt-4 space-y-4">
                            <li><a href="/" class="text-base text-gray-500 hover:text-gray-900">About</a></li>
                            <li><a href="/" class="text-base text-gray-500 hover:text-gray-900">Blog</a></li>
                        </ul>
                    </div>
                    <div class="mt-12 md:mt-0">
                        <h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
                        <ul class="mt-4 space-y-4">
                            <li><a href="/" class="text-base text-gray-500 hover:text-gray-900">Privacy</a></li>
                            <li><a href="/" class="text-base text-gray-500 hover:text-gray-900">Terms</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-12 border-t border-gray-200 pt-8">
            <p class="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} SparkWeaver AI. All rights reserved.</p>
        </div>
    </div>
</footer>
