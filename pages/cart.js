import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar } from '../components/UI'
import { getCart, removeFromCart, updateQty, getCartTotal, clearCart } from '../lib/cart'

export default function CartPage({ user, profile }) {
  const router  = useRouter()
  const [cart, setCart] = useState([])

  useEffect(() => {
    setCart(getCart())
    window.addEventListener('cartUpdated', () => setCart(getCart()))
    return () => window.removeEventListener('cartUpdated', () => {})
  }, [])

  const total    = getCartTotal()
  const discount = Math.round(total * 0.05) // ۵٪ تخفیف نمایشی

  const handleRemove = id => {
    removeFromCart(id)
    setCart(getCart())
  }
  const handleQty = (id, qty) => {
    updateQty(id, qty)
    setCart(getCart())
  }

  if (!cart.length) return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />
      <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:32 }}>
        <div style={{ fontSize:72 }}>🛒</div>
        <div style={{ fontFamily:'var(--display)', fontSize:24, fontWeight:800 }}>سبد خرید خالی است</div>
        <div style={{ color:'var(--dim)', fontSize:14 }}>برو یه چیز باحال انتخاب کن!</div>
        <Link href="/shop" className="btn btn-neon btn-lg">رفتن به فروشگاه →</Link>
      </div>
    </div>
  )

  return (
    <div className="page-wrap">
      <Navbar user={user} profile={profile} />

      <div style={{ padding:'28px 28px 0' }}>
        <div style={{ fontFamily:'var(--display)', fontSize:26, fontWeight:800 }}>🛒 سبد خرید</div>
        <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--muted)', marginTop:4 }}>{cart.length} محصول</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, padding:'20px 28px', maxWidth:1100, margin:'0 auto' }}>

        {/* لیست محصولات */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {cart.map(item => (
            <div key={item.id} className="card" style={{ padding:20, display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:72, height:72, fontSize:40, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--ink3)', borderRadius:12, flexShrink:0 }}>
                {item.emoji}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>{item.name}</div>
                <div style={{ fontFamily:'var(--display)', fontSize:18, color:'var(--neon)', fontWeight:800 }}>
                  {item.price.toLocaleString('fa-IR')} ت
                </div>
              </div>
              {/* تعداد */}
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <button onClick={() => handleQty(item.id, item.qty-1)}
                  style={{ width:32, height:32, borderRadius:8, background:'var(--ink3)', border:'1px solid var(--rim)', color:'var(--text)', fontSize:18, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                <span style={{ fontFamily:'var(--mono)', fontSize:16, fontWeight:700, minWidth:24, textAlign:'center' }}>{item.qty}</span>
                <button onClick={() => handleQty(item.id, item.qty+1)}
                  style={{ width:32, height:32, borderRadius:8, background:'var(--ink3)', border:'1px solid var(--rim)', color:'var(--neon)', fontSize:18, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
              </div>
              {/* حذف */}
              <button onClick={() => handleRemove(item.id)}
                style={{ padding:'7px 14px', borderRadius:8, background:'rgba(255,0,100,0.08)', border:'1px solid rgba(255,0,100,0.2)', color:'var(--hot)', fontSize:12, fontFamily:'var(--font)', fontWeight:600 }}>
                حذف
              </button>
            </div>
          ))}

          <button onClick={() => { clearCart(); setCart([]) }}
            style={{ alignSelf:'flex-start', padding:'8px 16px', borderRadius:8, background:'transparent', border:'1px solid rgba(255,0,100,0.2)', color:'var(--hot)', fontSize:12, fontFamily:'var(--font)' }}>
            🗑️ پاک کردن سبد
          </button>
        </div>

        {/* خلاصه */}
        <div className="card" style={{ padding:24, height:'fit-content', position:'sticky', top:72 }}>
          <div style={{ fontFamily:'var(--display)', fontSize:18, fontWeight:800, marginBottom:20 }}>خلاصه سفارش</div>

          <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'var(--dim)', marginBottom:10 }}>
            <span>جمع محصولات</span>
            <span>{total.toLocaleString('fa-IR')} ت</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'var(--dim)', marginBottom:10 }}>
            <span>تخفیف ویژه</span>
            <span style={{ color:'var(--neon)' }}>− {discount.toLocaleString('fa-IR')} ت</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'var(--dim)', marginBottom:16, paddingBottom:16, borderBottom:'1px solid var(--rim)' }}>
            <span>هزینه ارسال</span>
            <span style={{ color:'var(--neon)' }}>رایگان 🎁</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--display)', fontSize:22, fontWeight:800 }}>
            <span>مجموع</span>
            <span style={{ color:'var(--neon)' }}>{(total-discount).toLocaleString('fa-IR')} ت</span>
          </div>

          <Link href="/checkout" style={{
            display:'block', width:'100%', padding:14, borderRadius:10, marginTop:20,
            background:'linear-gradient(135deg,var(--neon),var(--sky))',
            color:'var(--ink)', border:'none', fontWeight:800, fontSize:16,
            fontFamily:'var(--font)', textAlign:'center', textDecoration:'none',
            boxShadow:'0 8px 24px rgba(0,255,180,0.3)',
          }}>
            💳 ادامه و پرداخت →
          </Link>

          <Link href="/shop" style={{ display:'block', textAlign:'center', marginTop:14, fontSize:13, color:'var(--dim)', textDecoration:'none' }}>
            ← بازگشت به فروشگاه
          </Link>
        </div>

      </div>
    </div>
  )
}
