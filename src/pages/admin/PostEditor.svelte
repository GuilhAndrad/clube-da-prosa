<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { supabase } from '../../lib/supabase.js'
  import { session } from '../../lib/auth.js'
  import { slugify } from '../../lib/utils.js'
  import RichEditor from '../../components/RichEditor.svelte'
  export let postId = null

  const dispatch = createEventDispatcher()

  let title = ''
  let slug = ''
  let excerpt = ''
  let content = ''
  let cover_url = ''
  let is_published = false
  let slugManuallyEdited = false

  let saving = false
  let saveStatus = ''
  let loading = !!postId
  let error = ''

  onMount(async () => {
    if (postId) {
      const { data, error: e } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .maybeSingle()

      if (e || !data) {
        error = 'Artigo não encontrado.'
      } else {
        title = data.title
        slug = data.slug
        excerpt = data.excerpt
        content = data.content
        cover_url = data.cover_url
        is_published = data.is_published
        slugManuallyEdited = true
      }
      loading = false
    }
  })

  function handleTitleInput() {
    if (!slugManuallyEdited) {
      slug = slugify(title)
    }
  }

  function handleSlugInput() {
    slugManuallyEdited = true
    slug = slugify(slug)
  }

  function handleContentChange(e) {
    content = e.detail
  }

  async function save(publish = null) {
    if (!title.trim()) {
      error = 'O título é obrigatório.'
      return
    }
    if (!slug.trim()) {
      slug = slugify(title)
    }

    saving = true
    error = ''
    saveStatus = ''

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content,
      cover_url: cover_url.trim(),
      is_published: publish !== null ? publish : is_published,
      published_at: (publish === true || (publish === null && is_published))
        ? new Date().toISOString()
        : null,
    }

    try {
      if (postId) {
        const { error: e } = await supabase.from('posts').update(payload).eq('id', postId)
        if (e) throw e
      } else {
        const { data, error: e } = await supabase
          .from('posts')
          .insert({ ...payload, user_id: (await supabase.auth.getUser()).data.user.id })
          .select('id')
          .single()
        if (e) throw e
        postId = data.id
        window.history.replaceState({}, '', `/admin/editar/${postId}`)
      }

      if (publish !== null) is_published = publish
      saveStatus = publish === true ? 'Publicado!' : 'Salvo!'
      setTimeout(() => saveStatus = '', 3000)
    } catch (e) {
      error = e.message || 'Erro ao salvar.'
    } finally {
      saving = false
    }
  }
</script>

<div class="min-h-screen bg-stone-50">
  <!-- Header -->
  <header class="bg-white border-b border-stone-100 sticky top-0 z-30">
    <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <button
          on:click={() => dispatch('navigate', '/admin')}
          class="text-stone-400 hover:text-stone-700 transition-colors flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-stone-600 truncate">
          {postId ? 'Editar artigo' : 'Novo artigo'}
        </span>
      </div>

      <div class="hidden lg:flex items-center gap-2 flex-shrink-0">
        {#if saveStatus}
          <span class="text-xs text-sage-600 font-medium">{saveStatus}</span>
        {/if}
        <button
          type="button"
          on:click={() => save(null)}
          disabled={saving}
          class="btn-secondary text-sm"
        >
          Salvar rascunho
        </button>
        {#if !is_published}
          <button
            type="button"
            on:click={() => save(true)}
            disabled={saving}
            class="btn-primary text-sm flex items-center gap-2"
          >
            Publicar
          </button>
        {:else}
          <button
            type="button"
            on:click={() => save(false)}
            disabled={saving}
            class="btn-secondary text-sm text-stone-500"
          >
            Despublicar
          </button>
        {/if}
      </div>
    </div>
  </header>

  {#if loading}
    <div class="max-w-3xl mx-auto px-6 py-20 animate-pulse space-y-4">
      <div class="h-10 bg-stone-200 rounded w-3/4"></div>
      <div class="h-4 bg-stone-100 rounded w-1/3"></div>
      <div class="h-48 bg-stone-100 rounded-xl"></div>
    </div>
  {:else}
    <main class="max-w-3xl mx-auto px-6 py-10">
      {#if error}
        <div class="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-5 py-4 mb-6">{error}</div>
      {/if}

      <form on:submit|preventDefault={() => save(null)} class="space-y-6">
        <!-- Title -->
        <div>
          <input
            type="text"
            bind:value={title}
            on:input={handleTitleInput}
            placeholder="Título do artigo"
            class="w-full border-0 border-b-2 border-stone-200 bg-transparent text-3xl font-serif font-semibold text-stone-900 placeholder-stone-300 py-3 focus:outline-none focus:border-sage-400 transition-colors"
          />
        </div>

        <!-- Slug -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-stone-400 font-mono whitespace-nowrap">/artigo/</span>
          <input
            type="text"
            bind:value={slug}
            on:input={handleSlugInput}
            placeholder="url-do-artigo"
            class="flex-1 text-xs font-mono text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
          />
        </div>

        <!-- Excerpt -->
        <div>
          <label class="block text-xs font-medium text-stone-500 mb-2" for="post-excerpt">Resumo (aparece no feed e artigo)</label>
          <textarea
            id="post-excerpt"
            bind:value={excerpt}
            placeholder="Um breve resumo ou introdução do artigo..."
            rows="3"
            class="input-field resize-none"
          ></textarea>
        </div>

        <!-- Cover image -->
        <div>
          <label class="block text-xs font-medium text-stone-500 mb-2" for="post-cover">URL da imagem de capa</label>
          <input
            id="post-cover"
            type="url"
            bind:value={cover_url}
            placeholder="https://..."
            class="input-field"
          />
          {#if cover_url}
            <div class="mt-3 rounded-xl overflow-hidden aspect-[16/9] bg-stone-100">
              <img src={cover_url} alt="Capa" class="w-full h-full object-cover" />
            </div>
          {/if}
        </div>

        <!-- Content editor -->
        <div>
          <label class="block text-xs font-medium text-stone-500 mb-2">Conteúdo</label>
          <RichEditor bind:value={content} on:change={handleContentChange} />
        </div>

        <!-- Save bottom -->
        <div class="flex justify-end gap-3 pt-4 border-t border-stone-100">
          <button type="submit" class="btn-secondary" disabled={saving}>Salvar rascunho</button>
          {#if !is_published}
            <button type="button" on:click={() => save(true)} class="btn-primary" disabled={saving}>Publicar agora</button>
          {:else}
            <button type="button" on:click={() => save(false)} class="btn-secondary text-stone-500" disabled={saving}>Despublicar</button>
          {/if}
        </div>
      </form>
    </main>
  {/if}
</div>
