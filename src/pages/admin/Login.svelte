<script>
  import { createEventDispatcher } from 'svelte'
  import { signIn } from '../../lib/auth.js'

  const dispatch = createEventDispatcher()

  let email = ''
  let password = ''
  let loading = false
  let error = ''

  async function handleSubmit() {
    error = ''
    loading = true
    try {
      await signIn(email, password)
      dispatch('navigate', '/admin')
    } catch (e) {
      error = 'E-mail ou senha incorretos.'
    } finally {
      loading = false
    }
  }
</script>

<div class="min-h-screen bg-stone-50 flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-10">
      <p class="font-serif text-3xl font-semibold text-stone-900 mb-1">psi<span class="text-sage-600">.</span></p>
      <p class="text-stone-500 text-sm">Acesso restrito</p>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="card p-8 space-y-5">
      <div>
        <label class="block text-xs font-medium text-stone-600 mb-2" for="email">E-mail</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          autocomplete="email"
          placeholder="sua@psicologia.com"
          class="input-field"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-stone-600 mb-2" for="password">Senha</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          autocomplete="current-password"
          placeholder="••••••••"
          class="input-field"
        />
      </div>

      {#if error}
        <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div class="bg-red-900 text-white text-sm rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3 border border-red-800/20">
            <svg class="w-5 h-5 text-red-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-medium">{error}</span>
            <button on:click={() => error = ''} class="ml-auto opacity-70 hover:opacity-100">✕</button>
          </div>
        </div>
      {/if}

      <button type="submit" class="btn-primary w-full justify-center flex items-center gap-2" disabled={loading}>
        {#if loading}
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        {/if}
        Entrar
      </button>
    </form>

    <p class="text-center mt-6 text-xs text-stone-400">
      <button on:click={() => dispatch('navigate', '/')} class="hover:text-stone-600 transition-colors">
        ← Voltar ao blog
      </button>
    </p>
  </div>
</div>
