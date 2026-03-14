import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://tltgtjsyzhupfilsjrho.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsdGd0anN5emh1cGZpbHNqcmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTgzMjMsImV4cCI6MjA4OTA3NDMyM30.cvtsWm3mq18UCPHrosQ6PoaVqPjZA1I7fjM17KGISyw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/* ─── Auth ─────────────────────────────────────────────────── */

export async function doSignUp({ email, password, username, fullName, phone, address }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username.toLowerCase().trim(),
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      },
    },
  })
  return { data, error }
}

export async function doSignIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function doSignOut() {
  return supabase.auth.signOut()
}

/* ─── Profile ──────────────────────────────────────────────── */

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function checkUsernameExists(username) {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase().trim())
    .maybeSingle()
  return !!data
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}
