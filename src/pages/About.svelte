<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { supabase } from '../lib/supabase.js'

  const dispatch = createEventDispatcher()

  let profile = null
  let loading = true

  onMount(async () => {
    const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle()
    profile = data
    loading = false
  })
</script>

<div class="min-h-screen">
  {#if loading}
    <div class="max-w-2xl mx-auto px-6 py-20 animate-pulse space-y-4">
      <div class="w-24 h-24 rounded-full bg-stone-200 mx-auto"></div>
      <div class="h-8 bg-stone-200 rounded w-48 mx-auto"></div>
      <div class="h-4 bg-stone-100 rounded w-full"></div>
      <div class="h-4 bg-stone-100 rounded w-5/6"></div>
    </div>
  {:else if profile}
    <div class="max-w-2xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        {#if profile.photo_url}
          <div class="relative inline-block mb-6">
            <img
              src={profile.photo_url}
              alt={profile.name}
              class="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
        {/if}
        <h1 class="font-serif text-3xl font-semibold text-stone-900 mb-2">{profile.name}</h1>
        {#if profile.email}
          <a href="mailto:{profile.email}" class="text-sm text-stone-400 hover:text-stone-600 transition-colors">{profile.email}</a>
        {/if}
      </div>

      {#if profile.bio}
        <div class="prose-blog mb-12">
          {@html profile.bio}
        </div>
      {/if}

      {#if profile.instagram || profile.linkedin || profile.email}
        <div class="card p-8">
          <h2 class="font-serif text-xl font-semibold text-stone-900 mb-6">Entre em contato</h2>
          <div class="space-y-4">
            {#if profile.instagram}
              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                class="flex items-center gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors group"
              >
                <div class="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-blush-100 transition-colors">
                  <svg class="w-5 h-5 text-stone-500 group-hover:text-blush-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors">Instagram</p>
                  <p class="text-xs text-stone-400">Siga no Instagram</p>
                </div>
                <svg class="w-4 h-4 text-stone-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            {/if}

            {#if profile.linkedin}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                class="flex items-center gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors group"
              >
                <div class="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-sage-100 transition-colors">
                  <svg class="w-5 h-5 text-stone-500 group-hover:text-sage-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors">LinkedIn</p>
                  <p class="text-xs text-stone-400">Conecte-se profissionalmente</p>
                </div>
                <svg class="w-4 h-4 text-stone-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            {/if}

            {#if profile.email}
              <a
                href="mailto:{profile.email}"
                class="flex items-center gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors group"
              >
                <div class="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-sage-100 transition-colors">
                  <svg class="w-5 h-5 text-stone-500 group-hover:text-sage-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors">E-mail</p>
                  <p class="text-xs text-stone-400">{profile.email}</p>
                </div>
                <svg class="w-4 h-4 text-stone-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            {/if}
          </div>
        </div>
      {/if}

      <div class="mt-10 text-center">
        <button on:click={() => dispatch('navigate', '/')} class="btn-secondary">
          ← Ver artigos
        </button>
      </div>
    </div>
  {:else}
    <div class="max-w-2xl mx-auto px-6 py-32 text-center">
      <p class="text-stone-400">Perfil ainda não configurado.</p>
      <button on:click={() => dispatch('navigate', '/')} class="btn-secondary mt-4">Voltar</button>
    </div>
  {/if}
</div>