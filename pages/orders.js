import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar } from '../components/UI'

const SAMPLE = [
  { id:'NX-A4F2B1', total:939000,  date:'۱۴۰۳/۱۱/۱۵', status:'completed', items:[
    { emoji:'🎨', name:'Ultra Pro Template Bundle', price:490000 },
    { emoji:'💎', name:'Neon Icon Set 3000+',        price:149000 },
    { emoji:'⚡', name:'Motion FX Pack',             price:299000 },
  ]},
  { id:'NX-7C9E3D', total:650000,  date:'۱۴۰۳/۱۱/۰۸', status:'completed', items:[
    { emoji:'🤖', name:'Cyber UI Kit 2025', price:650000 },
  ]},
]

export default function OrdersPage({ user, profile, authLoading }) {
  const router = useRouter()

  useEffect(() => {
    // اگه loading تموم شد و لاگین نیست، برو login
    if (!authLoading && !user) {
      router.push('/login?from=/orders')
    }
  }, [authLoading, user])

  // هنوز داره لود می‌شه
  if (authLoading) return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 60px)', flexDirection:'column', gap:16 }}>
        <div className="spinner" />
        <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--muted)', letterSpacing:2 }}>در حال بارگذاری...</div>
      </div>
    </div>
  )

  // لاگین نیست
  if (!user) return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />
      <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:32 }}>
        <div style={{ fontSize:64 }}>🔒</div>
        <div style={{ fontFamily:'var(--display)', fontSize:22, fontWeight:800 }}>ابتدا وارد شوید</div>
        <Link href="/login?from=/orders" className="btn btn-neon btn-lg">ورود به حساب</Link>
      </div>
    </div>
  )

  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      <div style={{ maxWidth:800, margin:'0 auto', padding:'36px 24px' }}>
        <div style={{ fontFamily:'var(--display)', fontSize:26, fontWeight:800, marginBottom:24 }}>📦 سفارشات من</div>

        {SAMPLE.length === 0 ? (
          <div style={{ textAlign:'center', padding:80 }}>
            <div style={{ fontSize:64, marginBottom:16 }}>📭</div>
            <div style={{ fontFamily:'var(--display)', fontSize:22, marginBottom:8 }}>سفارشی ندارید</div>
            <Link href="/shop" className="btn btn-neon">به فروشگاه</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {SAMPLE.map(o => (
              <div key={o.id} className="card" style={{ padding:22 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <div>
                    <span className="badge badge-neon">✅ تکمیل شده</span>
                    <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--muted)', marginTop:6 }}>#{o.id}</div>
                  </div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--dim)' }}>{o.date}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
                  {o.items.map(it => (
                    <div key={it.name} style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
                      <span>{it.emoji} {it.name}</span>
                      <span style={{ color:'var(--dim)' }}>{it.price.toLocaleString('fa-IR')} ت</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:'1px solid var(--rim)', paddingTop:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:13, color:'var(--dim)' }}>مجموع</span>
                  <span style={{ fontFamily:'var(--display)', fontSize:20, color:'var(--neon)', fontWeight:800 }}>
                    {o.total.toLocaleString('fa-IR')} ت
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
