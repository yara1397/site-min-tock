import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar, Field, toast } from '../components/UI'
import { doSignUp, checkUsernameExists } from '../lib/supabase'

/* ── validation ─────────────────────────────────────────────── */
function validate(f) {
  const e = {}
  if (!f.fullName.trim())
    e.fullName = 'نام الزامی است'
  if (!f.username.trim())
    e.username = 'یوزرنیم الزامی است'
  else if (!/^[a-z0-9_]{3,20}$/.test(f.username.toLowerCase()))
    e.username = 'یوزرنیم باید ۳-۲۰ کاراکتر (a-z, 0-9, _) باشد'
  if (!f.email.trim())
    e.email = 'ایمیل الزامی است'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = 'فرمت ایمیل معتبر نیست'
  if (!f.phone.trim())
    e.phone = 'شماره تلفن الزامی است'
  else if (!/^(0|\+98)9[0-9]{9}$/.test(f.phone.replace(/[\s-]/g,'')))
    e.phone = 'شماره موبایل نامعتبر است — مثال: 09123456789'
  if (!f.address.trim())
    e.address = 'آدرس الزامی است'
  if (!f.password)
    e.password = 'رمز عبور الزامی است'
  else if (f.password.length < 6)
    e.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
  if (f.password !== f.confirm)
    e.confirm = 'تکرار رمز عبور مطابقت ندارد'
  return e
}

/* ── error map ──────────────────────────────────────────────── */
function mapError(msg = '') {
  if (msg.includes('User already registered') || msg.includes('already been registered'))
    return 'این ایمیل قبلاً ثبت‌نام کرده است'
  if (msg.includes('Email rate limit'))
    return 'تعداد درخواست‌ها زیاد است، کمی صبر کنید'
  if (msg.includes('Password should be at least'))
    return 'رمز عبور باید حداقل ۶ کاراکتر باشد'
  if (msg.includes('Invalid email'))
    return 'فرمت ایمیل معتبر نیست'
  if (msg.includes('signup_disabled'))
    return 'ثبت‌نام در حال حاضر غیرفعال است'
  if (msg.includes('over_email_send_rate_limit'))
    return 'ایمیل‌های زیادی ارسال شده، چند دقیقه صبر کنید'
  return msg
}

/* ── strength ───────────────────────────────────────────────── */
function pwStrength(pw) {
  let s = 0
  if (pw.length >= 6)       s++
  if (pw.length >= 10)      s++
  if (/[A-Z]/.test(pw))     s++
  if (/[0-9]/.test(pw))     s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  const labels = ['خیلی ضعیف','ضعیف','متوسط','قوی','خیلی قوی']
  const colors = ['var(--hot)','#FF7700','var(--gold)','#88DD00','var(--neon)']
  return { score: s, label: labels[Math.max(s-1,0)], color: colors[Math.max(s-1,0)] }
}

