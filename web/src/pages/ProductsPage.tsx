import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'

type Product = {
  id: string;
  name: string;
  price_cents: number;
  metadata?: any;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})
  const apiBase = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    fetch(`${apiBase}/products`)
      .then(r => r.json())
      .then(data => setProducts(data || []))
      .catch(err => console.error('fetch products', err))
  }, [])

  function add(id: string) {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  function remove(id: string) {
    setCart(prev => {
      const copy = { ...prev }
      if (!copy[id]) return prev
      copy[id] = Math.max(0, copy[id] - 1)
      if (copy[id] === 0) delete copy[id]
      return copy
    })
  }

  async function checkout() {
    const items = Object.entries(cart).map(([id, qty]) => ({ id, quantity: qty }))
    if (items.length === 0) return alert('Cart empty')
    try {
      const resp = await fetch(`${apiBase}/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })
      const j = await resp.json()
      if (!resp.ok) return alert('Order failed: ' + JSON.stringify(j))
      const orderId = j.order_id
      alert('Order created: ' + orderId + '\nMarking paid via stub...')
      const pay = await fetch(`${apiBase}/orders/${orderId}/pay`, { method: 'POST' })
      const pj = await pay.json()
      if (!pay.ok) return alert('Pay failed: ' + JSON.stringify(pj))
      alert('Order paid successfully')
      setCart({})
    } catch (e) {
      console.error(e)
      alert('Checkout error: ' + String(e))
    }
  }

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const p = products.find(x => x.id === id)
    return { id, qty, name: p?.name || id, price_cents: p?.price_cents || 0 }
  })
  const total = cartItems.reduce((s, it) => s + it.qty * it.price_cents, 0)

  return (
    <div className="products-page">
      <section className="product-list">
        {products.map(p => (
          <ProductCard key={p.id} product={p} onAdd={() => add(p.id)} />
        ))}
      </section>

      <aside className="cart">
        <h3>Cart</h3>
        {cartItems.length === 0 ? <p>Cart is empty</p> : (
          <ul>
            {cartItems.map(it => (
              <li key={it.id}>{it.name} x {it.qty} — ¥{(it.price_cents/100).toFixed(2)} <button onClick={() => remove(it.id)}>−</button></li>
            ))}
          </ul>
        )}
        <div className="total">Total: ¥{(total/100).toFixed(2)}</div>
        <button onClick={checkout} disabled={cartItems.length===0}>Checkout</button>
      </aside>
    </div>
  )
}
