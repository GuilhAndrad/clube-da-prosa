<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'

  export let value = ''
  export let placeholder = 'Escreva seu artigo aqui...'

  const dispatch = createEventDispatcher()

  let editorEl
  let editor = null
  let TiptapEditor = null
  let StarterKit = null
  let Image = null
  let Placeholder = null
  let mounted = false

  onMount(async () => {
    try {
      const [editorMod, starterMod, imageMod, placeholderMod] = await Promise.all([
        import('@tiptap/core'),
        import('@tiptap/starter-kit'),
        import('@tiptap/extension-image'),
        import('@tiptap/extension-placeholder'),
      ])

      TiptapEditor = editorMod.Editor
      StarterKit = starterMod.default
      Image = imageMod.default
      Placeholder = placeholderMod.default

      editor = new TiptapEditor({
        element: editorEl,
        extensions: [
          StarterKit,
          Image.configure({ inline: false }),
          Placeholder.configure({ placeholder }),
        ],
        content: value,
        onUpdate({ editor: e }) {
          const html = e.getHTML()
          value = html
          dispatch('change', html)
        },
        editorProps: {
          attributes: {
            class: 'prose-blog min-h-[400px] outline-none focus:outline-none px-1',
          }
        }
      })

      mounted = true
    } catch (e) {
      console.warn('Tiptap unavailable, falling back to textarea')
      mounted = false
    }
  })

  onDestroy(() => {
    if (editor) editor.destroy()
  })

  function execCommand(cmd, val = null) {
    if (!editor) return
    switch (cmd) {
      case 'bold': editor.chain().focus().toggleBold().run(); break
      case 'italic': editor.chain().focus().toggleItalic().run(); break
      case 'h2': editor.chain().focus().toggleHeading({ level: 2 }).run(); break
      case 'h3': editor.chain().focus().toggleHeading({ level: 3 }).run(); break
      case 'blockquote': editor.chain().focus().toggleBlockquote().run(); break
      case 'bulletList': editor.chain().focus().toggleBulletList().run(); break
      case 'orderedList': editor.chain().focus().toggleOrderedList().run(); break
      case 'image':
        const url = prompt('URL da imagem:')
        if (url) editor.chain().focus().setImage({ src: url }).run()
        break
      case 'undo': editor.chain().focus().undo().run(); break
      case 'redo': editor.chain().focus().redo().run(); break
    }
  }

  function isActive(cmd, attrs = {}) {
    if (!editor) return false
    switch (cmd) {
      case 'bold': return editor.isActive('bold')
      case 'italic': return editor.isActive('italic')
      case 'h2': return editor.isActive('heading', { level: 2 })
      case 'h3': return editor.isActive('heading', { level: 3 })
      case 'blockquote': return editor.isActive('blockquote')
      case 'bulletList': return editor.isActive('bulletList')
      case 'orderedList': return editor.isActive('orderedList')
      default: return false
    }
  }

  $: activeState = editor ? {
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    h2: editor.isActive('heading', { level: 2 }),
    h3: editor.isActive('heading', { level: 3 }),
    blockquote: editor.isActive('blockquote'),
    bulletList: editor.isActive('bulletList'),
    orderedList: editor.isActive('orderedList'),
  } : {}
</script>

