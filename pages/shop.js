import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '../components/UI'

const ALL_PRODUCTS = [
  { id: 'p1', name: 'Ultra Pro Template Bundle', cat: 'template', emoji: '🎨', price: 490000, compare: 980000, tag: 'BESTSELLER', rating: 4.9, reviews: 347, sales: 1240, desc: 'پکیج کامل ۵۰+ قالب حرفه‌ای برای وب‌سایت‌های مدرن' },
  { id: 'p2', name: 'Motion FX Pack Vol.3',       cat: 'animation',emoji: '⚡', price: 299000, compare: 599000, tag: 'NEW',        rating: 4.8, reviews: 189, sales: 830,  desc: 'انیمیشن‌های پرمیوم برای After Effects و Lottie' },
  { id: 'p3', name: 'Neon Icon Set 3000+',         cat: 'icon',     emoji: '💎', price: 149000, compare: 299000, tag: 'HOT',        rating: 4.9, reviews: 521, sales: 2100, desc: '۳۰۰۰+ آیکون نئون با فرمت SVG، PNG و Figma' },
  { id: 'p4', name: 'Cyber UI Kit 2025',           cat: 'template', emoji: '🤖', price: 650000, compare:1300000, tag: 'PREMIUM',    rating: 4.7, reviews: 203, sales: 650,  desc: 'کیت طراحی کامل با تم سایبرپانک برای Figma' },
  { id: 'p5', name: 'Texture Vault Premium',       cat: 'texture',  emoji: '🖼️', price: 189000, compare: 389000, tag: '',          rating: 4.6, reviews: 98,  sales: 420,  desc: '۵۰۰ تکسچر 4K با لایسنس تجاری کامل' },
  { id: 'p6', name: 'Glassmorphism Components',    cat: 'template', emoji: '🔮', price: 350000, compare: 700000, tag: 'NEW',        rating: 4.8, reviews: 156, sales: 580,  desc: '۱۲۰+ کامپوننت گلاس‌مورفیسم برای React و Vue' },
  { id: 'p7', name: 'Arabic/Farsi Font Bundle',    cat: 'font',     emoji: '✍️', price: 220000, compare: 440000, tag: 'POPULAR',    rating: 4.9, reviews: 412, sales: 1800, desc: '۲۵ فونت فارسی/عربی با وزن‌های مختلف' },
  { id: 'p8', name: '3D Object Library',           cat: '3d',       emoji: '🎯', price: 799000, compare:1600000, tag: 'EXCLUSIVE',  rating: 4.7, reviews: 67,  sales: 290,  desc: '۲۰۰ مدل سه‌بعدی آماده با فرمت GLB و OBJ' },
]

const CATS = [
  { id: 'all',       label: 'ALL'      },
  { id: 'template',  label: 'TEMPLATE' },
  { id: 'animation', label: 'MOTION'   },
  { id: 'icon',      label: 'ICONS'    },
  { id: 'font',      label: 'FONTS'    },
  { id: '3d',        label: '3D'       },
  { id: 'texture',   label: 'TEXTURE'  },
]

const TAG_COLORS = { BESTSELLER: 'var(--gold)', NEW: 'var(--neon)', HOT: 'var(--hot)', PREMIUM: 'var(--sky)', POPULAR: '#FF6B00', EXCLUSIVE: '#CC88FF' }

