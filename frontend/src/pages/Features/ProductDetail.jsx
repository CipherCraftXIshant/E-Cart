import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { allProducts } from '../../data/products';
import ProductCard from '../../components/ProductCard';

export default function ProductDetail({ product, navigate }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');
  const wishlisted = isWishlisted(product.id);

  const related = allProducts.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4);
  const pct = Math.round(((product.old - product.price) / product.old) * 100);

  return (
    <main style={{ padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'var(--gray-mid)' }}>
          <span style={{ cursor: 'pointer', color: 'var(--saffron)' }} onClick={() => navigate('/')}>Home</span>
          <span>›</span>
          <span style={{ cursor: 'pointer', color: 'var(--saffron)' }} onClick={() => navigate(`/${product.cat}`)}>
            {product.cat.charAt(0).toUpperCase() + product.cat.slice(1)}
          </span>
          <span>›</span>
          <span style={{ color: 'var(--charcoal)', fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* Main product */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginBottom: 64 }} className="product-detail-grid">
          {/* Image */}
          <div>
            <div style={{
              borderRadius: 20, overflow: 'hidden', aspectRatio: '1',
              boxShadow: 'var(--shadow-dark)', position: 'relative',
            }}>
              <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {!product.inStock && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ background: 'var(--charcoal)', color: 'white', padding: '10px 28px', borderRadius: 10, fontSize: 16, fontWeight: 700 }}>Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--saffron)', background: 'var(--saffron-pale)', padding: '4px 12px', borderRadius: 50 }}>{product.brand}</span>
              {product.badge && (
                <span style={{ fontSize: 12, fontWeight: 700, color: 'white', background: 'var(--charcoal)', padding: '4px 12px', borderRadius: 50 }}>{product.badge}</span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--charcoal)', marginBottom: 14, lineHeight: 1.25 }}>{product.name}</h1>

            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ color: '#f59e0b', fontSize: 18, letterSpacing: 2 }}>
                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span style={{ fontWeight: 700, color: 'var(--charcoal)' }}>{product.rating}</span>
              <span style={{ color: 'var(--gray-mid)', fontSize: 14 }}>({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, background: 'var(--saffron-pale)', padding: '16px 20px', borderRadius: 14, border: '1px solid var(--saffron-light)' }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--charcoal)', fontFamily: 'var(--font-display)' }}>₹{product.price.toLocaleString()}</span>
              <div>
                <div style={{ fontSize: 16, color: 'var(--gray-mid)', textDecoration: 'line-through' }}>₹{product.old.toLocaleString()}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>You save ₹{(product.old - product.price).toLocaleString()} ({pct}%)</div>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: 15, color: 'var(--charcoal-light)', lineHeight: 1.7, marginBottom: 28 }}>{product.desc}</p>

            {/* Qty + Add */}
            {product.inStock ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '2px solid var(--saffron-light)', borderRadius: 50, overflow: 'hidden' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                      width: 38, height: 38, background: 'none', border: 'none',
                      fontSize: 18, cursor: 'pointer', color: 'var(--saffron)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>−</button>
                    <span style={{ padding: '0 14px', fontSize: 16, fontWeight: 700, color: 'var(--charcoal)', minWidth: 36, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} style={{
                      width: 38, height: 38, background: 'none', border: 'none',
                      fontSize: 18, cursor: 'pointer', color: 'var(--saffron)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>+</button>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>✓ In Stock</span>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button
                    onClick={() => addToCart(product, qty)}
                    style={{
                      flex: 1, padding: '16px', background: 'var(--saffron-p)', color: 'var(--saffron)',
                      border: '1px solid var(--saffron-l)', borderRadius: '8px', fontSize: 16, fontWeight: 600,
                      cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                      transition: 'all 0.2s ease', fontFamily: 'var(--font-body)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--saffron)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--saffron-p)'; e.currentTarget.style.color = 'var(--saffron)'; }}
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    style={{
                      background: 'none', border: 'none', color: wishlisted ? '#dc2626' : '#d1d5db',
                      fontSize: 24, cursor: 'pointer', transition: 'transform 0.2s, color 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; if (!wishlisted) e.currentTarget.style.color = '#9ca3af'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; if (!wishlisted) e.currentTarget.style.color = '#d1d5db'; }}
                  >
                    {wishlisted ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '14px 20px', background: '#fef2f2', borderRadius: 12, border: '1px solid #fca5a5', color: '#dc2626', fontWeight: 600 }}>
                ⚠️ Out of stock — check back soon!
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
              {[['🚀', 'Fast Delivery'], ['🔒', 'Secure Payment'], ['↩️', 'Easy Returns'], ['✅', 'Verified Product']].map(([ico, lbl]) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-mid)', fontWeight: 500 }}>
                  <span>{ico}</span>{lbl}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '2px solid var(--gray-light)', marginBottom: 32, display: 'flex', gap: 0 }}>
          {['desc', 'reviews', 'shipping'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '12px 28px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 600, color: tab === t ? 'var(--saffron)' : 'var(--gray-mid)',
              borderBottom: tab === t ? '3px solid var(--saffron)' : '3px solid transparent',
              fontFamily: 'var(--font-body)', transition: 'color 0.2s', marginBottom: -2,
            }}>
              {t === 'desc' ? 'Description' : t === 'reviews' ? 'Reviews' : 'Shipping'}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 64, padding: '20px 0' }}>
          {tab === 'desc' && (
            <p style={{ fontSize: 16, color: 'var(--charcoal-light)', lineHeight: 1.8, maxWidth: 700 }}>{product.desc} This product is carefully sourced and tested for quality. Suitable for daily use and comes with our quality guarantee.</p>
          )}
          {tab === 'reviews' && (
            <div style={{ display: 'grid', gap: 20 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ background: 'var(--saffron-pale)', borderRadius: 14, padding: '20px', border: '1px solid var(--saffron-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--saffron)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>U{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>Verified Buyer {i + 1}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-mid)' }}>Jan 2024</div>
                    </div>
                    <span style={{ color: '#f59e0b', marginLeft: 'auto' }}>★★★★★</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--charcoal-light)' }}>Great quality product! Exactly as described. Packaging was secure and delivery was prompt. Highly recommend.</p>
                </div>
              ))}
            </div>
          )}
          {tab === 'shipping' && (
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                ['🚀', 'Standard Delivery', '3-5 business days. Free above ₹499.'],
                ['⚡', 'Express Delivery', '1-2 business days. ₹99 flat charge.'],
                ['🏙️', 'Same-Day Delivery', 'Available in select metro cities for orders before 12 PM.'],
                ['↩️', 'Returns', '10-day no-questions-asked return policy.'],
              ].map(([ico, title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 20px', background: 'var(--saffron-pale)', borderRadius: 12, border: '1px solid var(--saffron-light)' }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{ico}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 14, color: 'var(--gray-mid)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 8 }}>Related Products</h2>
            <div className="section-line" style={{ margin: '0 0 32px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }} className="grid-4">
              {related.map(p => <ProductCard key={p.id} product={p} navigate={navigate} />)}
            </div>
          </>
        )}
      </div>

      <style>{`
        @media(max-width:768px){
          .product-detail-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
    </main>
  );
}