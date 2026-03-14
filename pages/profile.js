import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar } from '../components/UI'

export default function ProfilePage({ user, profile, authLoading }) {
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?from=/profile')
  }, [authLoading, user])

  if (authLoading) return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 60px)', flexDirection:'column', gap:16 }}>
        <div className="spinner" />
        <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--muted)', letterSpacing:2 }}>در حال بارگذاری...</div>
      </div>
    </div>
  )

  if (!user) return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />
      <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
        <div style={{ fontSize:64 }}>🔒</div>
        <div style={{ fontFamily:'var(--display)', fontSize:22, fontWeight:800 }}>ابتدا وارد شوید</div>
        <Link href="/login?from=/profile" className="btn btn-neon btn-lg">ورود</Link>
      </div>
    </div>
  )

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('fa-IR')
    : '—'

  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      <div style={{ maxWidth:680, margin:'0 auto', padding:'40px 24px' }}>

        {/* هدر */}
        <div style={{ marginBottom:28, display:'flex', alignItems:'center', gap:20, animation:'fadeUp 0.4s ease' }}>
          <div style={{
            width:80, height:80, borderRadius:'50%',
            background:'linear-gradient(135deg,var(--neon),var(--sky))',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:32, flexShrink:0, color:'var(--ink)', fontWeight:800,
            boxShadow:'0 0 30px rgba(0,255,180,0.3)',
          }}>
            {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontFamily:'var(--display)', fontSize:26, fontWeight:800 }}>
              {profile?.full_name || user.email?.split('@')[0] || '—'}
            </div>
            <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--dim)', marginTop:4 }}>
              @{profile?.username || '—'}
            </div>
            <span className={`badge ${profile?.role==='admin'?'badge-gold':'badge-neon'}`} style={{ marginTop:8, display:'inline-block' }}>
              {profile?.role==='admin' ? '👑 ADMIN' : '👤 USER'}
            </span>
          </div>
        </div>

        {/* اطلاعات */}
        <div className="card" style={{ padding:28, animation:'fadeUp 0.4s ease 0.1s both' }}>
          <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)', letterSpacing:2, marginBottom:20 }}>
            // PROFILE DETAILS
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {[
              { label:'نام کامل',         val: profile?.full_name || '—'                    },
              { label:'یوزرنیم',          val: '@' + (profile?.username || '—')             },
              { label:'ایمیل',            val: user.email,                    ltr: true     },
              { label:'شماره تلفن',       val: profile?.phone || '—',         ltr: true     },
              { label:'تاریخ عضویت',      val: joinDate                                     },
              { label:'نقش',              val: profile?.role==='admin'?'مدیر':'کاربر'       },
            ].map(({ label, val, ltr }) => (
              <div key={label}>
                <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--muted)', letterSpacing:1, marginBottom:4 }}>
                  {label.toUpperCase()}
                </div>
                <div style={{ fontSize:15, fontWeight:600, direction: ltr?'ltr':'rtl', textAlign:'right' }}>{val}</div>
              </div>
            ))}
          </div>

          {profile?.address && (
            <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid var(--rim)' }}>
              <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--muted)', letterSpacing:1, marginBottom:4 }}>آدرس</div>
              <div style={{ fontSize:15 }}>{profile.address}</div>
            </div>
          )}
        </div>

        <div style={{ marginTop:16, display:'flex', gap:10, animation:'fadeUp 0.4s ease 0.2s both' }}>
          <Link href="/orders"   className="btn btn-neon"  style={{ flex:1, justifyContent:'center' }}>📦 سفارشات من</Link>
          <Link href="/cart"     className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}>🛒 سبد خرید</Link>
          <Link href="/shop"     className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}>🛍️ فروشگاه</Link>
        </div>

      </div>
    </div>
  )
}