export default function ShopPage({ user, profile }) {
  const [cat,  setCat]  = useState('all')
  const [sort, setSort] = useState('popular')
  const [added, setAdded] = useState({})

  let list = ALL_PRODUCTS.filter(p => cat === 'all' || p.cat === cat)
  if (sort === 'popular')    list = [...list].sort((a,b) => b.sales - a.sales)
  if (sort === 'rating')     list = [...list].sort((a,b) => b.rating - a.rating)
  if (sort === 'price_asc')  list = [...list].sort((a,b) => a.price - b.price)
  if (sort === 'price_desc') list = [...list].sort((a,b) => b.price - a.price)

  const handleAdd = (id) => {
    if (!user) { window.location.href = '/login?from=/shop'; return }
    setAdded(p => ({ ...p, [id]: true }))
    setTimeout(() => setAdded(p => ({ ...p, [id]: false })), 2000)
  }

  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      {/* bar */}
      <div style={{ background:'var(--ink2)', borderBottom:'1px solid var(--rim)', padding:'20px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <div className="t-display" style={{ fontSize:24 }}>🛍️ فروشگاه</div>
          <div className="t-mono t-muted" style={{ fontSize:11, marginTop:3 }}>{list.length} محصول یافت شد</div>
        </div>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
          {/* category chips */}
          <div style={{ display:'flex', gap:6 }}>
            {CATS.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className="t-mono"
                style={{ padding:'6px 14px', borderRadius:50, fontSize:11, letterSpacing:1, fontWeight:600, border:`1px solid ${cat===c.id ? 'rgba(0,255,180,0.4)' : 'var(--rim)'}`, background: cat===c.id ? 'rgba(0,255,180,0.1)' : 'transparent', color: cat===c.id ? 'var(--neon)' : 'var(--muted)', transition:'all 0.2s' }}
              >{c.label}</button>
            ))}
          </div>
          {/* sort */}
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding:'8px 14px', borderRadius:8, background:'var(--card)', border:'1px solid var(--rim)', color:'var(--text)', fontFamily:'var(--font)', fontSize:13 }}>
            <option value="popular">MOST POPULAR</option>
            <option value="rating">TOP RATED</option>
            <option value="price_asc">PRICE ↑</option>
            <option value="price_desc">PRICE ↓</option>
          </select>
        </div>
      </div>

      {/* grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(268px,1fr))', gap:20, padding:'28px 28px' }}>
        {list.map(p => {
          const disc = Math.round((1 - p.price / p.compare) * 100)
          return (
            <div key={p.id} className="card" style={{ overflow:'hidden', cursor:'default' }}>
              <div style={{ height:180, display:'flex', alignItems:'center', justifyContent:'center', fontSize:68, background:'linear-gradient(135deg,var(--ink3),var(--ink2))', position:'relative' }}>
                {p.emoji}
                {p.tag && (
                  <span style={{ position:'absolute', top:10, right:10, fontSize:10, fontFamily:'var(--mono)', fontWeight:600, letterSpacing:1, padding:'3px 9px', borderRadius:4, border:`1px solid ${TAG_COLORS[p.tag]}33`, background:`${TAG_COLORS[p.tag]}18`, color: TAG_COLORS[p.tag] }}>{p.tag}</span>
                )}
              </div>
              <div style={{ padding:20 }}>
                <div className="t-mono" style={{ fontSize:10, color:'var(--sky)', letterSpacing:2, marginBottom:6 }}>{p.cat.toUpperCase()}</div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:7, lineHeight:1.3 }}>{p.name}</div>
                <div style={{ fontSize:13, color:'var(--dim)', lineHeight:1.5, marginBottom:14, WebkitLineClamp:2, WebkitBoxOrient:'vertical', display:'-webkit-box', overflow:'hidden' }}>{p.desc}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <span style={{ color:'var(--gold)', fontSize:13 }}>⭐ {p.rating} <span style={{ color:'var(--muted)' }}>({p.reviews})</span></span>
                  <span className="t-mono" style={{ fontSize:11, color:'var(--muted)' }}>{p.sales.toLocaleString('fa-IR')} فروش</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span className="t-display" style={{ fontSize:19, color:'var(--neon)' }}>{p.price.toLocaleString('fa-IR')} ت</span>
                  <span style={{ fontSize:12, color:'var(--muted)', textDecoration:'line-through' }}>{p.compare.toLocaleString('fa-IR')}</span>
                  <span style={{ fontSize:10, fontFamily:'var(--mono)', background:'rgba(255,0,100,0.1)', color:'var(--hot)', padding:'2px 6px', borderRadius:4 }}>-{disc}%</span>
                </div>
                <button onClick={() => handleAdd(p.id)}
                  style={{ width:'100%', padding:'10px', borderRadius:8, fontSize:13, fontWeight:700, fontFamily:'var(--font)', border: added[p.id] ? '1px solid var(--neon)' : '1px solid rgba(0,255,180,0.25)', background: added[p.id] ? 'rgba(0,255,180,0.15)' : 'rgba(0,255,180,0.08)', color:'var(--neon)', transition:'all 0.2s' }}>
                  {added[p.id] ? '✅ اضافه شد!' : '+ افزودن به سبد'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
