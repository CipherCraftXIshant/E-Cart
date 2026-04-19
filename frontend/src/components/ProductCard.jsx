import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product, navigate }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [hovered, setHovered] = useState(false);
  const wished  = isWishlisted(product.id);
  const pct     = Math.round(((product.old - product.price) / product.old) * 100);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 18, overflow: 'hidden',
        border: '1px solid rgba(0,0,0,.05)',
        boxShadow: hovered ? 'var(--shh)' : 'var(--sh)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        transition: 'all .3s ease', cursor: 'pointer', position: 'relative',
      }}
    >
      {/* Image */}
      <div
        style={{ position: 'relative', overflow: 'hidden', height: 210 }}
        onClick={() => navigate && navigate('product', { product })}
      >
        <img
          src={product.img}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform .5s',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />
        {/* Discount badge */}
        <span style={{ position:'absolute', top:10, right:10, background:'var(--saffron)', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:5 }}>
          {pct}% off
        </span>
        {/* Product badge */}
        {product.badge && (
          <span style={{ position:'absolute', top:10, left:10, background:'rgba(31,41,55,.8)', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:5 }}>
            {product.badge}
          </span>
        )}
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,.65)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ background:'var(--ch)', color:'#fff', padding:'6px 18px', borderRadius:8, fontSize:13, fontWeight:700 }}>Out of Stock</span>
          </div>
        )}
        {/* Hover action buttons */}
        {hovered && product.inStock && (
          <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8, animation:'fadeUp .2s ease' }}>
            <button
              onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
              style={{ background:'#fff', border:'none', borderRadius:50, padding:'6px 12px', fontSize:12, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(0,0,0,.15)', color: wished ? '#dc2626' : 'var(--ch)', whiteSpace:'nowrap' }}
            >
              {wished ? '❤️ Saved' : '🤍 Save'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); addToCart(product); }}
              style={{ background:'var(--saffron)', border:'none', borderRadius:50, padding:'6px 12px', fontSize:12, fontWeight:700, cursor:'pointer', color:'#fff', whiteSpace:'nowrap' }}
            >
              🛒 Add
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:'14px 16px' }} onClick={() => navigate && navigate('product', { product })}>
        <div style={{ fontSize:11, color:'var(--saffron)', fontWeight:600, marginBottom:4 }}>{product.brand}</div>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--ch)', lineHeight:1.4, marginBottom:8, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {product.name}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
          <span style={{ color:'#f59e0b', fontSize:12, letterSpacing:1 }}>
            {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          </span>
          <span style={{ fontSize:12, color:'var(--gm)' }}>{product.rating} ({product.reviews})</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontSize:17, fontWeight:700 }}>₹{product.price.toLocaleString()}</span>
          <span style={{ fontSize:13, color:'#9ca3af', textDecoration:'line-through' }}>₹{product.old.toLocaleString()}</span>
        </div>
        {product.inStock && (
          <button
            onClick={e => { e.stopPropagation(); addToCart(product); }}
            style={{ width:'100%', marginTop:10, padding:'9px', background:'var(--saffron-p)', border:'1.5px solid var(--saffron-l)', borderRadius:10, fontSize:13, fontWeight:600, color:'var(--saffron)', cursor:'pointer', transition:'var(--tr)', fontFamily:'var(--fb)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--saffron)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--saffron-p)'; e.currentTarget.style.color = 'var(--saffron)'; }}
          >
            + Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}