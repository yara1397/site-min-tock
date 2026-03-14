import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Navbar, LoadingScreen, toast } from '../components/UI'
import { getAllProfiles } from '../lib/supabase'

const TABS = [
  { id:'overview', label:'📊  نمای کلی'  },
  { id:'users',    label:'👥  کاربران'    },
  { id:'products', label:'🛍️  محصولات'    },
  { id:'articles', label:'📰  مقالات'     },
]

const MOCK_PRODUCTS = [
  { id:'p1', emoji:'🎨', name:'Ultra Pro Bundle',        cat:'template',  price:490000, sales:1240, rating:4.9 },
  { id:'p2', emoji:'⚡', name:'Motion FX Pack',          cat:'animation', price:299000, sales:830,  rating:4.8 },
  { id:'p3', emoji:'💎', name:'Neon Icon Set 3000+',     cat:'icon',      price:149000, sales:2100, rating:4.9 },
  { id:'p4', emoji:'🤖', name:'Cyber UI Kit 2025',       cat:'template',  price:650000, sales:650,  rating:4.7 },
  { id:'p5', emoji:'✍️', name:'Farsi Font Bundle',       cat:'font',      price:220000, sales:1800, rating:4.9 },
  { id:'p6', emoji:'🎯', name:'3D Object Library',       cat:'3d',        price:799000, sales:290,  rating:4.7 },
]
const MOCK_ARTICLES = [
  { id:'a1', emoji:'🌐', title:'آینده UI/UX در ۲۰۲۵',  author:'آریان مهدوی', cat:'design', views:4820, likes:342 },
  { id:'a2', emoji:'⚛️', title:'راهنمای React 19',      author:'سارا کریمی',  cat:'dev',    views:7130, likes:521 },
  { id:'a3', emoji:'🤖', title:'AI و شغل طراحی',        author:'آریان مهدوی', cat:'ai',     views:9870, likes:743 },
  { id:'a4', emoji:'📐', title:'CSS Grid vs Flexbox',    author:'علی رضایی',  cat:'dev',    views:6120, likes:456 },
]
const CHART = [
  {day:'ش',v:72},{day:'ی',v:45},{day:'د',v:88},{day:'س',v:60},{day:'چ',v:95},{day:'پ',v:55},{day:'ج',v:78},
]

