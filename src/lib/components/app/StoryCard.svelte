<script lang="ts">
  import type { StoryBook } from '../../types';
  import Icon from '$lib/Icon.svelte';

  export let book: StoryBook;
</script>

<button on:click class="flex-shrink-0 w-64 snap-start group text-left">
  <div class="relative rounded-lg overflow-hidden shadow-lg transition-transform transform-gpu group-hover:-translate-y-2 group-hover:shadow-cyan-500/20">
    <img src={book.coverImageUrl} alt={book.title} class="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105" />
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
    <div class="absolute bottom-0 left-0 p-4">
      <h3 class="font-bold text-lg text-white truncate">{book.title}</h3>
      <div class="flex items-center text-xs text-slate-300 mt-1 gap-4">
        <div class="flex items-center gap-1"><Icon name="heart" className="h-4 w-4 text-pink-400" /> {book.likes.toLocaleString()}</div>
        <div class="flex items-center gap-1"><Icon name="eye" className="h-4 w-4 text-slate-400" /> {book.views.toLocaleString()}</div>
      </div>
    </div>
  </div>
  <div class="flex items-center gap-2 mt-2">
    <Icon name="user" className="h-4 w-4 text-slate-500" />
    <p class="text-sm text-slate-400 font-medium truncate">글쓴이: {book.authorName}</p>
  </div>
</button>
