import { useState, useEffect } from 'react'
import { supabase, getProfile } from '../lib/supabase'
import { Cursor, ToastContainer } from '../components/UI'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await getProfile(session.user.id)
        setProfile(data)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          const { data } = await getProfile(session.user.id)
          setProfile(data)
        } else {
          setProfile(null)
        }
      }
    )
    return () => subscription.unsubscribe()
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