<div class="border border-stone-200 rounded-xl overflow-hidden bg-white">
  <!-- Toolbar -->
  <div class="flex flex-wrap items-center gap-1 p-2 border-b border-stone-100 bg-stone-50">
    <button
      type="button"
      on:click={() => execCommand('bold')}
      class="p-1.5 rounded text-sm font-bold transition-colors hover:bg-stone-200"
      class:bg-stone-200={activeState.bold}
      class:text-stone-900={activeState.bold}
      class:text-stone-500={!activeState.bold}
      title="Negrito"
    >B</button>

    <button
      type="button"
      on:click={() => execCommand('italic')}
      class="p-1.5 rounded text-sm italic transition-colors hover:bg-stone-200"
      class:bg-stone-200={activeState.italic}
      class:text-stone-900={activeState.italic}
      class:text-stone-500={!activeState.italic}
      title="Itálico"
    >I</button>

    <div class="w-px h-4 bg-stone-200 mx-1"></div>

    <button
      type="button"
      on:click={() => execCommand('h2')}
      class="px-2 py-1 rounded text-xs font-bold transition-colors hover:bg-stone-200"
      class:bg-stone-200={activeState.h2}
      class:text-stone-900={activeState.h2}
      class:text-stone-500={!activeState.h2}
      title="Título H2"
    >H2</button>

    <button
      type="button"
      on:click={() => execCommand('h3')}
      class="px-2 py-1 rounded text-xs font-bold transition-colors hover:bg-stone-200"
      class:bg-stone-200={activeState.h3}
      class:text-stone-900={activeState.h3}
      class:text-stone-500={!activeState.h3}
      title="Título H3"
    >H3</button>

    <div class="w-px h-4 bg-stone-200 mx-1"></div>

    <button
      type="button"
      on:click={() => execCommand('blockquote')}
      class="p-1.5 rounded transition-colors hover:bg-stone-200"
      class:bg-stone-200={activeState.blockquote}
      class:text-stone-900={activeState.blockquote}
      class:text-stone-500={!activeState.blockquote}
      title="Citação"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    </button>

    <button
      type="button"
      on:click={() => execCommand('bulletList')}
      class="p-1.5 rounded transition-colors hover:bg-stone-200"
      class:bg-stone-200={activeState.bulletList}
      class:text-stone-500={!activeState.bulletList}
      title="Lista com marcadores"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
      </svg>
    </button>

    <button
      type="button"
      on:click={() => execCommand('orderedList')}
      class="p-1.5 rounded transition-colors hover:bg-stone-200"
      class:bg-stone-200={activeState.orderedList}
      class:text-stone-500={!activeState.orderedList}
      title="Lista numerada"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    </button>

    <div class="w-px h-4 bg-stone-200 mx-1"></div>

    <button
      type="button"
      on:click={() => execCommand('image')}
      class="p-1.5 rounded text-stone-500 hover:bg-stone-200 transition-colors"
      title="Inserir imagem"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    </button>

    <div class="flex-1"></div>

    <button type="button" on:click={() => execCommand('undo')} class="p-1.5 rounded text-stone-400 hover:bg-stone-200 hover:text-stone-600 transition-colors" title="Desfazer">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
      </svg>
    </button>
    <button type="button" on:click={() => execCommand('redo')} class="p-1.5 rounded text-stone-400 hover:bg-stone-200 hover:text-stone-600 transition-colors" title="Refazer">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"/>
      </svg>
    </button>
  </div>

  <!-- Editor -->
  <div class="p-6" bind:this={editorEl}></div>
</div>

<style>
  :global(.tiptap) {
    outline: none;
  }

  :global(.tiptap p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: #a8a29e;
    float: left;
    height: 0;
    pointer-events: none;
  }

  :global(.tiptap blockquote) {
    border-left: 4px solid #b5c2a2;
    padding-left: 1.5rem;
    font-style: italic;
    color: #57534e;
    margin: 2rem 0;
  }

  :global(.tiptap h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    font-family: 'Lora', Georgia, serif;
  }

  :global(.tiptap h3) {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    font-family: 'Lora', Georgia, serif;
  }

  :global(.tiptap ul) {
    list-style: disc;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
  }

  :global(.tiptap ol) {
    list-style: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
  }

  :global(.tiptap img) {
    border-radius: 0.75rem;
    width: 100%;
    margin: 2rem 0;
  }

  :global(.tiptap p) {
    margin-bottom: 1.5rem;
    line-height: 1.85;
    font-family: 'Lora', Georgia, serif;
    font-size: 1.125rem;
    color: #44403c;
  }
</style>