export default function AdminPage({ user, profile, authLoading }) {
  const router = useRouter()
  const [tab,   setTab]   = useState('overview')
  const [users, setUsers] = useState([])
  const [busy,  setBusy]  = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/login?from=/admin'); return }
    if (profile && profile.role !== 'admin') { router.push('/'); return }
  }, [authLoading, user, profile])

  useEffect(() => {
    if (tab === 'users' && user && profile?.role === 'admin') fetchUsers()
  }, [tab])

  const fetchUsers = async () => {
    setBusy(true)
    const { data, error } = await getAllProfiles()
    if (error) toast('❌ خطا در بارگذاری کاربران', 'err')
    else setUsers(data)
    setBusy(false)
  }

  if (authLoading || !user || !profile) return <LoadingScreen />
  if (profile.role !== 'admin') return null

  const totalRevenue = MOCK_PRODUCTS.reduce((s,p) => s + p.price * p.sales, 0)

  const STATS = [
    { icon:'💰', label:'TOTAL REVENUE',  val: (totalRevenue/1000000).toFixed(1) + ' م ت', color:'var(--neon)' },
    { icon:'📦', label:'ORDERS',         val:'48',           color:'var(--sky)'  },
    { icon:'👥', label:'USERS',          val: users.length || '...', color:'var(--hot)' },
    { icon:'🛍️', label:'PRODUCTS',       val:'8',            color:'var(--gold)' },
    { icon:'📰', label:'ARTICLES',       val:'6',            color:'#CC88FF'     },
    { icon:'👁',  label:'TODAY VISITS',   val:'۱,۲۴۷',        color:'#FF6B00'     },
  ]

  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'calc(100vh - 60px)' }}>

        {/* sidebar */}
        <div style={{ background:'var(--ink2)', borderLeft:'1px solid var(--rim)', padding:'20px 12px' }}>
          <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--muted)', letterSpacing:2, padding:'6px 12px', marginBottom:8 }}>
            ADMIN PANEL
          </div>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display:'flex', alignItems:'center', gap:8, width:'100%',
              padding:'10px 14px', borderRadius:9,
              border:'none', borderRight: tab===t.id ? '2px solid var(--neon)' : '2px solid transparent',
              background: tab===t.id ? 'rgba(0,255,180,0.07)' : 'transparent',
              color: tab===t.id ? 'var(--neon)' : 'var(--dim)',
              fontFamily:'var(--font)', fontSize:13, fontWeight:500,
              transition:'all 0.2s', textAlign:'right',
            }}>
              {t.label}
            </button>
          ))}

          <div style={{ marginTop:'auto', paddingTop:24, borderTop:'1px solid var(--rim)', marginTop:24 }}>
            <div style={{ padding:'10px 14px', fontSize:12, fontFamily:'var(--mono)', color:'var(--muted)' }}>
              <div style={{ color:'var(--gold)', fontSize:14, marginBottom:4 }}>
                👑 {profile.full_name || profile.username}
              </div>
              <div>ادمین سیستم</div>
            </div>
          </div>
        </div>

        {/* main */}
        <div style={{ padding:28, overflowY:'auto' }}>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="anim-up">
              <div className="t-display" style={{ fontSize:22, marginBottom:20 }}>📊 نمای کلی</div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:14, marginBottom:28 }}>
                {STATS.map(s => (
                  <div key={s.label} className="card" style={{ padding:20, display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, background:`${s.color}18`, flexShrink:0 }}>{s.icon}</div>
                    <div>
                      <div className="t-display" style={{ fontSize:20, color:s.color }}>{s.val}</div>
                      <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--muted)', letterSpacing:1, marginTop:2 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* bar chart */}
              <div className="card" style={{ padding:20, marginBottom:24 }}>
                <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--dim)', letterSpacing:1, marginBottom:16 }}>
                  // WEEKLY REVENUE (نمایشی)
                </div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120 }}>
                  {CHART.map((d,i) => (
                    <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, height:'100%', justifyContent:'flex-end' }}>
                      <div style={{ width:'100%', borderRadius:'4px 4px 0 0', background:'linear-gradient(180deg,var(--neon),rgba(0,255,180,0.25))', height:`${d.v}%`, minHeight:4 }} />
                      <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--muted)' }}>{d.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize:13, fontFamily:'var(--mono)', color:'var(--muted)', textAlign:'center', padding:16 }}>
                برای دیدن کاربران واقعی از Supabase، تب کاربران را انتخاب کنید
              </div>
            </div>
          )}

          {/* ── USERS (از Supabase) ── */}
          {tab === 'users' && (
            <div className="anim-up">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div className="t-display" style={{ fontSize:22 }}>👥 کاربران</div>
                <button className="btn btn-neon btn-sm" onClick={fetchUsers} disabled={busy}>
                  {busy ? '...' : '🔄 بارگذاری مجدد'}
                </button>
              </div>

              {busy ? (
                <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
                  <div className="spinner" />
                </div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>نام</th>
                        <th>یوزرنیم</th>
                        <th>ایمیل</th>
                        <th>تلفن</th>
                        <th>نقش</th>
                        <th>آدرس</th>
                        <th>تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td style={{ fontWeight:600 }}>{u.full_name || '—'}</td>
                          <td style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--sky)' }}>
                            @{u.username}
                          </td>
                          <td style={{ fontFamily:'var(--mono)', fontSize:12, direction:'ltr' }}>
                            {u.email}
                          </td>
                          <td style={{ fontFamily:'var(--mono)', fontSize:12 }}>
                            {u.phone || '—'}
                          </td>
                          <td>
                            <span className={`badge ${u.role==='admin'?'badge-gold':'badge-sky'}`}>
                              {u.role === 'admin' ? '👑 ADMIN' : 'USER'}
                            </span>
                          </td>
                          <td style={{ fontSize:12, color:'var(--dim)', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {u.address || '—'}
                          </td>
                          <td style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)' }}>
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('fa-IR') : '—'}
                          </td>
                        </tr>
                      ))}
                      {!users.length && (
                        <tr>
                          <td colSpan={7} style={{ textAlign:'center', padding:40, color:'var(--muted)', fontFamily:'var(--mono)', fontSize:12 }}>
                            // NO USERS FOUND IN DATABASE
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div style={{ marginTop:12, fontSize:12, fontFamily:'var(--mono)', color:'var(--muted)' }}>
                    {users.length} کاربر در دیتابیس
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === 'products' && (
            <div className="anim-up">
              <div className="t-display" style={{ fontSize:22, marginBottom:20 }}>🛍️ محصولات</div>
              <table className="data-table">
                <thead><tr><th>محصول</th><th>دسته</th><th>قیمت</th><th>فروش</th><th>امتیاز</th></tr></thead>
                <tbody>
                  {MOCK_PRODUCTS.map(p => (
                    <tr key={p.id}>
                      <td>{p.emoji} {p.name}</td>
                      <td><span className="badge badge-sky">{p.cat.toUpperCase()}</span></td>
                      <td style={{ color:'var(--neon)', fontFamily:'var(--mono)', fontSize:13 }}>{p.price.toLocaleString('fa-IR')} ت</td>
                      <td style={{ fontFamily:'var(--mono)' }}>{p.sales.toLocaleString('fa-IR')}</td>
                      <td>⭐ {p.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── ARTICLES ── */}
          {tab === 'articles' && (
            <div className="anim-up">
              <div className="t-display" style={{ fontSize:22, marginBottom:20 }}>📰 مقالات</div>
              <table className="data-table">
                <thead><tr><th>عنوان</th><th>نویسنده</th><th>دسته</th><th>بازدید</th><th>لایک</th></tr></thead>
                <tbody>
                  {MOCK_ARTICLES.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight:600 }}>{a.emoji} {a.title}</td>
                      <td>{a.author}</td>
                      <td><span className="badge badge-neon">{a.cat.toUpperCase()}</span></td>
                      <td style={{ fontFamily:'var(--mono)' }}>{a.views.toLocaleString('fa-IR')}</td>
                      <td>❤️ {a.likes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
