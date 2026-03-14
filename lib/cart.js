// ── Cart Manager (localStorage) ────────────────────────────────
const KEY = 'nexus_cart'

export function getCart() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch { return [] }
}

export function saveCart(cart) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(cart))
}

export function addToCart(product) {
  const cart = getCart()
  const existing = cart.find(i => i.id === product.id)
  if (existing) {
    existing.qty += 1
  } else {
    cart.push({ ...product, qty: 1 })
  }
  saveCart(cart)
  // event برای آپدیت navbar badge
  window.dispatchEvent(new Event('cartUpdated'))
  return cart
}

export function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId)
  saveCart(cart)
  window.dispatchEvent(new Event('cartUpdated'))
  return cart
}

export function updateQty(productId, qty) {
  if (qty < 1) return removeFromCart(productId)
  const cart = getCart().map(i => i.id === productId ? { ...i, qty } : i)
  saveCart(cart)
  window.dispatchEvent(new Event('cartUpdated'))
  return cart
}

export function clearCart() {
  saveCart([])
  window.dispatchEvent(new Event('cartUpdated'))
}

export function getCartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0)
}

export function getCartTotal() {
  return getCart().reduce((s, i) => s + i.price * i.qty, 0)
}
