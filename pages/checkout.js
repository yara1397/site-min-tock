import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar } from '../components/UI'
import { getCart, getCartTotal, clearCart } from '../lib/cart'

const STEPS = ['سبد خرید','اطلاعات پرداخت','تأیید نهایی']

export default function CheckoutPage({ user, profile }) {
  const router = useRouter()
  const [cart,  setCart]  = useState([])
  const [step,  setStep]  = useState(1) // 1=اطلاعات  2=تأیید  3=موفق
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [form, setForm] = useState({
    fullName: profile?.full_name  || '',
    phone:    profile?.phone      || '',
    email:    user?.email         || '',
    address:  profile?.address    || '',
    cardNum:  '',
    cardExp:  '',
    cardCvv:  '',
  })
  const [errs, setErrs] = useState({})

  useEffect(() => {
    const c = getCart()
    if (!c.length) { router.push('/shop'); return }
    setCart(c)
  }, [])

  useEffect(() => {
    if (profile) {
      setForm(p => ({
        ...p,
        fullName: profile.full_name || p.fullName,
        phone:    profile.phone     || p.phone,
        address:  profile.address   || p.address,
      }))
    }
    if (user) {
      setForm(p => ({ ...p, email: user.email || p.email }))
    }
  }, [profile, user])

  const set = k => e => {
    let v = e.target.value
    // فرمت کارت: هر ۴ رقم یه فاصله
    if (k==='cardNum') v = v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
    if (k==='cardExp') v = v.replace(/\D/g,'').slice(0,4).replace(/^(\d{2})(\d)/,'$1/$2')
    if (k==='cardCvv') v = v.replace(/\D/g,'').slice(0,4)
    setForm(p => ({ ...p, [k]: v }))
    setErrs(p => ({ ...p, [k]: '' }))
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'نام الزامی است'
    if (!form.phone.trim())    e.phone    = 'شماره تلفن الزامی است'
    if (!form.email.trim())    e.email    = 'ایمیل الزامی است'
    if (!form.address.trim())  e.address  = 'آدرس الزامی است'
    if (!form.cardNum || form.cardNum.replace(/\s/g,'').length < 16) e.cardNum = 'شماره کارت ۱۶ رقم است'
    if (!form.cardExp || form.cardExp.length < 5) e.cardExp = 'تاریخ انقضا را وارد کنید'
    if (!form.cardCvv || form.cardCvv.length < 3) e.cardCvv = 'CVV را وارد کنید'
    return e
  }

  const handleNext = () => {
    const e = validateStep1()
    if (Object.keys(e).length) { setErrs(e); return }
    setStep(2)
    window.scrollTo(0,0)
  }

  const handlePay = async () => {
    setLoading(true)
    // شبیه‌سازی پرداخت (۲ ثانیه)
    await new Promise(r => setTimeout(r, 2000))
    const id = 'NX-' + Date.now().toString(36).toUpperCase()
    setOrderId(id)
    clearCart()
    setStep(3)
    setLoading(false)
    window.scrollTo(0,0)
  }

  const total    = getCartTotal()
  const discount = Math.round(total * 0.05)
  const final    = total - discount

  const FField = ({ label, id, type='text', placeholder, dir='rtl', k, maxLen, hint }) => (
    <div className="f-group">
      <label className="f-label">{label}</label>
      <input type={type} placeholder={placeholder} dir={dir}
        value={form[k]} onChange={set(k)} maxLength={maxLen}
        className={`f-input${errs[k]?' error':''}`}
        autoComplete="off"
      />
      {errs[k] && <div className="f-error">⚠ {errs[k]}</div>}
      {!errs[k] && hint && <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--muted)', marginTop:4 }}>{hint}</div>}
    </div>
  )

  // ── صفحه موفقیت ──
  if (step === 3) return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />
      <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
        <div className="card" style={{ padding:48, maxWidth:480, width:'100%', textAlign:'center', animation:'fadeUp 0.5s ease', border:'1px solid rgba(0,255,180,0.3)', boxShadow:'0 0 60px rgba(0,255,180,0.1)' }}>
          <div style={{ fontSize:72, marginBottom:20, animation:'pulse 1s ease' }}>🎉</div>
          <div style={{ fontFamily:'var(--display)', fontSize:28, fontWeight:800, marginBottom:12, color:'var(--neon)' }}>
            پرداخت موفق!
          </div>
          <div style={{ fontSize:14, color:'var(--dim)', lineHeight:1.8, marginBottom:24 }}>
            سفارش شما با موفقیت ثبت شد.<br/>
            فایل‌های دیجیتال به ایمیل{' '}
            <strong style={{ color:'var(--text)' }}>{form.email}</strong>
            {' '}ارسال می‌شود.
          </div>

          <div className="card" style={{ padding:16, marginBottom:24, textAlign:'right' }}>
            <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--muted)', marginBottom:12, letterSpacing:1 }}>// ORDER DETAILS</div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:8 }}>
              <span style={{ color:'var(--dim)' }}>شماره سفارش</span>
              <span style={{ fontFamily:'var(--mono)', color:'var(--sky)' }}>{orderId}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:8 }}>
              <span style={{ color:'var(--dim)' }}>تعداد محصولات</span>
              <span>{cart.length} محصول</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:800, paddingTop:10, borderTop:'1px solid var(--rim)' }}>
              <span style={{ color:'var(--dim)' }}>مبلغ پرداخت شده</span>
              <span style={{ color:'var(--neon)', fontFamily:'var(--display)' }}>{final.toLocaleString('fa-IR')} ت</span>
            </div>
          </div>

          <div style={{ display:'flex', gap:12 }}>
            <Link href="/orders" className="btn btn-neon" style={{ flex:1, justifyContent:'center' }}>📦 سفارشات من</Link>
            <Link href="/shop"   className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}>🛍️ ادامه خرید</Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'28px 24px' }}>

        {/* progress bar */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 'none' }}>
              <div style={{
                width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'var(--mono)', fontSize:13, fontWeight:700, flexShrink:0,
                background: i+1 < step ? 'var(--neon)' : i+1 === step ? 'rgba(0,255,180,0.15)' : 'var(--ink3)',
                border: `2px solid ${i+1 <= step ? 'var(--neon)' : 'var(--rim)'}`,
                color: i+1 < step ? 'var(--ink)' : i+1 === step ? 'var(--neon)' : 'var(--muted)',
              }}>
                {i+1 < step ? '✓' : i+1}
              </div>
              <span style={{ marginRight:8, fontSize:13, color: i+1 === step ? 'var(--text)' : 'var(--muted)', fontWeight: i+1===step ? 700 : 400 }}>{s}</span>
              {i < STEPS.length-1 && (
                <div style={{ flex:1, height:2, background: i+1 < step ? 'var(--neon)' : 'var(--rim)', margin:'0 12px', transition:'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24 }}>

          {/* فرم */}
          <div>
            {step === 1 && (
              <div className="card" style={{ padding:28 }}>
                <div style={{ fontFamily:'var(--display)', fontSize:20, fontWeight:800, marginBottom:24 }}>
                  📋 اطلاعات گیرنده
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <FField label="نام و نام خانوادگی" k="fullName" placeholder="علی رضایی" />
                  <FField label="شماره تلفن" k="phone" placeholder="09123456789" dir="ltr" />
                </div>
                <FField label="ایمیل" k="email" type="email" placeholder="you@example.com" dir="ltr" hint="فایل‌ها به این ایمیل ارسال می‌شود" />
                <FField label="آدرس" k="address" placeholder="تهران، خیابان ولیعصر..." />

                <div style={{ height:1, background:'var(--rim)', margin:'24px 0' }} />

                <div style={{ fontFamily:'var(--display)', fontSize:20, fontWeight:800, marginBottom:24 }}>
                  💳 اطلاعات کارت
                </div>

                <div className="alert alert-warn" style={{ marginBottom:20, fontSize:12 }}>
                  🔒 این صفحه شبیه‌سازی است — اطلاعات کارت واقعی وارد نکنید
                </div>

                <FField label="شماره کارت" k="cardNum" placeholder="1234 5678 9012 3456" dir="ltr" hint="۱۶ رقم روی کارت بانکی" />

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <FField label="تاریخ انقضا" k="cardExp" placeholder="MM/YY" dir="ltr" maxLen={5} />
                  <FField label="CVV" k="cardCvv" placeholder="123" dir="ltr" maxLen={4} hint="۳ یا ۴ رقم پشت کارت" />
                </div>

                <button onClick={handleNext} style={{
                  width:'100%', padding:14, borderRadius:10, marginTop:8,
                  background:'linear-gradient(135deg,var(--neon),var(--sky))',
                  color:'var(--ink)', border:'none', fontWeight:800, fontSize:16,
                  fontFamily:'var(--font)', boxShadow:'0 8px 24px rgba(0,255,180,0.3)',
                }}>
                  ادامه و تأیید →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card" style={{ padding:28 }}>
                <div style={{ fontFamily:'var(--display)', fontSize:20, fontWeight:800, marginBottom:24 }}>
                  🔍 تأیید نهایی سفارش
                </div>

                {/* اطلاعات کاربر */}
                <div className="card" style={{ padding:16, marginBottom:16, background:'var(--ink3)' }}>
                  <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--muted)', letterSpacing:1, marginBottom:12 }}>// SHIPPING INFO</div>
                  {[
                    ['نام',       form.fullName],
                    ['تلفن',      form.phone],
                    ['ایمیل',     form.email],
                    ['آدرس',      form.address],
                    ['شماره کارت','**** **** **** ' + form.cardNum.replace(/\s/g,'').slice(-4)],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:8 }}>
                      <span style={{ color:'var(--dim)' }}>{k}</span>
                      <span style={{ fontWeight:600 }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* محصولات */}
                <div style={{ marginBottom:24 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--rim)' }}>
                      <span style={{ fontSize:28 }}>{item.emoji}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:600 }}>{item.name}</div>
                        <div style={{ fontSize:12, color:'var(--dim)' }}>تعداد: {item.qty}</div>
                      </div>
                      <div style={{ fontFamily:'var(--display)', fontSize:16, color:'var(--neon)', fontWeight:800 }}>
                        {(item.price * item.qty).toLocaleString('fa-IR')} ت
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display:'flex', gap:12 }}>
                  <button onClick={() => setStep(1)} className="btn btn-ghost" style={{ flex:1 }}>← ویرایش</button>
                  <button onClick={handlePay} disabled={loading}
                    style={{
                      flex:2, padding:14, borderRadius:10,
                      background:'linear-gradient(135deg,var(--hot),#FF4D00)',
                      color:'white', border:'none', fontWeight:800, fontSize:16,
                      fontFamily:'var(--font)', display:'flex', alignItems:'center',
                      justifyContent:'center', gap:10,
                      boxShadow:'0 8px 24px rgba(255,0,100,0.35)',
                      opacity: loading ? 0.85 : 1,
                    }}>
                    {loading ? (
                      <>
                        <div style={{ width:20, height:20, borderRadius:'50%', border:'2.5px solid rgba(255,255,255,0.35)', borderTopColor:'white', animation:'spin 0.7s linear infinite', flexShrink:0 }} />
                        در حال پردازش...
                      </>
                    ) : `💳 پرداخت ${final.toLocaleString('fa-IR')} ت`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* خلاصه */}
          <div className="card" style={{ padding:24, height:'fit-content', position:'sticky', top:72 }}>
            <div style={{ fontFamily:'var(--display)', fontSize:17, fontWeight:800, marginBottom:16 }}>خلاصه سفارش</div>

            {cart.map(item => (
              <div key={item.id} style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:10, gap:8 }}>
                <span style={{ color:'var(--dim)', display:'flex', gap:8, alignItems:'center' }}>
                  <span>{item.emoji}</span>
                  <span style={{ flex:1 }}>{item.name}</span>
                  {item.qty > 1 && <span style={{ color:'var(--muted)', fontFamily:'var(--mono)', fontSize:11 }}>×{item.qty}</span>}
                </span>
                <span style={{ fontWeight:600, flexShrink:0 }}>{(item.price*item.qty).toLocaleString('fa-IR')}</span>
              </div>
            ))}

            <div style={{ height:1, background:'var(--rim)', margin:'14px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--dim)', marginBottom:8 }}>
              <span>جمع</span><span>{total.toLocaleString('fa-IR')} ت</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--neon)', marginBottom:8 }}>
              <span>تخفیف ۵٪</span><span>− {discount.toLocaleString('fa-IR')} ت</span>
            </div>
            <div style={{ height:1, background:'var(--rim)', margin:'10px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--display)', fontSize:20, fontWeight:800 }}>
              <span>مجموع</span>
              <span style={{ color:'var(--neon)' }}>{final.toLocaleString('fa-IR')} ت</span>
            </div>

            <div style={{ marginTop:16, padding:12, background:'rgba(0,255,180,0.05)', borderRadius:8, border:'1px solid rgba(0,255,180,0.15)' }}>
              <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--neon)', marginBottom:4 }}>✅ تضمین‌ها</div>
              <div style={{ fontSize:12, color:'var(--dim)', lineHeight:1.7 }}>
                🔒 پرداخت امن<br/>
                ⚡ دانلود فوری<br/>
                ♾️ دسترسی مادام‌العمر
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
