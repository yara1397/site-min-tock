import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar } from '../components/UI'
import { doSignIn } from '../lib/supabase'

function mapErr(msg = '') {
  if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials'))
    return 'ایمیل یا رمز عبور اشتباه است'
  if (msg.includes('Email not confirmed'))
    return 'ایمیل شما تأیید نشده — لینک ایمیل را کلیک کنید'
  if (msg.includes('rate_limit') || msg.includes('Too many'))
    return 'تعداد تلاش‌ها زیاد است، چند دقیقه صبر کنید'
  return msg || 'خطای ناشناخته'
}

export default function LoginPage({ user }) {
  const router = useRouter()
  const from   = router.query.from || '/'

  const [email,   setEmail]   = useState('')
  const [pw,      setPw]      = useState('')
  const [showPw,  setShowPw]  = useState(false)
  const [err,     setErr]     = useState('')
  const [status,  setStatus]  = useState('idle') // idle | loading | success

  useEffect(() => {
    if (user) router.replace(from)
  }, [user])

  const submit = async e => {
    e.preventDefault()
    setErr('')
    if (!email.trim()) { setErr('ایمیل را وارد کنید');    return }
    if (!pw)           { setErr('رمز عبور را وارد کنید'); return }

    setStatus('loading')
    try {
      const { data, error } = await doSignIn({
        email: email.trim().toLowerCase(),
        password: pw,
      })
      if (error) { setErr(mapErr(error.message)); setStatus('idle'); return }
      if (data?.user) {
        setStatus('success')
        setTimeout(() => { window.location.href = from }, 600)
      }
    } catch {
      setErr('خطای اتصال — اینترنت خود را بررسی کنید')
      setStatus('idle')
    }
  }

  const loading = status === 'loading'
  const success = status === 'success'

  return (
    <div className="page-wrap">
      <Navbar user={null} profile={null} />
      <div style={{
        minHeight:'calc(100vh - 60px)', display:'flex',
        alignItems:'center', justifyContent:'center', padding:32,
        background:'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,255,180,0.04) 0%, transparent 70%)',
      }}>
        <div className="card" style={{ padding:'40px 36px', width:'100%', maxWidth:420, animation:'fadeUp 0.4s ease' }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🔐</div>
            <div style={{ fontFamily:'var(--display)', fontSize:28, fontWeight:800 }}>ورود</div>
            <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)', letterSpacing:2, marginTop:6 }}>
              // WELCOME BACK
            </div>
          </div>

          {err && (
            <div className="alert alert-err">❌ {err}</div>
          )}
          {success && (
            <div className="alert alert-ok">✅ ورود موفق! در حال انتقال...</div>
          )}

          <form onSubmit={submit} noValidate>
            <div className="f-group">
              <label className="f-label">ایمیل</label>
              <input
                type="email" placeholder="you@example.com" dir="ltr"
                className="f-input" value={email}
                onChange={e => { setEmail(e.target.value); setErr('') }}
                autoComplete="email" disabled={loading || success}
              />
            </div>

            <div className="f-group">
              <label className="f-label">رمز عبور</label>
              <div style={{ position:'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" dir="ltr"
                  className="f-input" value={pw}
                  onChange={e => { setPw(e.target.value); setErr('') }}
                  autoComplete="current-password"
                  disabled={loading || success}
                  style={{ paddingLeft:48 }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', color:'var(--dim)', fontSize:20 }}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || success}
              style={{
                width:'100%', padding:14, borderRadius:10, marginTop:8,
                background: success
                  ? 'linear-gradient(135deg,#00C896,#009970)'
                  : 'linear-gradient(135deg,var(--hot),#FF4D00)',
                color:'white', border:'none', fontWeight:800, fontSize:16,
                fontFamily:'var(--font)', display:'flex', alignItems:'center',
                justifyContent:'center', gap:10,
                opacity: (loading || success) ? 0.9 : 1,
                boxShadow:'0 4px 20px rgba(255,0,100,0.3)',
                transition:'all 0.2s',
              }}>
              {loading ? (
                <>
                  <div style={{
                    width:20, height:20, borderRadius:'50%', flexShrink:0,
                    border:'2.5px solid rgba(255,255,255,0.35)',
                    borderTopColor:'white',
                    animation:'spin 0.7s linear infinite',
                  }} />
                  در حال ورود...
                </>
              ) : success ? '✅ وارد شدید!' : 'ورود ⚡'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:20, fontSize:13, color:'var(--dim)' }}>
            حساب نداری؟{' '}
            <Link href="/register" style={{ color:'var(--neon)', fontWeight:700 }}>ثبت‌نام کن</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
