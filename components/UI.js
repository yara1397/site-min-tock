import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

/* ═══════════════════════════════════════
   CURSOR
═══════════════════════════════════════ */
export function Cursor() {
  useEffect(() => {
    const dot  = document.getElementById('nx-cursor')
    const ring = document.getElementById('nx-ring')
    if (!dot || !ring) return
    let mx = -200, my = -200, rx = -200, ry = -200, raf

    const onMove = e => { mx = e.clientX; my = e.clientY }
    const onDown = () => { dot.classList.add('click'); ring.classList.add('click') }
    const onUp   = () => { dot.classList.remove('click'); ring.classList.remove('click') }

    const loop = () => {
      rx += (mx-rx)*0.13; ry += (my-ry)*0.13
      dot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove',onMove); window.removeEventListener('mousedown',onDown); window.removeEventListener('mouseup',onUp) }
  }, [])

  return (
    <>
      <div id="nx-cursor" style={{ position:'fixed', width:10, height:10, borderRadius:'50%', background:'var(--neon)', pointerEvents:'none', zIndex:99999, top:0, left:0, mixBlendMode:'difference', transition:'background 0.15s,width 0.15s,height 0.15s' }} />
      <div id="nx-ring"   style={{ position:'fixed', width:34, height:34, borderRadius:'50%', border:'1px solid rgba(0,255,180,0.5)', pointerEvents:'none', zIndex:99998, top:0, left:0, transition:'opacity 0.2s' }} />
      <style>{`
        #nx-cursor.click{width:6px!important;height:6px!important;background:var(--hot)!important;}
        #nx-ring.click{opacity:0.3;}
        *{cursor:none!important;}
      `}</style>
    </>
  )
}

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
let _toastFn = null
export function toast(msg, type='ok') { if(_toastFn) _toastFn(msg,type) }

export function ToastContainer() {
  const [list, setList] = useState([])
  useEffect(() => {
    _toastFn = (msg, type) => {
      const id = Date.now()+Math.random()
      setList(p => [...p,{id,msg,type}])
      setTimeout(() => setList(p => p.filter(t=>t.id!==id)), 3800)
    }
    return () => { _toastFn = null }
  }, [])
  return (
    <div style={{ position:'fixed', bottom:24, left:24, zIndex:9999, display:'flex', flexDirection:'column', gap:8 }}>
      {list.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}
    </div>
  )
}

/* ═══════════════════════════════════════
   NAVBAR
═══════════════════════════════════════ */
export function Navbar({ user, profile }) {
  const router = useRouter()
  const p = router.pathname
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // بارگذاری اولیه
    updateCount()
    // گوش دادن به تغییرات سبد
    window.addEventListener('cartUpdated', updateCount)
    return () => window.removeEventListener('cartUpdated', updateCount)
  }, [])

  const updateCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('nexus_cart') || '[]')
      setCartCount(cart.reduce((s,i) => s+i.qty, 0))
    } catch { setCartCount(0) }
  }

  const handleLogout = async () => {
    try { await supabase.auth.signOut() } catch {}
    localStorage.removeItem('nexus_cart')
    localStorage.clear()
    sessionStorage.clear()
    toast('👋 خروج موفق', 'ok')
    setTimeout(() => { window.location.href = '/login' }, 400)
  }

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo">NEX<span>US</span></Link>

      <div style={{ display:'flex', gap:4 }}>
        <Link href="/"        className={`nav-link${p==='/'?        ' active':''}`}>خانه</Link>
        <Link href="/shop"    className={`nav-link${p==='/shop'?    ' active':''}`}>فروشگاه</Link>
        <Link href="/news"    className={`nav-link${p==='/news'?    ' active':''}`}>مجله</Link>
        {user && <Link href="/orders"   className={`nav-link${p==='/orders'?  ' active':''}`}>سفارشات</Link>}
        {profile?.role === 'admin' && <Link href="/admin" className={`nav-link${p.startsWith('/admin')?' active':''}`} style={{ color:'var(--gold)' }}>⚙️ ادمین</Link>}
      </div>

      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        {/* دکمه سبد خرید */}
        <Link href="/cart" style={{
          position:'relative', padding:'8px 14px', borderRadius:10,
          background:'var(--ink3)', border:'1px solid var(--rim)',
          fontSize:18, textDecoration:'none', display:'flex', alignItems:'center',
          transition:'border-color 0.2s',
        }}>
          🛒
          {cartCount > 0 && (
            <span style={{
              position:'absolute', top:-6, right:-6,
              background:'var(--hot)', color:'white', borderRadius:'50%',
              width:18, height:18, fontSize:10, fontWeight:800,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>{cartCount}</span>
          )}
        </Link>

        {user ? (
          <>
            <Link href="/profile" className="btn btn-ghost btn-sm">
              {profile?.username ? `@${profile.username}` : user.email?.split('@')[0]}
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>خروج</button>
          </>
        ) : (
          <>
            <Link href="/login"    className="btn btn-ghost btn-sm">ورود</Link>
            <Link href="/register" className="btn btn-hot btn-sm">ثبت‌نام ⚡</Link>
          </>
        )}
      </div>
    </nav>
  )
}

/* ═══════════════════════════════════════
   LOADING
═══════════════════════════════════════ */
export function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, background:'var(--ink)' }}>
      <div className="spinner" />
      <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)', letterSpacing:3 }}>LOADING...</div>
    </div>
  )
}

/* ═══════════════════════════════════════
   FORM FIELD
═══════════════════════════════════════ */
export function Field({ label, id, type='text', placeholder, dir='rtl', value, onChange, error, hint, disabled }) {
  return (
    <div className="f-group">
      <label className="f-label" htmlFor={id}>{label}</label>
      <input id={id} type={type} placeholder={placeholder} dir={dir} value={value} onChange={onChange} disabled={disabled}
        className={`f-input${error?' error':''}`}
        autoComplete={type==='password'?'new-password':'off'}
      />
      {error && <div className="f-error">⚠ {error}</div>}
      {!error && hint && <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--muted)', marginTop:4 }}>{hint}</div>}
    </div>
  )
}