/* ═══ PAGE ══════════════════════════════════════════════════════ */
export default function RegisterPage({ user, profile }) {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName:'', username:'', email:'',
    phone:'', address:'', password:'', confirm:'',
  })
  const [errs,    setErrs]    = useState({})
  const [apiErr,  setApiErr]  = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const set = k => e => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    setErrs(p => ({ ...p, [k]: '' }))
    setApiErr('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const v = validate(form)
    if (Object.keys(v).length) { setErrs(v); return }

    setLoading(true)

    // check username uniqueness against Supabase
    const taken = await checkUsernameExists(form.username)
    if (taken) {
      setErrs(p => ({ ...p, username: 'این یوزرنیم قبلاً گرفته شده است' }))
      setLoading(false)
      return
    }

    const { data, error } = await doSignUp({
      email:    form.email.trim().toLowerCase(),
      password: form.password,
      username: form.username.trim().toLowerCase(),
      fullName: form.fullName.trim(),
      phone:    form.phone.trim(),
      address:  form.address.trim(),
    })

    setLoading(false)

    if (error) {
      setApiErr(mapError(error.message))
      return
    }

    // Supabase may auto-confirm or send email
    if (data?.user?.confirmed_at || data?.user?.email_confirmed_at) {
      toast('🎉 ثبت‌نام موفق! خوش اومدی!', 'ok')
      router.push('/')
    } else {
      setDone(true)
    }
  }

  /* ── success screen ── */
  if (done) return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />
      <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
        <div className="card anim-up" style={{ padding:48, maxWidth:440, width:'100%', textAlign:'center' }}>
          <div style={{ fontSize:64, marginBottom:20 }}>📬</div>
          <div className="t-display" style={{ fontSize:26, marginBottom:12 }}>ثبت‌نام موفق!</div>
          <div className="t-dim" style={{ fontSize:14, lineHeight:1.8, marginBottom:24 }}>
            یک ایمیل تأیید به{' '}
            <strong style={{ color:'var(--neon)' }}>{form.email}</strong>
            {' '}ارسال شد.<br />
            لینک داخل ایمیل را کلیک کنید تا حساب فعال شود.
          </div>
          <div className="alert alert-warn" style={{ marginBottom:20 }}>
            ⚠️ اگر ایمیل نرسید، پوشه Spam را بررسی کنید
          </div>
          <Link href="/login" className="btn btn-neon btn-full btn-lg">رفتن به ورود →</Link>
        </div>
      </div>
    </div>
  )

  const strength = form.password ? pwStrength(form.password) : null

  /* ── form ── */
  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      <div style={{
        minHeight:'calc(100vh - 60px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'40px 16px',
        background:'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,255,180,0.04) 0%, transparent 70%)',
      }}>
        <div className="card anim-up" style={{ padding:'40px 36px', width:'100%', maxWidth:540 }}>

          {/* header */}
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🚀</div>
            <div className="t-display" style={{ fontSize:28 }}>ثبت‌نام</div>
            <div className="t-mono t-muted" style={{ fontSize:11, letterSpacing:2, marginTop:6 }}>
              // JOIN THE NEXUS NETWORK
            </div>
          </div>

          {apiErr && (
            <div className="alert alert-err">
              <span>❌</span><span>{apiErr}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* row 1 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field
                label="نام و نام خانوادگی" id="fullName"
                placeholder="علی رضایی"
                value={form.fullName} onChange={set('fullName')} error={errs.fullName}
              />
              <Field
                label="یوزرنیم" id="username"
                placeholder="ali_rezaei" dir="ltr"
                hint="فقط a-z، 0-9، _"
                value={form.username} onChange={set('username')} error={errs.username}
              />
            </div>

            {/* email */}
            <Field
              label="ایمیل" id="email" type="email"
              placeholder="ali@example.com" dir="ltr"
              autoComplete="email"
              value={form.email} onChange={set('email')} error={errs.email}
            />

            {/* phone */}
            <Field
              label="شماره تلفن" id="phone" type="tel"
              placeholder="09123456789" dir="ltr"
              value={form.phone} onChange={set('phone')} error={errs.phone}
            />

            {/* address */}
            <Field
              label="آدرس" id="address"
              placeholder="تهران، خیابان ولیعصر، پلاک ۱۲"
              value={form.address} onChange={set('address')} error={errs.address}
            />

            {/* row 2 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field
                label="رمز عبور" id="password" type="password"
                placeholder="حداقل ۶ کاراکتر" dir="ltr"
                value={form.password} onChange={set('password')} error={errs.password}
              />
              <Field
                label="تکرار رمز عبور" id="confirm" type="password"
                placeholder="••••••" dir="ltr"
                value={form.confirm} onChange={set('confirm')} error={errs.confirm}
              />
            </div>

            {/* strength meter */}
            {strength && (
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex', gap:4, marginBottom:5 }}>
                  {[0,1,2,3,4].map(i => (
                    <div key={i} style={{
                      height:3, flex:1, borderRadius:2,
                      background: i < strength.score ? strength.color : 'var(--rim)',
                      transition:'background 0.3s',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize:11, fontFamily:'var(--mono)', color:strength.color }}>
                  قدرت رمز: {strength.label}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-hot btn-full btn-lg"
              disabled={loading}
              style={{ marginTop:6 }}
            >
              {loading ? (
                <>
                  <div style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.7s linear infinite' }} />
                  در حال ثبت‌نام...
                </>
              ) : 'ساخت حساب رایگان ✨'}
            </button>

          </form>

          <div style={{ textAlign:'center', marginTop:18, fontSize:13, color:'var(--dim)' }}>
            حساب داری؟{' '}
            <Link href="/login" style={{ color:'var(--neon)', fontWeight:700 }}>
              وارد شو
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
