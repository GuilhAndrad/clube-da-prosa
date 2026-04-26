<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { supabase } from '../lib/supabase.js'
  import logo from '../assets/logo.svg';
  const dispatch = createEventDispatcher()

  let profile = null

  onMount(async () => {
    const { data } = await supabase.from('profiles').select('name,instagram,linkedin,email').limit(1).maybeSingle()
    profile = data
  })

  function nav(to) { dispatch('navigate', to) }
</script>

<footer class="bg-white border-t border-stone-100 mt-24">
  <div class="max-w-4xl mx-auto px-6 py-12">
    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="text-center md:text-left">
        <img 
          src={logo} 
          alt="Clube Da Prosa" 
          class="h-35 w-auto mb-2 mx-auto md:mx-0" 
        />
        
        {#if profile?.name}
          <p class="text-sm text-stone-500 mt-1">{profile.name}</p>
        {/if}
      </div>

      <div class="flex items-center gap-4">
        {#if profile?.instagram}
          <a
            href={profile.instagram}
            target="_blank"
            rel="noreferrer"
            class="text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Instagram"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        {/if}
      </div>
    </div>

    <div class="mt-8 pt-8 border-t border-stone-100 text-center">
      <nav class="flex justify-center gap-6 text-sm text-stone-400 mb-4">
        <button on:click={() => nav('/')} class="hover:text-stone-600 transition-colors">Artigos</button>
        <button on:click={() => nav('/sobre')} class="hover:text-stone-600 transition-colors">Sobre</button>
      </nav>
      <p class="text-xs text-stone-400">&copy; {new Date().getFullYear()} — Todos os direitos reservados</p>
    </div>
  </div>
</footer>