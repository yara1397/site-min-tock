import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Navbar, LoadingScreen } from '../components/UI'

export default function ProfilePage({ user, profile, authLoading }) {
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?from=/profile')
  }, [authLoading, user])

  if (authLoading || !user) return <LoadingScreen />

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('fa-IR')
    : '—'

  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>

        <div className="anim-up" style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--neon), var(--sky))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, flexShrink: 0,
            boxShadow: '0 0 30px rgba(0,255,180,0.3)'
          }}>
            {profile?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <div className="t-display" style={{ fontSize: 26 }}>{profile?.full_name || '—'}</div>
            <div className="t-mono t-dim" style={{ fontSize: 12, marginTop: 4 }}>@{profile?.username}</div>
            <span className={`badge ${profile?.role === 'admin' ? 'badge-gold' : 'badge-neon'}`} style={{ marginTop: 8, display: 'inline-block' }}>
              {profile?.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
            </span>
          </div>
        </div>

        <div className="card anim-up-1" style={{ padding: 28 }}>
          <div className="t-mono t-muted" style={{ fontSize: 11, letterSpacing: 2, marginBottom: 20 }}>// PROFILE DETAILS</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { label: 'نام و نام خانوادگی', val: profile?.full_name },
              { label: 'یوزرنیم',            val: '@' + profile?.username },
              { label: 'ایمیل',              val: user.email,  dir: 'ltr' },
              { label: 'شماره تلفن',         val: profile?.phone   || '—', dir: 'ltr' },
              { label: 'تاریخ عضویت',        val: joinDate },
              { label: 'نقش',                val: profile?.role === 'admin' ? 'مدیر' : 'کاربر' },
            ].map(({ label, val, dir }) => (
              <div key={label}>
                <div className="f-label" style={{ marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 600, dir: dir || 'rtl' }}>{val || '—'}</div>
              </div>
            ))}
          </div>

          {profile?.address && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--rim)' }}>
              <div className="f-label" style={{ marginBottom: 4 }}>آدرس</div>
              <div style={{ fontSize: 15 }}>{profile.address}</div>
            </div>
          )}
        </div>

        <div className="anim-up-2" style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <Link href="/orders"  className="btn btn-neon" style={{ flex: 1, justifyContent: 'center' }}>📦 سفارشات من</Link>
          <Link href="/shop"    className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>🛍️ فروشگاه</Link>
        </div>

      </div>
    </div>
  )
}
