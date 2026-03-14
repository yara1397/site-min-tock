import Link from 'next/link'
import { Navbar } from '../components/UI'

const PRODUCTS = [
  { id: 1, name: 'Ultra Pro Template Bundle', cat: 'TEMPLATE', emoji: '🎨', price: 490000, compare: 980000, tag: 'BESTSELLER', sales: 1240 },
  { id: 2, name: 'Motion FX Pack Vol.3',       cat: 'MOTION',   emoji: '⚡', price: 299000, compare: 599000, tag: 'NEW',        sales: 830  },
  { id: 3, name: 'Neon Icon Set 3000+',         cat: 'ICON',     emoji: '💎', price: 149000, compare: 299000, tag: 'HOT',        sales: 2100 },
  { id: 4, name: 'Cyber UI Kit 2025',           cat: 'UI KIT',   emoji: '🤖', price: 650000, compare:1300000, tag: 'PREMIUM',    sales: 650  },
]

const ARTICLES = [
  { id: 1, title: 'آینده UI/UX در سال ۲۰۲۵', cat: 'design', emoji: '🌐', author: 'آریان مهدوی', views: 4820 },
  { id: 2, title: 'راهنمای کامل React 19',    cat: 'dev',    emoji: '⚛️', author: 'سارا کریمی',  views: 7130 },
  { id: 3, title: 'AI و آینده شغل طراحی',     cat: 'ai',     emoji: '🤖', author: 'آریان مهدوی', views: 9870 },
  { id: 4, title: 'CSS Grid vs Flexbox',       cat: 'dev',    emoji: '📐', author: 'علی رضایی',  views: 6120 },
]

