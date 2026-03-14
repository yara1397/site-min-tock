import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar, toast } from '../components/UI'
import { doSignIn } from '../lib/supabase'

function mapError(msg = '') {
  if (msg.includes('Invalid login credentials'))
    return '❌ ایمیل یا رمز عبور اشتباه است'
  if (msg.includes('Email not confirmed'))
    return '📬 ایمیل شما هنوز تأیید نشده — لینک ارسال‌شده را کلیک کنید'
  if (msg.includes('Too many requests') || msg.includes('over_request_rate_limit'))
    return '⏳ تعداد تلاش‌ها زیاد است، چند دقیقه صبر کنید'
  if (msg.includes('User not found') || msg.includes('user_not_found'))
    return '❌ کاربری با این ایمیل پیدا نشد'
  if (msg.includes('account_inactive') || msg.includes('disabled'))
    return '🚫 این حساب غیرفعال شده است'
  return '❌ ' + msg
}

export default function LoginPage({ user, profile }) {
  const router = useRouter()
  const from = router.query.from || '/'

  const [email,   setEmail]   = useState('')
  const [pw,      setPw]      = useState('')
  const [showPw,  setShowPw]  = useState(false)
  const [err,     setErr]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setErr('')

    if (!email.trim()) { setErr('❌ ایمیل را وارد کنید');     return }
    if (!pw)           { setErr('❌ رمز عبور را وارد کنید');  return }

    setLoading(true)
    const { data, error } = await doSignIn({
      email: email.trim().toLowerCase(),
      password: pw,
    })
    setLoading(false)

    if (error) {
      setErr(mapError(error.message))
      return
    }

    toast(`🎉 خوش اومدی!`, 'ok')
    router.push(from)
  }

  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      <div style={{
        minHeight:'calc(100vh - 60px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:32,
        background:'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,255,180,0.04) 0%, transparent 70%)',
      }}>
        <div className="card anim-up" style={{ padding:'40px 36px', width:'100%', maxWidth:420 }}>

          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
            <div className="t-display" style={{ fontSize:26 }}>ورود</div>
            <div className="t-mono t-muted" style={{ fontSize:11, letterSpacing:2, marginTop:6 }}>
              // WELCOME BACK, OPERATOR
            </div>
          </div>

          {/* demo hint */}
          <div className="alert alert-warn" style={{ fontSize:12, marginBottom:18 }}>
            <span>💡</span>
            <div>
              <div>ادمین: <strong>admin@nexus.ir</strong> / <strong>YYYDDDDDDYYYadmin123</strong></div>
              <div style={{ color:'var(--muted)', marginTop:3 }}>
                ابتدا در Supabase بساز — راهنما در README
              </div>
            </div>
          </div>

          {err && (
            <div className="alert alert-err" style={{ marginBottom:16 }}>
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="f-group">
              <label className="f-label" htmlFor="email">EMAIL</label>
              <input
                id="email" type="email" placeholder="you@example.com" dir="ltr"
                className={`f-input${err?' error':''}`}
                value={email}
                onChange={e => { setEmail(e.target.value); setErr('') }}
                autoComplete="email"
              />
            </div>

            <div className="f-group">
              <label className="f-label" htmlFor="pw">PASSWORD</label>
              <div style={{ position:'relative' }}>
                <input
                  id="pw" type={showPw?'text':'password'} placeholder="••••••••" dir="ltr"
                  className={`f-input${err?' error':''}`}
                  value={pw}
                  onChange={e => { setPw(e.target.value); setErr('') }}
                  onKeyDown={e => e.key==='Enter' && handleSubmit(e)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{
                    position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', color:'var(--dim)', fontSize:18,
                    lineHeight:1,
                  }}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-hot btn-full btn-lg"
              disabled={loading}
              style={{ marginTop:8 }}
            >
              {loading ? (
                <>
                  <div style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.7s linear infinite' }} />
                  در حال ورود...
                </>
              ) : 'ورود ⚡'}
            </button>

          </form>

          <div style={{ textAlign:'center', marginTop:20, fontSize:13, color:'var(--dim)' }}>
            حساب نداری؟{' '}
            <Link href="/register" style={{ color:'var(--neon)', fontWeight:700 }}>
              ثبت‌نام کن
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
