import ProductCard from '../components/ProductCard';
import { CATEGORIES, REVIEWS, getTrending, getByCategory } from '../data/products';

export default function Home({ navigate }) {
  const trending = getTrending();
  const doubled = [...REVIEWS, ...REVIEWS];

  return (
    <main>
      {/* Announcement Bar */}
      <div style={{ background: 'linear-gradient(90deg,#fed7aa,#fef3c7 50%,#fed7aa)', padding: '9px 16px', textAlign: 'center', borderBottom: '1px solid #fcd34d' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#92400e', letterSpacing: '.4px', animation: 'blink 2.5s ease-in-out infinite' }}>
          🌍 World's Most Trusted Shopping Platform &nbsp;•&nbsp; Free Delivery on Orders Above ₹499 🎁 &nbsp;•&nbsp; Use code ECART10 for 10% off
        </span>
      </div>

      {/* ── Hero ── */}
      <section style={{ padding: '80px 24px', background: 'radial-gradient(circle at 50% 120%,var(--saffron-p),#fff)' }}>
        <div className="hero-grid" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>

          {/* Hero Text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--saffron-p)', padding: '6px 14px', borderRadius: 50, color: 'var(--saffron)', fontSize: 13, fontWeight: 700, marginBottom: 24, border: '1px solid var(--saffron-l)' }}>
              <span>✨</span> Discover The Ultimate Shopping Experience
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'var(--ch)', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
              Shop Smarter,<br /><span style={{ color: 'var(--saffron)' }}>Live Better.</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--cl)', marginBottom: 40, lineHeight: 1.6, maxWidth: 480 }}>
              Explore thousands of premium products — from organic groceries to cutting-edge electronics. Delivered fast and fresh to your door.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
              <button className="btn-p" style={{ padding: '14px 28px', fontSize: 15 }} onClick={() => navigate('/groceries')}>Start Shopping →</button>
              <button className="btn-o" style={{ padding: '14px 28px', fontSize: 15, border: 'none', background: 'var(--saffron-p)' }} onClick={() => { document.getElementById('categories-section').scrollIntoView({ behavior: 'smooth' }); }}>Explore Categories</button>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[['50k+', 'Happy Customers'], ['10k+', 'Premium Products'], ['24/7', 'Customer Support']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--saffron)', fontFamily: 'var(--fd)' }}>{v}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div style={{ display: 'flex', justifyContent: 'center' }} className="hero-vis">
            <div style={{ width: 'clamp(260px,35vw,380px)', height: 'clamp(260px,35vw,380px)', borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%,rgba(249,115,22,.13),rgba(254,243,199,.5))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '2px dashed rgba(249,115,22,.18)', animation: 'float1 4s ease-in-out infinite' }}>
              <span style={{ fontSize: 90 }}>🛍️</span>
              {[{ top: '8%', left: '-5%', text: '30% OFF 🔥', d: '0s' }, { bottom: '12%', right: '-8%', text: 'Free Ship 🚀', d: '.7s' }, { top: '48%', left: '-16%', text: 'New Arrivals ✨', d: '1.2s' }].map((b, i) => (
                <div key={i} style={{ position: 'absolute', top: b.top, bottom: b.bottom, left: b.left, right: b.right, background: '#fff', border: '1px solid var(--saffron-l)', borderRadius: 12, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: 'var(--saffron)', boxShadow: 'var(--sh)', whiteSpace: 'nowrap', animation: `float${i % 2 + 1} ${3.5 + i}s ease-in-out infinite`, animationDelay: b.d }}>{b.text}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories-section" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 className="section-title">Shop by Categories</h2>
          <div className="section-line" />
          <p className="section-sub">Everything you need, all in one place</p>
          <div className="grid-6">
            {CATEGORIES.map(c => (
              <div key={c.key} onClick={() => navigate('/' + c.key)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: 'var(--sh)', border: '2px solid rgba(249,115,22,.08)', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-12px) scale(1.08)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(249,115,22,.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--sh)'; }}>
                  {c.icon}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ch)', textAlign: 'center' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Groceries ── */}
      <section style={{ padding: '80px 24px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Fresh Groceries 🌱</h2>
              <div className="section-line" style={{ margin: '16px 0 0' }} />
            </div>
            <button className="btn-outline" style={{ border: 'none', color: 'var(--saffron)' }} onClick={() => navigate('/groceries')}>View All →</button>
          </div>
          <div className="grid-4">
            {getByCategory('groceries').slice(0, 4).map(p => <ProductCard key={p.id} product={p} navigate={navigate} />)}
          </div>
        </div>
      </section>

      {/* ── Featured Electronics ── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Top Electronics 💻</h2>
              <div className="section-line" style={{ margin: '16px 0 0' }} />
            </div>
            <button className="btn-outline" style={{ border: 'none', color: 'var(--saffron)' }} onClick={() => navigate('/electronics')}>View All →</button>
          </div>
          <div className="grid-4">
            {getByCategory('electronics').slice(0, 4).map(p => <ProductCard key={p.id} product={p} navigate={navigate} />)}
          </div>
        </div>
      </section>

      {/* ── Trending ── */}
      <section style={{ padding: '80px 24px', background: 'var(--beige)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 className="section-title">Trending Items</h2>
          <div className="section-line" />
          <p className="section-sub">What everyone's buying right now</p>
          <div className="grid-4">
            {trending.map(p => <ProductCard key={p.id} product={p} navigate={navigate} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="btn-p" onClick={() => navigate('/groceries')}>View All Products →</button>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section style={{ padding: '80px 0', background: '#fff', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <h2 className="section-title">Voices of Our Valued Customers</h2>
          <div className="section-line" />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, margin: '24px 0 36px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Excellent</span>
            <span style={{ color: '#f59e0b', fontSize: 20 }}>★★★★★</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>4.9</span>
            <span style={{ color: 'var(--gm)', fontSize: 14 }}>| 239 reviews</span>
            <button className="btn-p" style={{ padding: '9px 20px', fontSize: 13 }}>✏️ Write a Review</button>
          </div>
        </div>
        <div style={{ overflow: 'hidden', padding: '4px 0' }}>
          <div style={{ display: 'flex', gap: 20, animation: 'scrollX 28s linear infinite', width: 'max-content' }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}>
            {doubled.map((r, i) => (
              <div key={i} style={{ minWidth: 300, maxWidth: 300, background: 'var(--saffron-p)', borderRadius: 16, padding: '20px', border: '1px solid var(--saffron-l)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: r.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gm)' }}>{r.date}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#f59e0b', fontSize: 15 }}>★★★★★</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--cl)', lineHeight: 1.6 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 24px', background: 'var(--beige)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 className="section-title">Why Choose e-cart?</h2>
          <div className="section-line" />
          <p className="section-sub">Built for you, by people who care</p>
          <div className="grid-5">
            {[['🌿', 'Sustainable Products', 'Eco-friendly sourced'], ['⚡', 'Fast Delivery', 'Same day in metro cities'], ['🔒', 'Secure Payments', '256-bit SSL encrypted'], ['🕐', '24/7 Support', 'Always here for you'], ['↩️', 'Easy Returns', '10-day hassle-free']].map(([ico, lbl, desc]) => (
              <div key={lbl} style={{ background: '#fff', borderRadius: 20, padding: '32px 20px', textAlign: 'center', boxShadow: 'var(--sh)', border: '1px solid rgba(249,115,22,.07)', transition: 'transform .3s, box-shadow .3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-7px)'; e.currentTarget.style.boxShadow = 'var(--shh)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--sh)'; }}>
                <div style={{ fontSize: 38, marginBottom: 14, animation: 'float1 4s ease-in-out infinite' }}>{ico}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ch)', marginBottom: 6 }}>{lbl}</div>
                <div style={{ fontSize: 12, color: 'var(--gm)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float1  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float2  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(4deg)} }
        @keyframes blink   { 0%,100%{opacity:1;text-shadow:0 0 8px rgba(249,115,22,.5)} 50%{opacity:.75;text-shadow:0 0 22px rgba(249,115,22,1)} }
        @keyframes scrollX { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @media(max-width:768px){ .hero-grid{grid-template-columns:1fr!important;} .hero-vis{display:none!important;} }
      `}</style>
    </main>
  );
}