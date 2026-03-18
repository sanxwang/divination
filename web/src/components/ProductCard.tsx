import React from 'react'

export default function ProductCard({ product, onAdd }: any) {
  return (
    <div className="product-card">
      <div className="thumb">{product.metadata?.image ? <img src={product.metadata.image} alt={product.name} /> : null}</div>
      <div className="body">
        <h4>{product.name}</h4>
        <div className="price">¥{(product.price_cents/100).toFixed(2)}</div>
        <button onClick={onAdd}>Add</button>
      </div>
    </div>
  )
}
