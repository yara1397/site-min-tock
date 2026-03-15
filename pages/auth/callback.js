import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

// این صفحه وقتی کاربر روی لینک ایمیل تأیید کلیک می‌کنه باز می‌شه
// Supabase توکن رو در URL می‌ذاره و این صفحه اون رو پردازش می‌کنه

export default function AuthCallback() {
  const router  = useRouter()
  const [msg,   setMsg]   = useState('در حال تأیید حساب...')
  const [err,   setErr]   = useState('')
  const [done,  setDone]  = useState(false)

  useEffect(() => {
    // Supabase توکن رو از URL hash می‌خونه و session می‌سازه
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setMsg('✅ ایمیل تأیید شد! در حال ورود...')
          setDone(true)
          // ۲ ثانیه صبر کن بعد redirect کن
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
        }
        if (event === 'TOKEN_REFRESHED' && session) {
          setMsg('✅ حساب تأیید شد!')
          setDone(true)
          setTimeout(() => { window.location.href = '/' }, 2000)
        }
      }
    )

    // همچنین مستقیم session رو چک کن
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setMsg('✅ ورود موفق! در حال انتقال...')
        setDone(true)
        setTimeout(() => { window.location.href = '/' }, 1500)
      }
    })

    // اگه ۸ ثانیه گذشت و چیزی نشد، خطا بده
    const timer = setTimeout(() => {
      if (!done) {
        setErr('لینک منقضی شده یا نامعتبر است')
        setMsg('')
      }
    }, 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--ink)',
      padding: 32,
    }}>
      <div style={{
        background: 'var(--card)',
        border: `1px solid ${err ? 'rgba(255,0,100,0.3)' : 'rgba(0,255,180,0.3)'}`,
        borderRadius: 20,
        padding: '48px 40px',
        maxWidth: 420,
        width: '100%',
        textAlign: 'center',
        animation: 'fadeUp 0.4s ease',
        boxShadow: err
          ? '0 0 40px rgba(255,0,100,0.1)'
          : '0 0 40px rgba(0,255,180,0.1)',
      }}>

        {!err ? (
          <>
            {done ? (
              <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
            ) : (
              // spinner
              <div style={{
                width: 56, height: 56,
                border: '3px solid rgba(0,255,180,0.2)',
                borderTopColor: 'var(--neon)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 24px',
              }} />
            )}
            <div style={{
              fontFamily: 'var(--display)',
              fontSize: 24, fontWeight: 800,
              color: 'var(--neon)',
              marginBottom: 12,
            }}>
              {msg}
            </div>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: 13, color: 'var(--dim)',
              lineHeight: 1.6,
            }}>
              {done
                ? 'حساب شما فعال شد. لطفاً صبر کنید...'
                : 'لطفاً صبر کنید، در حال پردازش...'}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, marginBottom: 20 }}>❌</div>
            <div style={{
              fontFamily: 'var(--display)',
              fontSize: 22, fontWeight: 800,
              marginBottom: 12,
            }}>
              لینک نامعتبر است
            </div>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: 13, color: 'var(--dim)',
              lineHeight: 1.6, marginBottom: 28,
            }}>
              {err}
              <br />لطفاً دوباره ثبت‌نام کنید یا لینک جدید بخواهید.
            </div>
            <a href="/register" style={{
              display: 'inline-block',
              padding: '12px 28px', borderRadius: 10,
              background: 'rgba(0,255,180,0.1)',
              border: '1px solid rgba(0,255,180,0.25)',
              color: 'var(--neon)', fontWeight: 700,
              fontFamily: 'var(--font)', textDecoration: 'none',
              fontSize: 14,
            }}>
              ثبت‌نام مجدد
            </a>
          </>
        )}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink: #05050A; --card: #0F0F1E;
          --neon: #00FFB4; --dim: #8888AA; --muted: #4A4A7A;
          --font: 'Vazirmatn', sans-serif;
          --display: 'Syne', sans-serif;
          --mono: 'IBM Plex Mono', monospace;
        }
        body { background: var(--ink); color: #E8E8FF; font-family: var(--font); direction: rtl; }
      `}</style>
    </div>
  )
}
