<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { supabase } from '../../lib/supabase.js'
  import { signOut } from '../../lib/auth.js'
  import { formatDate } from '../../lib/utils.js'

  const dispatch = createEventDispatcher()

  let posts = []
  let stats = { total: 0, published: 0, drafts: 0, likes: 0 }
  let loading = true
  let deleteConfirm = null

  onMount(async () => {
    await loadPosts()
  })

  async function loadPosts() {
    loading = true
    const { data } = await supabase
      .from('posts')
      .select('id,title,slug,is_published,likes_count,published_at,created_at')
      .order('created_at', { ascending: false })

    posts = data || []
    stats.total = posts.length
    stats.published = posts.filter(p => p.is_published).length
    stats.drafts = posts.filter(p => !p.is_published).length
    stats.likes = posts.reduce((a, p) => a + (p.likes_count || 0), 0)
    loading = false
  }

  async function togglePublish(post) {
    const { error } = await supabase
      .from('posts')
      .update({
        is_published: !post.is_published,
        published_at: !post.is_published ? new Date().toISOString() : null
      })
      .eq('id', post.id)

    if (!error) {
      posts = posts.map(p => p.id === post.id
        ? { ...p, is_published: !p.is_published, published_at: !p.is_published ? new Date().toISOString() : null }
        : p
      )
      stats.published = posts.filter(p => p.is_published).length
      stats.drafts = posts.filter(p => !p.is_published).length
    }
  }

  async function deletePost(id) {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      posts = posts.filter(p => p.id !== id)
      stats.total = posts.length
      stats.published = posts.filter(p => p.is_published).length
      stats.drafts = posts.filter(p => !p.is_published).length
    }
    deleteConfirm = null
  }

  async function handleSignOut() {
    await signOut()
    dispatch('navigate', '/')
  }
</script>

  <div class="min-h-screen bg-stone-50">
    <!-- Admin header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      
      <div class="flex items-center gap-4">
        <button 
          on:click={() => dispatch('navigate', '/')} 
          class="group flex items-center gap-1 focus:outline-none"
        >
          <span class="font-serif text-xl font-bold text-stone-900 group-hover:text-sage-600 transition-colors">
            psi<span class="text-sage-500">.</span>
          </span>
        </button>

        <div class="flex items-center gap-3 bg-stone-100 px-3 py-1.5 rounded-lg">
          <span class="text-stone-400">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </span>
          <span class="text-xs font-bold uppercase tracking-widest text-stone-600">Painel</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
      <button 
        on:click={() => dispatch('navigate', '/admin/perfil')} 
        class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-sage-700 hover:bg-sage-50 rounded-xl transition-all duration-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        Perfil
      </button>

      <div class="w-px h-4 bg-stone-200 mx-1"></div>

      <button 
        on:click={handleSignOut} 
        class="px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
      >
        Sair
      </button>
    </div>

    </div>
  </header>

  <main class="max-w-5xl mx-auto px-6 py-10">
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {#each [
        { label: 'Total', value: stats.total, color: 'text-stone-700' },
        { label: 'Publicados', value: stats.published, color: 'text-sage-700' },
        { label: 'Rascunhos', value: stats.drafts, color: 'text-blush-600' },
        { label: 'Ameis', value: stats.likes, color: 'text-stone-700' },
      ] as s}
        <div class="card p-5">
          <p class="text-2xl font-semibold {s.color}">{s.value}</p>
          <p class="text-xs text-stone-400 mt-1">{s.label}</p>
        </div>
      {/each}
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="font-serif text-xl font-semibold text-stone-900">Artigos</h2>
      <button on:click={() => dispatch('navigate', '/admin/novo')} class="btn-primary flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Novo artigo
      </button>
    </div>

    <!-- Posts list -->
    {#if loading}
      <div class="space-y-3">
        {#each [1,2,3] as _}
          <div class="card p-5 animate-pulse">
            <div class="h-5 bg-stone-100 rounded w-2/3 mb-2"></div>
            <div class="h-3 bg-stone-50 rounded w-1/3"></div>
          </div>
        {/each}
      </div>
    {:else if posts.length === 0}
      <div class="card p-12 text-center">
        <p class="text-stone-400 mb-4">Nenhum artigo ainda.</p>
        <button on:click={() => dispatch('navigate', '/admin/novo')} class="btn-primary">Criar primeiro artigo</button>
      </div>
    {:else}
      <div class="space-y-2">
        {#each posts as post (post.id)}
          <div class="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <!-- Status dot -->
            <div
              class="w-2 h-2 rounded-full flex-shrink-0"
              class:bg-sage-500={post.is_published}
              class:bg-stone-300={!post.is_published}
              title={post.is_published ? 'Publicado' : 'Rascunho'}
            ></div>

            <!-- Title & meta -->
            <div class="flex-1 min-w-0">
              <p class="font-medium text-stone-800 truncate">{post.title || 'Sem título'}</p>
              <p class="text-xs text-stone-400 mt-0.5">
                {post.is_published ? formatDate(post.published_at) : 'Rascunho'}
                <span class="mx-1">·</span>
                {post.likes_count || 0} ameis
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <button
                on:click={() => dispatch('navigate', `/artigo/${post.slug}`)}
                class="btn-ghost p-2"
                title="Ver artigo"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              <button
                on:click={() => dispatch('navigate', `/admin/editar/${post.id}`)}
                class="btn-ghost p-2"
                title="Editar"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                on:click={() => togglePublish(post)}
                class="btn-ghost p-2 text-xs font-medium"
                title={post.is_published ? 'Despublicar' : 'Publicar'}
              >
                {#if post.is_published}
                  <svg class="w-4 h-4 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                {:else}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                {/if}
              </button>
              <button
                on:click={() => deleteConfirm = post.id}
                class="btn-ghost p-2 hover:text-red-500"
                title="Excluir"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>

<!-- Delete confirm modal -->
{#if deleteConfirm}
  <div class="fixed inset-0 bg-stone-900/50 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" on:click|self={() => deleteConfirm = null} on:keydown={(e) => e.key === 'Escape' && (deleteConfirm = null)}>
    <div class="card p-8 max-w-sm w-full">
      <h3 class="font-serif text-lg font-semibold text-stone-900 mb-2">Excluir artigo?</h3>
      <p class="text-sm text-stone-500 mb-6">Esta ação não pode ser desfeita.</p>
      <div class="flex gap-3">
        <button on:click={() => deleteConfirm = null} class="btn-secondary flex-1">Cancelar</button>
        <button on:click={() => deletePost(deleteConfirm)} class="flex-1 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors">Excluir</button>
      </div>
    </div>
  </div>
{/if}