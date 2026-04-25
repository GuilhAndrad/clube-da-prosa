<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { supabase } from '../lib/supabase.js'
  import { formatDate, getFingerprint } from '../lib/utils.js'

  export let slug

  const dispatch = createEventDispatcher()

  let post = null
  let profile = null
  let loading = true
  let notFound = false
  let liked = false
  let likeLoading = false
  let fingerprint = ''

  onMount(async () => {
    fingerprint = getFingerprint()

    const [postRes, profileRes] = await Promise.all([
      supabase
        .from('posts')
        .select('id,title,slug,excerpt,content,cover_url,likes_count,published_at,created_at,is_published')
        .eq('slug', slug)
        .maybeSingle(),
      supabase.from('profiles').select('name,photo_url').limit(1).maybeSingle()
    ])

    if (!postRes.data || !postRes.data.is_published) {
      notFound = true
    } else {
      post = postRes.data
      profile = profileRes.data

      // Check if user already liked
      const { data: likeData } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('fingerprint', fingerprint)
        .maybeSingle()

      liked = !!likeData
    }

    loading = false
  })

  async function toggleLike() {
    if (!post || likeLoading) return
    likeLoading = true
    try {
      const { data } = await supabase.rpc('toggle_like', {
        p_post_id: post.id,
        p_fingerprint: fingerprint
      })
      liked = !liked
      post = { ...post, likes_count: data }
    } catch (e) {
      console.error(e)
    } finally {
      likeLoading = false
    }
  }

  function estimateReadTime(html) {
    if (!html) return 1
    const words = html.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.max(1, Math.round(words / 200))
  }
</script>

{#if loading}
  <div class="max-w-2xl mx-auto px-6 py-20">
    <div class="animate-pulse space-y-4">
      <div class="h-4 bg-stone-200 rounded w-24"></div>
      <div class="h-10 bg-stone-200 rounded w-4/5"></div>
      <div class="h-4 bg-stone-100 rounded w-full"></div>
      <div class="h-4 bg-stone-100 rounded w-5/6"></div>
      <div class="h-64 bg-stone-100 rounded-2xl mt-8"></div>
    </div>
  </div>
{:else if notFound}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center px-4">
      <p class="text-6xl font-serif text-stone-200 mb-4">404</p>
      <p class="text-stone-500 mb-6">Artigo não encontrado.</p>
      <button class="btn-primary" on:click={() => dispatch('navigate', '/')}>Voltar ao início</button>
    </div>
  </div>
{:else if post}
  <article class="max-w-2xl mx-auto px-6 py-12">
    <!-- Back -->
    <button
      on:click={() => dispatch('navigate', '/')}
      class="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-10"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Todos os artigos
    </button>

    <!-- Header -->
    <header class="mb-10">
      <div class="flex items-center gap-3 mb-5">
        <time class="text-xs font-medium text-stone-400 uppercase tracking-wider">
          {formatDate(post.published_at || post.created_at)}
        </time>
        <span class="text-stone-200">·</span>
        <span class="text-xs text-stone-400">{estimateReadTime(post.content)} min de leitura</span>
      </div>

      <h1 class="font-serif text-3xl md:text-4xl font-semibold text-stone-900 leading-tight mb-5">
        {post.title}
      </h1>

      {#if post.excerpt}
        <p class="text-xl text-stone-500 font-serif italic leading-relaxed border-l-4 border-sage-300 pl-5">
          {post.excerpt}
        </p>
      {/if}

      {#if profile}
        <div class="flex items-center gap-3 mt-6 pt-6 border-t border-stone-100">
          {#if profile.photo_url}
            <img src={profile.photo_url} alt={profile.name} class="w-10 h-10 rounded-full object-cover border border-stone-100" />
          {/if}
          <div>
            <p class="text-sm font-medium text-stone-700">{profile.name}</p>
          </div>
        </div>
      {/if}
    </header>

    <!-- Cover image -->
    {#if post.cover_url}
      <div class="rounded-2xl overflow-hidden mb-10 aspect-[16/9] bg-stone-100">
        <img src={post.cover_url} alt={post.title} class="w-full h-full object-cover" />
      </div>
    {/if}

    <!-- Content -->
    <div class="prose-blog">
      {@html post.content}
    </div>

    <!-- Like section -->
    <div class="mt-16 pt-10 border-t border-stone-100 flex flex-col items-center gap-4">
      <p class="font-serif text-lg text-stone-600">Gostou deste artigo?</p>
      <button
        on:click={toggleLike}
        disabled={likeLoading}
        class="group flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
        class:border-blush-400={liked}
        class:bg-blush-50={liked}
        class:text-blush-600={liked}
        class:focus:ring-blush-400={liked}
        class:border-stone-200={!liked}
        class:text-stone-500={!liked}
        class:hover:border-blush-300={!liked}
        class:hover:text-blush-500={!liked}
        class:focus:ring-stone-300={!liked}
      >
        <svg
          class="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <span class="font-medium text-sm">
          {liked ? 'Amei!' : 'Amei'} · {post.likes_count}
        </span>
      </button>
      <p class="text-xs text-stone-400">Seu feedback é muito importante!</p>
    </div>

    <!-- Back to top + more articles -->
    <div class="mt-12 flex justify-center">
      <button
        on:click={() => dispatch('navigate', '/')}
        class="btn-secondary"
      >
        ← Mais artigos
      </button>
    </div>
  </article>
{/if}