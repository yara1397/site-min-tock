import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar } from '../components/UI'
import { doSignUp, checkUsernameExists } from '../lib/supabase'

function validate(f) {
  const e = {}
  if (!f.fullName.trim())
    e.fullName = 'نام الزامی است'
  if (!f.username.trim())
    e.username = 'یوزرنیم الزامی است'
  else if (f.username.trim().length < 3)
    e.username = 'یوزرنیم باید حداقل ۳ کاراکتر باشد'
  else if (f.username.trim().length > 20)
    e.username = 'بیشتر از ۲۰ کاراکتر نمی‌تواند باشد'
  else if (!/^[a-z0-9_]+$/.test(f.username.toLowerCase()))
    e.username = 'فقط a-z، 0-9 و _ مجاز است'
  if (!f.email.trim())
    e.email = 'ایمیل الزامی است'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = 'فرمت ایمیل معتبر نیست'
  if (!f.phone.trim())
    e.phone = 'شماره تلفن الزامی است'
  else if (!/^(0|\+98)9[0-9]{9}$/.test(f.phone.replace(/[\s-]/g,'')))
    e.phone = 'مثال: 09123456789'
  if (!f.address.trim())
    e.address = 'آدرس الزامی است'
  if (!f.password)
    e.password = 'رمز عبور الزامی است'
  else if (f.password.length < 6)
    e.password = 'حداقل ۶ کاراکتر'
  if (f.password !== f.confirm)
    e.confirm = 'تکرار رمز عبور مطابقت ندارد'
  return e
}

function mapErr(msg = '') {
  if (msg.includes('already registered') || msg.includes('already been registered'))
    return 'این ایمیل قبلاً ثبت‌نام کرده است'
  if (msg.includes('rate_limit') || msg.includes('Email rate'))
    return 'تعداد درخواست‌ها زیاد است، کمی صبر کنید'
  if (msg.includes('signup_disabled'))
    return 'ثبت‌نام غیرفعال است'
  return msg || 'خطای ناشناخته'
}

function PwStrength({ pw }) {
  if (!pw) return null
  let s = 0
  if (pw.length >= 6)           s++
  if (pw.length >= 10)          s++
  if (/[A-Z]/.test(pw))         s++
  if (/[0-9]/.test(pw))         s++
  if (/[^A-Za-z0-9]/.test(pw))  s++
  const labels = ['خیلی ضعیف','ضعیف','متوسط','قوی','خیلی قوی']
  const colors = ['var(--hot)','#FF7700','var(--gold)','#88DD00','var(--neon)']
  const c = colors[Math.max(s-1,0)]
  return (
    <div style={{ marginBottom:12, marginTop:-4 }}>
      <div style={{ display:'flex', gap:4, marginBottom:4 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ height:3, flex:1, borderRadius:2,
            background: i < s ? c : 'var(--rim)', transition:'background 0.3s' }} />
        ))}
      </div>
      <div style={{ fontSize:11, fontFamily:'var(--mono)', color:c }}>
        قدرت رمز: {labels[Math.max(s-1,0)]}
      </div>
    </div>
  )
}

function FField({ label, id, type='text', placeholder, dir='rtl', value, onChange, error, hint, disabled }) {
  return (
    <div className="f-group">
      <label className="f-label" htmlFor={id}>{label}</label>
      <input id={id} type={type} placeholder={placeholder} dir={dir}
        value={value} onChange={onChange} disabled={disabled}
        className={`f-input${error?' error':''}`}
        autoComplete={type==='password'?'new-password':'off'}
      />
      {error && <div className="f-error">⚠ {error}</div>}
      {!error && hint && <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--muted)', marginTop:4 }}>{hint}</div>}
    </div>
  )
}

