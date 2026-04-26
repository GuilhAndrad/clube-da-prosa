<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  function navigate(path) {
    dispatch('navigate', path)
  }
</script>

<div class="min-h-screen flex items-center justify-center px-4 bg-stone-50">
  <div class="max-w-md w-full">
    <!-- Container principal com card style -->
    <div class="card p-8 text-center">
      <!-- Ícone decorativo -->
      <div class="mb-8">
        <div class="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center">
          <svg class="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
      </div>

      <!-- Título -->
      <h1 class="font-serif text-3xl font-semibold text-stone-900 mb-3">
        Acesso Restrito
      </h1>

      <!-- Subtítulo -->
      <p class="text-stone-500 text-sm font-medium mb-6 uppercase tracking-wide">
        Autenticação Necessária
      </p>

      <!-- Descrição -->
      <p class="text-stone-600 mb-8 leading-relaxed text-base">
        Esta área é exclusiva para administradores autenticados. 
        Faça login para continuar.
      </p>

      <!-- Botões -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button 
          on:click={() => navigate('/login')}
          class="btn-primary flex-1 font-semibold"
        >
          Fazer Login
        </button>
        <button 
          on:click={() => navigate('/')}
          class="btn-secondary flex-1 font-semibold"
        >
          Voltar ao Início
        </button>
      </div>

      <!-- Footer -->
      <div class="mt-8 pt-8 border-t border-stone-100">
        <p class="text-xs text-stone-400">
          Contato: 
          <a href="mailto:contato@example.com" class="text-sage-600 hover:underline">
            contato@example.com
          </a>
        </p>
      </div>
    </div>

    <!-- Opcional: Link adicional -->
    <p class="text-center text-sm text-stone-500 mt-6">
      Não tem uma conta? 
      <button 
        on:click={() => navigate('/login')}
        class="text-sage-600 hover:text-sage-700 font-semibold"
      >
        Crie uma agora
      </button>
    </p>
  </div>
</div>

<style>
  /* Animação suave de entrada */
  :global(.fade-in) {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>