export default function HomePage({ user, profile }) {
  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      {/* ── HERO ───────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '80px 32px' }}>

        {/* grid bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,180,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,180,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)' }} />

        {/* glows */}
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'rgba(0,255,180,0.07)', filter:'blur(120px)', top:-200, right:-100, animation:'pulse 6s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(255,0,100,0.07)', filter:'blur(120px)', bottom:-100, left:-100, animation:'pulse 8s ease-in-out infinite 2s' }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 900 }}>
          <div className="anim-up" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,255,180,0.08)', border:'1px solid rgba(0,255,180,0.2)', borderRadius:50, padding:'6px 18px', fontSize:12, fontFamily:'var(--mono)', color:'var(--neon)', marginBottom:28, letterSpacing:1 }}>
            <span style={{ animation:'blink 1s step-end infinite' }}>█</span> NEXUS DIGITAL — v2.5.0 ONLINE
          </div>

          <h1 className="t-display anim-up-1" style={{ fontSize: 'clamp(44px,8vw,96px)', lineHeight: 0.95, letterSpacing:-2, marginBottom:24 }}>
            <span style={{ display:'block', color:'var(--text)' }}>بهترین</span>
            <span style={{ display:'block', background:'linear-gradient(90deg,var(--neon),var(--sky),var(--hot))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>دارایی‌های دیجیتال</span>
            <span style={{ display:'block', color:'var(--text)' }}>برای خالقان</span>
          </h1>

          <p className="anim-up-2" style={{ fontSize:18, color:'var(--dim)', lineHeight:1.7, maxWidth:540, margin:'0 auto 40px' }}>
            قالب، آیکون، انیمیشن، فونت و هر چیزی برای ساخت شاهکار بعدیت
          </p>

          <div className="anim-up-3" style={{ display:'flex', gap:12, justifyContent:'center' }}>
            <Link href="/shop"     className="btn btn-hot btn-lg">⚡ کشف محصولات</Link>
            <Link href="/register" className="btn btn-neon btn-lg">ثبت‌نام رایگان</Link>
          </div>

          {/* stats */}
          <div className="anim-up-4" style={{ display:'flex', gap:0, border:'1px solid var(--rim)', borderRadius:'var(--r)', overflow:'hidden', margin:'60px auto 0', maxWidth:620 }}>
            {[
              { n: '۲۴,۳۰۰+', l: 'PRODUCTS SOLD' },
              { n: '۸۵۰+',    l: 'HAPPY USERS'   },
              { n: '۴.۹ ★',   l: 'AVG RATING'    },
              { n: '۲۴/۷',    l: 'SUPPORT'        },
            ].map(({ n, l }, i, arr) => (
              <div key={l} style={{ flex:1, padding:'20px 16px', textAlign:'center', borderLeft: i < arr.length-1 ? '1px solid var(--rim)' : 'none' }}>
                <div className="t-display" style={{ fontSize:28, color:'var(--neon)' }}>{n}</div>
                <div className="t-mono t-muted" style={{ fontSize:10, marginTop:4, letterSpacing:1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* marquee */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, overflow:'hidden', borderTop:'1px solid var(--rim)', background:'rgba(0,255,180,0.02)', padding:'10px 0' }}>
          <div style={{ display:'flex', gap:48, whiteSpace:'nowrap', fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)', letterSpacing:2, animation:'marquee 20s linear infinite' }}>
            {'DESIGN ASSETS • PRO TEMPLATES • 3D MODELS • MOTION FX • ICON SETS • FONT BUNDLES • UI KITS • '.repeat(4)}
          </div>
        </div>
      </section>

      {/* ── HOT PRODUCTS ──────────────────────── */}
      <section style={{ padding:'80px 32px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:36 }}>
          <div className="t-display" style={{ fontSize:30 }}>🔥 پرفروش‌ترین‌ها <span style={{ fontSize:11, fontFamily:'var(--mono)', background:'rgba(0,255,180,0.1)', color:'var(--neon)', border:'1px solid rgba(0,255,180,0.2)', borderRadius:4, padding:'3px 8px', letterSpacing:1, verticalAlign:'middle' }}>HOT</span></div>
          <Link href="/shop" className="t-mono t-dim" style={{ fontSize:12, letterSpacing:1, textDecoration:'none' }}>VIEW ALL →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
          {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* ── NEWS ────────────────────────────── */}
      <section style={{ padding:'80px 32px', maxWidth:1280, margin:'0 auto', borderTop:'1px solid var(--rim)' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:36 }}>
          <div className="t-display" style={{ fontSize:30 }}>📰 آخرین مقالات</div>
          <Link href="/news" className="t-mono t-dim" style={{ fontSize:12, letterSpacing:1, textDecoration:'none' }}>VIEW ALL →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
          {ARTICLES.map(a => <ArticleCard key={a.id} a={a} />)}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────── */}
      <section style={{ background:'linear-gradient(135deg,rgba(0,255,180,0.04),rgba(0,207,255,0.04))', borderTop:'1px solid var(--rim)', padding:'80px 32px', textAlign:'center' }}>
        <div style={{ maxWidth:480, margin:'0 auto' }}>
          <div style={{ fontSize:52, marginBottom:16 }}>🚀</div>
          <div className="t-display" style={{ fontSize:32, marginBottom:12 }}>آماده شروعی؟</div>
          <div className="t-dim" style={{ fontSize:15, marginBottom:28, lineHeight:1.6 }}>همین الان ثبت‌نام کن و به ۸۵۰+ خالق حرفه‌ای بپیوند</div>
          <Link href="/register" className="btn btn-hot btn-lg">شروع رایگان ⚡</Link>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ p }) {
  const disc = Math.round((1 - p.price / p.compare) * 100)
  const tagColors = { BESTSELLER: 'var(--gold)', NEW: 'var(--neon)', HOT: 'var(--hot)', PREMIUM: 'var(--sky)' }
  return (
    <div className="card" style={{ overflow:'hidden' }}>
      <div style={{ height:160, display:'flex', alignItems:'center', justifyContent:'center', fontSize:64, background:'linear-gradient(135deg,var(--ink3),var(--ink2))', position:'relative' }}>
        {p.emoji}
        {p.tag && <span style={{ position:'absolute', top:10, right:10, fontSize:10, fontFamily:'var(--mono)', fontWeight:600, letterSpacing:1, padding:'3px 8px', borderRadius:4, background:`rgba(0,0,0,0.5)`, color: tagColors[p.tag] }}>{p.tag}</span>}
      </div>
      <div style={{ padding:18 }}>
        <div className="t-mono" style={{ fontSize:10, color:'var(--sky)', letterSpacing:2, marginBottom:6 }}>{p.cat}</div>
        <div style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>{p.name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span className="t-display" style={{ fontSize:18, color:'var(--neon)' }}>{p.price.toLocaleString('fa-IR')} ت</span>
          <span style={{ fontSize:12, color:'var(--muted)', textDecoration:'line-through' }}>{p.compare.toLocaleString('fa-IR')}</span>
          <span style={{ fontSize:10, fontFamily:'var(--mono)', background:'rgba(255,0,100,0.1)', color:'var(--hot)', padding:'2px 6px', borderRadius:4 }}>-{disc}%</span>
        </div>
        <Link href="/shop" className="btn btn-neon btn-full" style={{ marginTop:12, fontSize:13 }}>+ افزودن به سبد</Link>
      </div>
    </div>
  )
}

function ArticleCard({ a }) {
  const catColors = { design: 'var(--neon)', dev: 'var(--sky)', ai: 'var(--hot)', tools: 'var(--gold)' }
  return (
    <div className="card" style={{ overflow:'hidden' }}>
      <div style={{ height:130, display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, background:'linear-gradient(135deg,var(--ink3),var(--ink2))', position:'relative' }}>
        {a.emoji}
        <span style={{ position:'absolute', bottom:8, right:8, fontSize:9, fontFamily:'var(--mono)', fontWeight:600, letterSpacing:1, padding:'2px 7px', borderRadius:3, background:`rgba(0,0,0,0.6)`, color: catColors[a.cat] }}>{a.cat.toUpperCase()}</span>
      </div>
      <div style={{ padding:16 }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:8, lineHeight:1.4 }}>{a.title}</div>
        <div className="t-mono" style={{ fontSize:11, color:'var(--muted)' }}>✍️ {a.author} • 👁 {a.views.toLocaleString('fa-IR')}</div>
      </div>
    </div>
  )
}
