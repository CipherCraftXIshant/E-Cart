import { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { getByCategory, CATEGORIES, CAT_META } from '../data/products';

export default function CategoryPage({ categoryKey, navigate }) {
  const meta     = CAT_META[categoryKey] || CAT_META.groceries;
  const catObj   = CATEGORIES.find(c => c.key === categoryKey) || CATEGORIES[0];
  const products = getByCategory(categoryKey);

  const [sort,         setSort]         = useState('default');
  const [search,       setSearch]       = useState('');
  const [inStockOnly,  setInStockOnly]  = useState(false);
  const [minRating,    setMinRating]    = useState(0);
  const [maxPrice,     setMaxPrice]     = useState(Infinity);
  const [filOpen,      setFilOpen]      = useState(false);

  const displayed = useMemo(() => {
    let arr = [...products];
    if (search)          arr = arr.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (inStockOnly)     arr = arr.filter(p => p.inStock);
    if (minRating)       arr = arr.filter(p => p.rating >= minRating);
    if (maxPrice < Infinity) arr = arr.filter(p => p.price <= maxPrice);
    if (sort === 'price-asc')  arr.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') arr.sort((a,b) => b.price - a.price);
    if (sort === 'rating')     arr.sort((a,b) => b.rating - a.rating);
    if (sort === 'discount')   arr.sort((a,b) => (b.old - b.price) - (a.old - a.price));
    return arr;
  }, [products, sort, search, inStockOnly, minRating, maxPrice]);

  const clearFilters = () => { setSearch(''); setInStockOnly(false); setMinRating(0); setMaxPrice(Infinity); setSort('default'); };

  return (
    <main>
      {/* Banner */}
      <section style={{ background:`linear-gradient(135deg,${catObj.color} 0%,#fff 100%)`, padding:'56px 24px 40px', borderBottom:'1px solid rgba(249,115,22,.1)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontSize:13, color:'var(--gm)' }}>
            <span style={{ cursor:'pointer', color:'var(--saffron)' }} onClick={() => navigate('/')}>Home</span>
            <span>›</span>
            <span style={{ fontWeight:600, color:'var(--ch)' }}>{meta.title}</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
            <span style={{ fontSize:60 }}>{meta.banner}</span>
            <div>
              <h1 style={{ fontSize:'clamp(1.8rem,3.5vw,2.5rem)', color:'var(--ch)', marginBottom:8 }}>{meta.title}</h1>
              <p style={{ fontSize:15, color:'var(--gm)', maxWidth:520 }}>{meta.desc}</p>
              <div style={{ display:'flex', gap:16, marginTop:12, flexWrap:'wrap' }}>
                <span style={{ fontSize:13, color:'var(--gm)' }}>{products.length} Products Available</span>
                <span style={{ fontSize:13, color:'var(--ok)', fontWeight:600 }}>✓ Free Delivery above ₹499</span>
              </div>
            </div>
          </div>

          {/* Category quick-nav */}
          <div style={{ display:'flex', gap:8, marginTop:24, flexWrap:'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => navigate('/'+c.key)}
                style={{ padding:'6px 16px', borderRadius:50, fontSize:13, fontWeight:600, border:`2px solid ${c.key===categoryKey?'var(--saffron)':'var(--saffron-l)'}`, background:c.key===categoryKey?'var(--saffron)':'#fff', color:c.key===categoryKey?'#fff':'var(--ch)', cursor:'pointer', transition:'var(--tr)' }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div style={{ background:'#fff', borderBottom:'1px solid var(--gl)', padding:'14px 24px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          {/* Search */}
          <div style={{ flex:1, minWidth:160, maxWidth:280, display:'flex', alignItems:'center', background:'var(--saffron-p)', border:'1.5px solid var(--saffron-l)', borderRadius:50, padding:'7px 14px', gap:8 }}>
            <span style={{ color:'#9ca3af' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${meta.title.toLowerCase()}…`}
              style={{ border:'none', background:'transparent', fontSize:13, flex:1, color:'var(--ch)', minWidth:0 }} />
            {search && <span style={{ cursor:'pointer', fontSize:12, color:'var(--gm)' }} onClick={() => setSearch('')}>✕</span>}
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding:'8px 14px', borderRadius:50, border:'1.5px solid var(--saffron-l)', background:'#fff', fontSize:13, color:'var(--ch)', cursor:'pointer', outline:'none', fontFamily:'var(--fb)' }}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Best Discount</option>
          </select>

          {/* Filter toggle */}
          <button onClick={() => setFilOpen(o => !o)}
            style={{ padding:'8px 16px', borderRadius:50, border:`1.5px solid ${filOpen?'var(--saffron)':'var(--saffron-l)'}`, background:filOpen?'var(--saffron-p)':'#fff', fontSize:13, fontWeight:600, color:filOpen?'var(--saffron)':'var(--ch)', cursor:'pointer', transition:'var(--tr)' }}>
            ⚙️ Filters {filOpen ? '▴' : '▾'}
          </button>

          <span style={{ marginLeft:'auto', fontSize:13, color:'var(--gm)' }}>
            Showing <b>{displayed.length}</b> of {products.length}
          </span>
        </div>

        {/* Filter panel */}
        {filOpen && (
          <div className="asd" style={{ maxWidth:1280, margin:'12px auto 0', padding:'16px', background:'var(--saffron-p)', borderRadius:14, display:'flex', gap:20, flexWrap:'wrap', alignItems:'center', border:'1px solid var(--saffron-l)' }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, cursor:'pointer', fontWeight:500 }}>
              <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} style={{ accentColor:'var(--saffron)', width:15, height:15 }} />
              In Stock Only
            </label>
            <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, fontWeight:500, flexWrap:'wrap' }}>
              Min Rating:
              {[3, 4, 4.5].map(r => (
                <button key={r} onClick={() => setMinRating(v => v===r ? 0 : r)}
                  style={{ padding:'4px 12px', borderRadius:50, fontSize:13, fontWeight:600, cursor:'pointer', border:`1.5px solid ${minRating===r?'var(--saffron)':'var(--saffron-l)'}`, background:minRating===r?'var(--saffron)':'#fff', color:minRating===r?'#fff':'var(--ch)' }}>
                  ⭐ {r}+
                </button>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, fontWeight:500, flexWrap:'wrap' }}>
              Max Price:
              {[499, 999, 2499, 4999].map(p => (
                <button key={p} onClick={() => setMaxPrice(v => v===p ? Infinity : p)}
                  style={{ padding:'4px 12px', borderRadius:50, fontSize:13, fontWeight:600, cursor:'pointer', border:`1.5px solid ${maxPrice===p?'var(--saffron)':'var(--saffron-l)'}`, background:maxPrice===p?'var(--saffron)':'#fff', color:maxPrice===p?'#fff':'var(--ch)' }}>
                  ₹{p.toLocaleString()}
                </button>
              ))}
            </div>
            <button onClick={clearFilters} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--saffron)', fontWeight:600, fontSize:13, cursor:'pointer' }}>Clear All ✕</button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div style={{ padding:'40px 24px 80px', maxWidth:1280, margin:'0 auto' }}>
        {displayed.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 24px', color:'var(--gm)' }}>
            <div style={{ fontSize:60, marginBottom:16 }}>🔍</div>
            <h3 style={{ fontSize:'1.5rem', color:'var(--ch)', marginBottom:8 }}>No products found</h3>
            <p style={{ marginBottom:24 }}>Try adjusting your filters or search query.</p>
            <button className="btn-p" onClick={clearFilters}>Clear All Filters</button>
          </div>
        ) : (
          <div className="grid-4">
            {displayed.map(p => <ProductCard key={p.id} product={p} navigate={navigate} />)}
          </div>
        )}
      </div>
    </main>
  );
}