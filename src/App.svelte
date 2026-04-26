<script>
  import { onMount } from 'svelte'
  import { session, loading } from './lib/auth.js'
  import Navbar from './components/Navbar.svelte'
  import Footer from './components/Footer.svelte'
  import Home from './pages/Home.svelte'
  import Article from './pages/Article.svelte'
  import About from './pages/About.svelte'
  import Login from './pages/admin/Login.svelte'
  import Dashboard from './pages/admin/Dashboard.svelte'
  import PostEditor from './pages/admin/PostEditor.svelte'
  import ProfileEditor from './pages/admin/ProfileEditor.svelte'
  import AccessDenied from './components/AccessDenied.svelte'

  // Pega a base automaticamente do vite.config.js e remove a barra final se existir
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') || '';
  
  let path = window.location.pathname

  function navigate(to) {
    // Garante que o link comece com a base do GitHub Pages sem duplicar barras
    const target = to === '/' ? (base || '/') : `${base}${to.startsWith('/') ? to : '/' + to}`
    window.history.pushState({}, '', target)
    path = window.location.pathname
    window.scrollTo(0, 0)
  }

  function parsePath(p) {
    // Remove a base da URL atual
    let cleanPath = p.replace(base, '') || '/';
    
    // Garante que o caminho comece com / e não termine com / (exceto a rota raiz)
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);

    if (cleanPath === '/') return { route: 'home' }
    if (cleanPath === '/sobre') return { route: 'about' }
    if (cleanPath === '/login') return { route: 'login' }
    if (cleanPath === '/admin') return { route: 'dashboard' }
    if (cleanPath === '/admin/novo') return { route: 'post-editor', params: {} }
    if (cleanPath === '/admin/perfil') return { route: 'profile-editor' }

    const editMatch = cleanPath.match(/^\/admin\/editar\/(.+)$/)
    if (editMatch) return { route: 'post-editor', params: { id: editMatch[1] } }

    const articleMatch = cleanPath.match(/^\/artigo\/(.+)$/)
    if (articleMatch) return { route: 'article', params: { slug: articleMatch[1] } }

    return { route: '404' }
  }

  $: parsed = parsePath(path)
  $: isAdmin = ['dashboard', 'post-editor', 'profile-editor'].includes(parsed.route)

  onMount(() => {
    window.addEventListener('popstate', () => {
      path = window.location.pathname
    })

    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-link]')
      if (a) {
        e.preventDefault()
        const href = a.getAttribute('href') || a.dataset.link
        navigate(href)
      }
    })
  })

  function handleNavigate(e) {
    navigate(e.detail)
  }
</script>

{#if $loading}
  <div class="fixed inset-0 bg-stone-50 flex items-center justify-center z-50">
    <div class="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else}
  {#if !isAdmin}
    <Navbar {path} on:navigate={handleNavigate} />
  {/if}

  {#key path}
  <div class="fade-in">
  {#if parsed.route === 'home'}
    <Home on:navigate={handleNavigate} />
  {:else if parsed.route === 'about'}
    <About on:navigate={handleNavigate} />
  {:else if parsed.route === 'article'}
    <Article slug={parsed.params?.slug} on:navigate={handleNavigate} />
  {:else if parsed.route === 'login'}
    <Login on:navigate={handleNavigate} />

  {:else if parsed.route === 'dashboard'}
    {#if $session}
      <Dashboard on:navigate={handleNavigate} />
    {:else}
      <AccessDenied on:navigate={handleNavigate} />
    {/if}

  {:else if parsed.route === 'post-editor'}
    {#if $session}
      <PostEditor postId={parsed.params?.id} on:navigate={handleNavigate} />
    {:else}
      <AccessDenied on:navigate={handleNavigate} />
    {/if}

  {:else if parsed.route === 'profile-editor'}
    {#if $session}
      <ProfileEditor on:navigate={handleNavigate} />
    {:else}
      <AccessDenied on:navigate={handleNavigate} />
    {/if}

  {:else}
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center px-4">
        <p class="text-8xl font-serif text-stone-200 mb-4">404</p>
        <p class="text-stone-500 mb-6 font-sans">Página não encontrada.</p>
        <button class="btn-primary" on:click={() => navigate('/')}>Voltar ao início</button>
      </div>
    </div>
  {/if}
  </div>
  {/key}

  {#if !isAdmin}
    <Footer on:navigate={handleNavigate} />
  {/if}
{/if}