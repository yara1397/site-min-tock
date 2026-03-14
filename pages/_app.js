import { useState, useEffect } from 'react'
import { supabase, getProfile } from '../lib/supabase'
import { Cursor, ToastContainer } from '../components/UI'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // حداکثر ۳ ثانیه صبر می‌کنیم — بعدش loading=false می‌شه
    const timeout = setTimeout(() => setLoading(false), 3000)

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        clearTimeout(timeout)
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          try {
            const { data } = await getProfile(u.id)
            setProfile(data ?? null)
          } catch { setProfile(null) }
        }
        setLoading(false)
      })
      .catch(() => {
        clearTimeout(timeout)
        setLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          try {
            const { data } = await getProfile(u.id)
            setProfile(data ?? null)
          } catch { setProfile(null) }
        } else {
          setProfile(null)
        }
      }
    )
    return () => { clearTimeout(timeout); subscription.unsubscribe() }
  }, [])

  return (
    <>
      <Cursor />
      <ToastContainer />
      <Component
        {...pageProps}
        user={user}
        profile={profile}
        authLoading={loading}
      />
    </>
  )
}
