export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function getFingerprint() {
  let fp = localStorage.getItem('blog_fp')
  if (!fp) {
    fp = crypto.randomUUID()
    localStorage.setItem('blog_fp', fp)
  }
  return fp
}

export function truncate(str, n) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n - 1) + '...' : str
}

export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}