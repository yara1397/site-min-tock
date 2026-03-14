import { useState } from 'react'
import { Navbar } from '../components/UI'

const ARTICLES = [
  { id: 1, title: 'آینده طراحی رابط کاربری در سال ۲۰۲۵', cat: 'design', emoji: '🌐', author: 'آریان مهدوی', excerpt: 'بررسی ترندهای اصلی طراحی UI که در سال ۲۰۲۵ دنیای دیجیتال را متحول خواهند کرد...', views: 4820, likes: 342, readTime: 8,  featured: true  },
  { id: 2, title: 'راهنمای کامل ساخت اپ با React 19',    cat: 'dev',    emoji: '⚛️', author: 'سارا کریمی',  excerpt: 'React 19 با قابلیت‌های انقلابی جدید، نحوه توسعه اپلیکیشن‌ها را برای همیشه تغییر داد...', views: 7130, likes: 521, readTime: 12, featured: true  },
  { id: 3, title: 'Glassmorphism یا Neumorphism؟',         cat: 'design', emoji: '🔮', author: 'علی رضایی',  excerpt: 'مقایسه عمیق دو سبک طراحی محبوب و اینکه کدام برای پروژه شما مناسب‌تر است...', views: 3240, likes: 218, readTime: 6,  featured: false },
  { id: 4, title: 'هوش مصنوعی و آینده شغل‌های طراحی',   cat: 'ai',     emoji: '🤖', author: 'آریان مهدوی', excerpt: 'آیا AI جایگزین طراحان می‌شود؟ تحلیل واقع‌بینانه از تأثیر هوش مصنوعی...', views: 9870, likes: 743, readTime: 10, featured: true  },
  { id: 5, title: 'بهترین ابزارهای No-Code در ۲۰۲۵',     cat: 'tools',  emoji: '🛠️', author: 'سارا کریمی',  excerpt: 'لیست کامل بهترین پلتفرم‌های No-Code که بدون یک خط کد، وبسایت حرفه‌ای می‌سازند...', views: 5430, likes: 389, readTime: 7,  featured: false },
  { id: 6, title: 'CSS Grid vs Flexbox: راهنمای نهایی',   cat: 'dev',    emoji: '📐', author: 'علی رضایی',  excerpt: 'وقتی Grid استفاده کنیم و وقتی Flexbox؟ پاسخ نهایی با مثال‌های کاربردی...', views: 6120, likes: 456, readTime: 9,  featured: false },
]

const CATS = [{ id:'all',label:'ALL'},{id:'design',label:'DESIGN'},{id:'dev',label:'DEV'},{id:'ai',label:'AI'},{id:'tools',label:'TOOLS'}]
const CAT_COLORS = { design:'var(--neon)', dev:'var(--sky)', ai:'var(--hot)', tools:'var(--gold)' }

export default function NewsPage({ user, profile }) {
  const [cat, setCat] = useState('all')

  const list = ARTICLES.filter(a => cat === 'all' || a.cat === cat)
  const featured = list.find(a => a.featured) || list[0]
  const rest = list.filter(a => a.id !== featured?.id)

  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      {/* bar */}
      <div style={{ background:'var(--ink2)', borderBottom:'1px solid var(--rim)', padding:'20px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div className="t-display" style={{ fontSize:24 }}>📰 مجله NEXUS</div>
        <div style={{ display:'flex', gap:6 }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className="t-mono"
              style={{ padding:'6px 14px', borderRadius:50, fontSize:11, letterSpacing:1, fontWeight:600, border:`1px solid ${cat===c.id?'rgba(0,255,180,0.4)':'var(--rim)'}`, background: cat===c.id?'rgba(0,255,180,0.1)':'transparent', color: cat===c.id?'var(--neon)':'var(--muted)', transition:'all 0.2s' }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px 28px' }}>

        {/* featured */}
        {featured && (
          <div className="card anim-up" style={{ display:'flex', marginBottom:40, overflow:'hidden' }}>
            <div style={{ width:360, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, background:'linear-gradient(135deg,var(--ink3),var(--ink2))', position:'relative' }}>
              {featured.emoji}
              <span style={{ position:'absolute', bottom:12, right:12, fontSize:10, fontFamily:'var(--mono)', fontWeight:600, letterSpacing:1, padding:'3px 8px', borderRadius:4, background:'rgba(0,0,0,0.6)', color: CAT_COLORS[featured.cat] }}>{featured.cat.toUpperCase()}</span>
            </div>
            <div style={{ padding:32 }}>
              <div className="badge badge-neon" style={{ marginBottom:12 }}>FEATURED</div>
              <div className="t-display" style={{ fontSize:24, marginBottom:12, lineHeight:1.3 }}>{featured.title}</div>
              <div style={{ fontSize:14, color:'var(--dim)', lineHeight:1.7, marginBottom:20 }}>{featured.excerpt}</div>
              <div className="t-mono" style={{ fontSize:11, color:'var(--muted)', display:'flex', gap:16 }}>
                <span>✍️ {featured.author}</span>
                <span>👁 {featured.views.toLocaleString('fa-IR')}</span>
                <span>❤️ {featured.likes}</span>
                <span>⏱ {featured.readTime} دقیقه</span>
              </div>
            </div>
          </div>
        )}

        {/* rest grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {rest.map(a => (
            <div key={a.id} className="card" style={{ overflow:'hidden' }}>
              <div style={{ height:150, display:'flex', alignItems:'center', justifyContent:'center', fontSize:56, background:'linear-gradient(135deg,var(--ink3),var(--ink2))', position:'relative' }}>
                {a.emoji}
                <span style={{ position:'absolute', bottom:8, right:8, fontSize:9, fontFamily:'var(--mono)', fontWeight:600, letterSpacing:1, padding:'2px 7px', borderRadius:3, background:'rgba(0,0,0,0.6)', color: CAT_COLORS[a.cat] }}>{a.cat.toUpperCase()}</span>
              </div>
              <div style={{ padding:18 }}>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:8, lineHeight:1.4 }}>{a.title}</div>
                <div style={{ fontSize:13, color:'var(--dim)', lineHeight:1.5, marginBottom:14, WebkitLineClamp:2, WebkitBoxOrient:'vertical', display:'-webkit-box', overflow:'hidden' }}>{a.excerpt}</div>
                <div className="t-mono" style={{ fontSize:11, color:'var(--muted)', display:'flex', justifyContent:'space-between' }}>
                  <span>{a.author}</span>
                  <span>👁 {a.views.toLocaleString('fa-IR')} • ⏱ {a.readTime}m</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