export default function RegisterPage({ user }) {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName:'', username:'', email:'',
    phone:'', address:'', password:'', confirm:'',
  })
  const [errs,   setErrs]   = useState({})
  const [apiErr, setApiErr] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success
  const [done,   setDone]   = useState(false)

  const set = k => e => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    setErrs(p => ({ ...p, [k]: '' }))
    setApiErr('')
  }

  const submit = async e => {
    e.preventDefault()
    const v = validate(form)
    if (Object.keys(v).length) { setErrs(v); return }

    setStatus('loading')

    try {
      // چک یوزرنیم
      const taken = await checkUsernameExists(form.username)
      if (taken) {
        setErrs(p => ({ ...p, username: 'این یوزرنیم گرفته شده است' }))
        setStatus('idle')
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

      if (error) { setApiErr(mapErr(error.message)); setStatus('idle'); return }

      // اگه auto-confirm بود مستقیم وارد شو
      if (data?.user?.confirmed_at || data?.user?.email_confirmed_at) {
        setStatus('success')
        setTimeout(() => { window.location.href = '/' }, 800)
      } else {
        setDone(true)
      }
    } catch {
      setApiErr('خطای اتصال — اینترنت خود را بررسی کنید')
      setStatus('idle')
    }
  }

  if (done) return (
    <div className="page-wrap">
      <Navbar user={null} profile={null} />
      <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
        <div className="card" style={{ padding:48, maxWidth:440, width:'100%', textAlign:'center', animation:'fadeUp 0.4s ease' }}>
          <div style={{ fontSize:64, marginBottom:20 }}>📬</div>
          <div style={{ fontFamily:'var(--display)', fontSize:26, marginBottom:12 }}>ثبت‌نام موفق!</div>
          <div style={{ fontSize:14, color:'var(--dim)', lineHeight:1.8, marginBottom:24 }}>
            یک ایمیل تأیید به{' '}
            <strong style={{ color:'var(--neon)' }}>{form.email}</strong>
            {' '}ارسال شد.<br/>لینک داخل ایمیل را کلیک کنید.
          </div>
          <div className="alert alert-warn" style={{ marginBottom:20 }}>
            ⚠️ پوشه Spam را هم بررسی کنید
          </div>
          <Link href="/login" className="btn btn-neon btn-full btn-lg">رفتن به ورود →</Link>
        </div>
      </div>
    </div>
  )

  const loading = status === 'loading'
  const success = status === 'success'
  const uLen    = form.username.length

  return (
    <div className="page-wrap">
      <Navbar user={null} profile={null} />
      <div style={{
        minHeight:'calc(100vh - 60px)', display:'flex',
        alignItems:'center', justifyContent:'center',
        padding:'40px 16px',
        background:'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,255,180,0.04) 0%, transparent 70%)',
      }}>
        <div className="card" style={{ padding:'40px 36px', width:'100%', maxWidth:540, animation:'fadeUp 0.4s ease' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🚀</div>
            <div style={{ fontFamily:'var(--display)', fontSize:28, fontWeight:800 }}>ثبت‌نام</div>
            <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)', letterSpacing:2, marginTop:6 }}>
              // JOIN THE NEXUS NETWORK
            </div>
          </div>

          {apiErr && <div className="alert alert-err">❌ {apiErr}</div>}
          {success && <div className="alert alert-ok">✅ ثبت‌نام موفق! در حال انتقال...</div>}

          <form onSubmit={submit} noValidate>

            {/* row 1 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <FField label="نام و نام خانوادگی" id="fn" placeholder="علی رضایی"
                value={form.fullName} onChange={set('fullName')} error={errs.fullName} disabled={loading||success} />

              <div>
                <FField label="یوزرنیم" id="un" placeholder="ali_rezaei" dir="ltr"
                  value={form.username} onChange={set('username')} error={errs.username} disabled={loading||success} />
                {!errs.username && uLen > 0 && (
                  <div style={{ fontSize:11, fontFamily:'var(--mono)', marginTop:-10, marginBottom:8, display:'flex', justifyContent:'space-between' }}>
                    <span style={{ color: uLen < 3 ? 'var(--hot)' : 'var(--neon)' }}>
                      {uLen < 3 ? `${3-uLen} کاراکتر دیگه` : '✓ مناسب'}
                    </span>
                    <span style={{ color: uLen > 20 ? 'var(--hot)' : 'var(--muted)' }}>{uLen}/20</span>
                  </div>
                )}
              </div>
            </div>

            <FField label="ایمیل" id="em" type="email" placeholder="you@example.com" dir="ltr"
              value={form.email} onChange={set('email')} error={errs.email} disabled={loading||success} />

            <FField label="شماره تلفن" id="ph" type="tel" placeholder="09123456789" dir="ltr"
              value={form.phone} onChange={set('phone')} error={errs.phone} disabled={loading||success} />

            <FField label="آدرس" id="ad" placeholder="تهران، خیابان..."
              value={form.address} onChange={set('address')} error={errs.address} disabled={loading||success} />

            {/* row 2 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <FField label="رمز عبور" id="pw" type="password" placeholder="حداقل ۶ کاراکتر" dir="ltr"
                  value={form.password} onChange={set('password')} error={errs.password} disabled={loading||success} />
                <PwStrength pw={form.password} />
              </div>
              <FField label="تکرار رمز عبور" id="co" type="password" placeholder="••••••" dir="ltr"
                value={form.confirm} onChange={set('confirm')} error={errs.confirm} disabled={loading||success} />
            </div>

            <button type="submit" disabled={loading||success}
              style={{
                width:'100%', padding:14, borderRadius:10, marginTop:8,
                background: success
                  ? 'linear-gradient(135deg,#00C896,#009970)'
                  : 'linear-gradient(135deg,var(--hot),#FF4D00)',
                color:'white', border:'none', fontWeight:800, fontSize:16,
                fontFamily:'var(--font)', display:'flex', alignItems:'center',
                justifyContent:'center', gap:10,
                opacity:(loading||success) ? 0.9 : 1,
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
                  در حال ثبت‌نام...
                </>
              ) : success ? '✅ ثبت‌نام شد!' : 'ساخت حساب رایگان ✨'}
            </button>

          </form>

          <div style={{ textAlign:'center', marginTop:18, fontSize:13, color:'var(--dim)' }}>
            حساب داری؟{' '}
            <Link href="/login" style={{ color:'var(--neon)', fontWeight:700 }}>وارد شو</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
