import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar, LoadingScreen } from '../components/UI'

// Static sample orders (in production these would come from Supabase orders table)
const SAMPLE_ORDERS = [
  { id: 'ORD-4A2F1B', total: 939000, status: 'completed', date: '۱۴۰۳/۱۱/۱۵', items: [{ name: 'Ultra Pro Template Bundle', emoji:'🎨', price: 490000 }, { name: 'Neon Icon Set 3000+', emoji:'💎', price: 149000 }, { name: 'Motion FX Pack', emoji:'⚡', price: 299000 }] },
  { id: 'ORD-7C9E3D', total: 650000, status: 'completed', date: '۱۴۰۳/۱۱/۰۸', items: [{ name: 'Cyber UI Kit 2025', emoji:'🤖', price: 650000 }] },
]

export default function OrdersPage({ user, profile, authLoading }) {
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?from=/orders')
  }, [authLoading, user])

  if (authLoading || !user) return <LoadingScreen />

  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      <div style={{ maxWidth:800, margin:'0 auto', padding:'36px 24px' }}>
        <div className="t-display anim-up" style={{ fontSize:26, marginBottom:24 }}>📦 سفارشات من</div>

        {SAMPLE_ORDERS.length === 0 ? (
          <div style={{ textAlign:'center', padding:80 }}>
            <div style={{ fontSize:64, marginBottom:16 }}>📭</div>
            <div className="t-display" style={{ fontSize:22, marginBottom:8 }}>سفارشی ندارید</div>
            <div className="t-dim" style={{ marginBottom:24 }}>اولین خریدت رو ثبت کن!</div>
            <Link href="/shop" className="btn btn-neon">به فروشگاه</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {SAMPLE_ORDERS.map(o => (
              <div key={o.id} className="card anim-up" style={{ padding:22 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <div>
                    <span className="badge badge-neon">✅ COMPLETED</span>
                    <div className="t-mono t-muted" style={{ fontSize:11, marginTop:6 }}>#{o.id}</div>
                  </div>
                  <div className="t-mono t-dim" style={{ fontSize:12 }}>{o.date}</div>
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
                  <div className="t-dim" style={{ fontSize:13 }}>مجموع</div>
                  <div className="t-display" style={{ fontSize:20, color:'var(--neon)' }}>{o.total.toLocaleString('fa-IR')} ت</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
