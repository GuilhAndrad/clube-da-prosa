<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { supabase } from '../lib/supabase.js'
  import PostCard from '../components/PostCard.svelte'

  const dispatch = createEventDispatcher()

  let posts = []
  let featuredPost = null
  let profile = null
  let loading = true

  onMount(async () => {
    const [postsRes, profileRes] = await Promise.all([
      supabase
        .from('posts')
        .select('id,title,slug,excerpt,content,cover_url,likes_count,published_at,created_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false }),
      supabase.from('profiles').select('name,bio,photo_url').limit(1).maybeSingle()
    ])

    if (postsRes.data) {
      featuredPost = postsRes.data[0] || null
      posts = postsRes.data.slice(1)
    }
    profile = profileRes.data
    loading = false
  })

  // Limpa o HTML para exibições de linha única
  function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  }

  function handleNavigate(e) {
    dispatch('navigate', e.detail)
  }
</script>

<div class="min-h-screen">
  {#if loading}
    <div class="max-w-4xl mx-auto px-6 py-20 space-y-8">
      {#each [1,2,3] as _}
        <div class="animate-pulse">
          <div class="h-4 bg-stone-200 rounded w-24 mb-3"></div>
          <div class="h-6 bg-stone-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-stone-100 rounded w-full mb-1"></div>
          <div class="h-4 bg-stone-100 rounded w-5/6"></div>
        </div>
      {/each}
    </div>
  {:else if !featuredPost && posts.length === 0}
    <div class="max-w-4xl mx-auto px-6 py-32 text-center">
      {#if profile}
        <div class="mb-8">
          {#if profile.photo_url}
            <img src={profile.photo_url} alt={profile.name} class="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-stone-100" />
          {/if}
          <h1 class="font-serif text-3xl font-semibold text-stone-900 mb-3">{profile.name}</h1>
          <div class="text-stone-500 max-w-lg mx-auto leading-relaxed bio-rich-text">
            {@html profile.bio}
          </div>
        </div>
      {/if}
      <p class="text-stone-400 text-sm">Nenhum artigo publicado ainda.</p>
    </div>
  {:else}
    {#if profile}
      <div class="bg-white border-b border-stone-100">
        <div class="max-w-4xl mx-auto px-6 py-10 flex items-center gap-5">
          {#if profile.photo_url}
            <img src={profile.photo_url} alt={profile.name} class="w-14 h-14 rounded-full object-cover border-2 border-stone-100 flex-shrink-0" />
          {/if}
          <div>
            <p class="text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">Por</p>
            <h1 class="font-serif text-xl font-semibold text-stone-900">{profile.name}</h1>
            {#if profile.bio}
              <p class="text-sm text-stone-500 mt-0.5 line-clamp-1">{stripHtml(profile.bio)}</p>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <div class="max-w-4xl mx-auto px-6">
      {#if featuredPost}
        <div class="py-12 border-b border-stone-100">
          <p class="text-xs font-medium text-stone-400 uppercase tracking-wider mb-6">Artigo em destaque</p>
          <div
            class="group cursor-pointer"
            on:click={() => dispatch('navigate', `/artigo/${featuredPost.slug}`)}
            on:keydown={(e) => e.key === 'Enter' && dispatch('navigate', `/artigo/${featuredPost.slug}`)}
            role="link"
            tabindex="0"
          >
            {#if featuredPost.cover_url}
              <div class="relative overflow-hidden rounded-2xl mb-6 aspect-[21/9] bg-stone-100">
                <img
                  src={featuredPost.cover_url}
                  alt={featuredPost.title}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>
              </div>
            {/if}
            <h2 class="font-serif text-3xl md:text-4xl font-semibold text-stone-900 group-hover:text-sage-700 transition-colors leading-tight mb-4">
              {featuredPost.title}
            </h2>
            {#if featuredPost.excerpt}
              <p class="text-stone-500 text-lg leading-relaxed mb-5 max-w-2xl">{featuredPost.excerpt}</p>
            {/if}
            <span class="text-sage-600 font-medium hover:underline">Ler artigo completo →</span>
          </div>
        </div>
      {/if}

      {#if posts.length > 0}
        <div class="py-12">
          <p class="text-xs font-medium text-stone-400 uppercase tracking-wider mb-8">Artigos recentes</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            {#each posts as post (post.id)}
              <PostCard {post} on:navigate={handleNavigate} />
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Garante que o HTML dentro da bio não quebre o layout da home */
  :global(.bio-rich-text p) {
    margin-bottom: 0.5rem;
  }
</style>