<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { session } from '../lib/auth.js'
  import { fade, slide } from 'svelte/transition';
  import logo from '../assets/logo.svg';

  export let path = '/'

  const dispatch = createEventDispatcher()

  let scrolled = false
  let menuOpen = false

  onMount(() => {
    const handler = () => { scrolled = window.scrollY > 20 }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  })

  function nav(to) {
    dispatch('navigate', to)
    menuOpen = false
  }

  function isActive(href) {
    if (href === '/') return path === '/'
    return path.startsWith(href)
  }
</script>

<header
  class="fixed top-0 inset-x-0 z-40 transition-all duration-300"
  class:bg-stone-50={scrolled}
  class:shadow-sm={scrolled}
  class:border-b={scrolled}
  class:border-stone-100={scrolled}
>
  <nav class="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
    <!-- Logo -->
      <button
        on:click={() => nav('/')}
        class="flex items-center transition-opacity hover:opacity-80"
        >
        <img 
          src={logo} 
          alt="Clube Da Prosa" 
          class="h-35 w-auto" 
        />
      </button>

    <!-- Desktop links -->
    <div class="hidden md:flex items-center gap-1">
      <button
        on:click={() => nav('/')}
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        class:text-stone-900={isActive('/')}
        class:text-stone-500={!isActive('/')}
        class:hover:text-stone-800={true}
        class:hover:bg-stone-100={true}
      >
        Artigos
      </button>
      <button
        on:click={() => nav('/sobre')}
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        class:text-stone-900={isActive('/sobre')}
        class:text-stone-500={!isActive('/sobre')}
        class:hover:text-stone-800={true}
        class:hover:bg-stone-100={true}
      >
        Sobre
      </button>
      {#if $session}
        <button
          on:click={() => nav('/admin')}
          class="ml-2 btn-primary"
        >
          Painel
        </button>
      {:else}
        <button
          on:click={() => nav('/login')}
          class="ml-2 btn-ghost"
        >
          Entrar
        </button>
      {/if}
    </div>

    <!-- Mobile menu button -->
    <button
      class="md:hidden p-2.5 rounded-xl transition-all duration-300 group
        {menuOpen ? 'bg-sage-50 text-sage-600' : 'text-stone-600 hover:bg-stone-100'}"
      on:click={() => menuOpen = !menuOpen}
      aria-label="Menu"
    >
      <div class="relative w-6 h-6">
        {#if menuOpen}
          <div in:fade={{ duration: 200 }} class="absolute inset-0 rotate-90 transition-transform duration-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        {:else}
          <div in:fade={{ duration: 200 }} class="absolute inset-0 rotate-0 transition-transform duration-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8h16M4 16h16"/>
            </svg>
          </div>
        {/if}
      </div>
    </button>
  </nav>

  <!-- Mobile menu -->
  {#if menuOpen}
   <div 
     class="md:hidden bg-white border-t border-stone-100 shadow-xl overflow-hidden"
     transition:slide={{ duration: 300 }}
   >
     <div class="px-6 py-6 flex flex-col gap-3 bg-gradient-to-b from-white to-stone-50/50">
       
       <button 
         on:click={() => nav('/')} 
         class="flex items-center justify-between px-4 py-3 rounded-xl text-stone-700 bg-stone-100/40 hover:bg-sage-50 hover:text-sage-700 transition-all duration-200 group"
       >
         <span class="font-medium">Artigos</span>
         <span class="opacity-0 group-hover:opacity-100 transition-opacity text-sage-500">→</span>
       </button>

       <button 
         on:click={() => nav('/sobre')} 
         class="flex items-center justify-between px-4 py-3 rounded-xl text-stone-700 bg-stone-100/40 hover:bg-sage-50 hover:text-sage-700 transition-all duration-200 group"
       >
         <span class="font-medium">Sobre</span>
         <span class="opacity-0 group-hover:opacity-100 transition-opacity text-sage-500">→</span>
       </button>

       <div class="h-px bg-stone-200/60 my-2 mx-2"></div>

       {#if $session}
         <button 
           on:click={() => nav('/admin')} 
           class="flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-sage-100 text-sage-700 hover:bg-sage-200 transition-all active:scale-[0.98]"
         >
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
           </svg>
           Acessar Painel
         </button>
       {:else}
         <button 
           on:click={() => nav('/login')} 
           class="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-stone-900 text-white hover:bg-stone-800 shadow-md active:scale-[0.98] transition-all"
         >
           Entrar na Conta
         </button>
       {/if}
     </div>
   </div>
 {/if}
</header>

<!-- Spacer -->
<div class="h-16"></div>