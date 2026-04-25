<script>
  import { createEventDispatcher } from 'svelte'
  import { formatDate, truncate, stripHtml } from '../lib/utils.js'

  export let post

  const dispatch = createEventDispatcher()

  function nav(slug) {
    dispatch('navigate', `/artigo/${slug}`)
  }
</script>

<div
  class="group cursor-pointer"
  on:click={() => nav(post.slug)}
  on:keydown={(e) => e.key === 'Enter' && nav(post.slug)}
  role="button"
  tabindex="0"
>
  {#if post.cover_url}
    <div class="relative overflow-hidden rounded-2xl mb-5 aspect-[16/9] bg-stone-100">
      <img
        src={post.cover_url}
        alt={post.title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>
  {/if}

  <div>
    <time class="text-xs font-medium text-stone-400 uppercase tracking-wider">
      {formatDate(post.published_at || post.created_at)}
    </time>

    <h2 class="font-serif text-xl font-semibold text-stone-900 mt-2 mb-2 group-hover:text-sage-700 transition-colors leading-snug line-clamp-2">
      {post.title}
    </h2>

    {#if post.excerpt}
      <p class="text-sm text-stone-500 leading-relaxed line-clamp-3">
        {post.excerpt}
      </p>
    {:else}
      <p class="text-sm text-stone-500 leading-relaxed line-clamp-3">
        {truncate(stripHtml(post.content), 160)}
      </p>
    {/if}

    <div class="flex items-center gap-4 mt-4">
      <span class="inline-flex items-center gap-1 text-xs text-stone-400">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        {post.likes_count || 0}
      </span>
      <span class="text-xs text-sage-600 font-medium group-hover:underline">Ler artigo →</span>
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>