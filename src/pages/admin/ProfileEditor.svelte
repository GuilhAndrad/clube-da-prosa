<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { supabase } from '../../lib/supabase.js'
  // Importação do componente de editor rico
  import RichEditor from '../../components/RichEditor.svelte'

  const dispatch = createEventDispatcher()

  let name = ''
  let bio = ''
  let photo_url = ''
  let instagram = ''
  let linkedin = ''
  let email = ''

  let profileId = null
  let loading = true
  let saving = false
  let saveStatus = ''
  let error = ''

  onMount(async () => {
    const user = (await supabase.auth.getUser()).data.user
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()

    if (data) {
      profileId = data.id
      name = data.name || ''
      bio = data.bio || ''
      photo_url = data.photo_url || ''
      instagram = data.instagram || ''
      linkedin = data.linkedin || ''
      email = data.email || ''
    }
    loading = false
  })

  // Função para capturar a mudança de conteúdo do editor
  function handleBioChange(e) {
    bio = e.detail
  }

  async function save() {
    saving = true
    error = ''
    saveStatus = ''

    const user = (await supabase.auth.getUser()).data.user

    const payload = { name, bio, photo_url, instagram, linkedin, email, updated_at: new Date().toISOString() }

    try {
      if (profileId) {
        const { error: e } = await supabase.from('profiles').update(payload).eq('id', profileId)
        if (e) throw e
      } else {
        const { data, error: e } = await supabase.from('profiles').insert({ ...payload, user_id: user.id }).select('id').single()
        if (e) throw e
        profileId = data.id
      }
      saveStatus = 'Perfil salvo!'
      setTimeout(() => saveStatus = '', 3000)
    } catch (e) {
      error = e.message || 'Erro ao salvar.'
    } finally {
      saving = false
    }
  }
</script>

<div class="min-h-screen bg-stone-50">
  <header class="bg-white border-b border-stone-100 sticky top-0 z-30">
    <div class="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button on:click={() => dispatch('navigate', '/admin')} class="text-stone-400 hover:text-stone-700 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-stone-600">Editar Perfil</span>
      </div>
      {#if saveStatus}
        <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div class="bg-sage-900 text-white text-sm rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3 border border-sage-800/20">
            <svg class="w-5 h-5 text-sage-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span class="font-medium">{saveStatus}</span>
          </div>
        </div>
      {/if}
    </div>
  </header>

  {#if loading}
    <div class="max-w-2xl mx-auto px-6 py-20 animate-pulse space-y-4">
      <div class="w-20 h-20 rounded-full bg-stone-200 mx-auto"></div>
      <div class="h-5 bg-stone-200 rounded w-1/2 mx-auto"></div>
      <div class="h-24 bg-stone-100 rounded-xl"></div>
    </div>
  {:else}
    <main class="max-w-2xl mx-auto px-6 py-10">
      {#if error}
        <div class="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-5 py-4 mb-6">{error}</div>
      {/if}

      <form on:submit|preventDefault={save} class="space-y-6">
        <div class="flex items-center gap-5">
          <div class="w-20 h-20 rounded-full bg-stone-100 overflow-hidden border-2 border-stone-200 flex-shrink-0">
            {#if photo_url}
              <img src={photo_url} alt={name} class="w-full h-full object-cover" />
            {:else}
              <div class="w-full h-full flex items-center justify-center">
                <svg class="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            {/if}
          </div>
          <div class="flex-1">
            <label class="block text-xs font-medium text-stone-500 mb-2" for="prof-photo">URL da foto de perfil</label>
            <input
              id="prof-photo"
              type="url"
              bind:value={photo_url}
              placeholder="https://..."
              class="input-field"
            />
          </div>
        </div>

        <div class="card p-6 space-y-5">
          <div>
            <label class="block text-xs font-medium text-stone-500 mb-2" for="prof-name">Nome completo</label>
            <input id="prof-name" type="text" bind:value={name} placeholder="Dra. Maria Silva" class="input-field" />
          </div>

          <div>
            <label class="block text-xs font-medium text-stone-500 mb-2">Biografia (Sobre mim)</label>
            <RichEditor bind:value={bio} on:change={handleBioChange} />
          </div>
        </div>

        <div class="card p-6 space-y-5">
          <h3 class="font-serif text-base font-semibold text-stone-800">Redes sociais & Contato</h3>

          <div>
            <label class="block text-xs font-medium text-stone-500 mb-2" for="prof-instagram">Instagram</label>
            <input id="prof-instagram" type="url" bind:value={instagram} placeholder="https://instagram.com/perfil" class="input-field" />
          </div>

          <div>
            <label class="block text-xs font-medium text-stone-500 mb-2" for="prof-linkedin">LinkedIn</label>
            <input id="prof-linkedin" type="url" bind:value={linkedin} placeholder="https://linkedin.com/in/perfil" class="input-field" />
          </div>

          <div>
            <label class="block text-xs font-medium text-stone-500 mb-2" for="prof-email">E-mail público</label>
            <input id="prof-email" type="email" bind:value={email} placeholder="contato@exemplo.com" class="input-field" />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" on:click={() => dispatch('navigate', '/admin')} class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary flex items-center gap-2" disabled={saving}>
            {#if saving}
              <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            {/if}
            Salvar perfil
          </button>
        </div>
      </form>
    </main>
  {/if}
</div>