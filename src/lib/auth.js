import { writable } from 'svelte/store'
import { supabase } from './supabase.js'

export const session = writable(null)
export const loading = writable(true)

supabase.auth.getSession().then(({ data }) => {
  session.set(data.session)
  loading.set(false)
})

supabase.auth.onAuthStateChange((event, s) => {
  session.set(s)
})

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}