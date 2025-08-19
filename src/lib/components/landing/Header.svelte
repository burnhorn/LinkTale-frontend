<script lang="ts">
  import Icon from '$lib/Icon.svelte';
</script>

<header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <div class="flex-shrink-0 flex items-center">
        <Icon name="worldExplorer" className="h-8 w-8 text-purple-600" />
        <span class="ml-3 text-2xl font-bold font-display text-gray-900">SparkWeaver AI</span>
      </div>
      <div class="hidden md:flex items-center space-x-8">
        <a href="#features" class="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</a>
        <a href="#testimonials" class="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">Testimonials</a>
        <a href="#faq" class="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">FAQ</a>
      </div>
      <div class="flex items-center">
        <!-- <a href="/login" class="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors mr-6">Log In</a> -->
        <a href="/create" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
          무료로 시작하기
        </a>
      </div>
    </div>
  </div>
</header>
