import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, allProducts } from '../data/products';

const NAV_LINKS = [
  { label: 'Home', route: '/' },
  { label: 'Groceries', route: '/groceries' },
  { label: 'Footwear', route: '/footwear' },
  { label: 'Clothes', route: '/clothes' },
  { label: 'Electronics', route: '/electronics' },
  { label: 'Beauty', route: '/beauty' },
  { label: 'Home Essentials', route: '/home' },
  { label: 'About', route: '/about' },
  { label: 'Contact', route: '/contact' },
];

export default function Navbar({ navigate, currentRoute }) {
  const { user, logout, cartCount } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const accRef = useRef(null);
  const searchRef = useRef(null);

  // Update suggestions
  useEffect(() => {
    const q = searchVal.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }
    const matches = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    ).slice(0, 5);
    setSuggestions(matches);
  }, [searchVal]);

  // Shadow on scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdown on outside click (NOT on scroll)
  useEffect(() => {
    const fn = (e) => {
      if (accRef.current && !accRef.current.contains(e.target)) setAccOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSuggestions([]);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const go = (route) => { navigate(route); setMobOpen(false); setAccOpen(false); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) { navigate('search', { query: searchVal.trim() }); setSearchVal(''); setMobOpen(false); }
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 500, background: '#fff',
      boxShadow: scrolled ? '0 2px 24px rgba(31,41,55,.10)' : '0 1px 0 rgba(0,0,0,.06)',
      transition: 'box-shadow .3s',
    }}>
      {/* ── Main row ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Logo */}
        <div onClick={() => go('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0, transition: 'transform .25s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ width: 40, height: 40, background: 'var(--saffron)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 12px rgba(249,115,22,.3)' }}>🛒</div>
          <span style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 22, color: 'var(--ch)' }}>e-<span style={{ color: 'var(--saffron)' }}>cart</span></span>
        </div>

        {/* Search bar (desktop) */}
        <div ref={searchRef} style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
          <form onSubmit={handleSearch} className="nav-search"
            style={{ display: 'flex', alignItems: 'center', background: 'var(--saffron-p)', border: '1.5px solid var(--saffron-l)', borderRadius: 50, padding: '8px 16px', gap: 8, transition: 'border-color .25s, box-shadow .25s' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--saffron)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,.12)'; if (searchVal) setSuggestions(allProducts.filter(p => p.name.toLowerCase().includes(searchVal.trim().toLowerCase())).slice(0, 5)); }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--saffron-l)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <span style={{ color: '#9ca3af' }}>🔍</span>
            <input value={searchVal} onChange={e => { setSearchVal(e.target.value); }}
              placeholder="Search groceries, footwear, clothes…"
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, color: 'var(--ch)', minWidth: 0 }} />
            {searchVal && <button type="submit" style={{ background: 'var(--saffron)', color: '#fff', border: 'none', borderRadius: 50, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Go</button>}
          </form>

          {/* Search Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(31,41,55,.15)', overflow: 'hidden', zIndex: 600, border: '1px solid rgba(249,115,22,.1)' }}>
              {suggestions.map(s => (
                <div key={s.id} onClick={() => { navigate('product', { product: s }); setSuggestions([]); setSearchVal(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--gl)', transition: 'background .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--saffron-p)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <img src={s.img} alt={s.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--gl)' }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ch)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 320 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gm)' }}>{s.brand} • {s.cat}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>

          {/* Account dropdown */}
          <div ref={accRef} style={{ position: 'relative' }}>
            <button onClick={() => setAccOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: accOpen ? 'var(--saffron-p)' : 'none', border: '1.5px solid var(--saffron-l)', borderRadius: 50, padding: '7px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--ch)', transition: 'var(--tr)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--saffron-p)'; e.currentTarget.style.borderColor = 'var(--saffron)'; }}
              onMouseLeave={e => { if (!accOpen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'var(--saffron-l)'; } }}>
              👤 {user ? user.name.split(' ')[0] : 'Account'} <span style={{ fontSize: 9, opacity: .6 }}>▾</span>
            </button>

            {accOpen && (
              <div className="asd" style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(31,41,55,.15)', overflow: 'hidden', minWidth: 180, zIndex: 600, border: '1px solid rgba(249,115,22,.1)' }}>
                {user ? (
                  <>
                    <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--gl)', fontSize: 13 }}>
                      <div style={{ fontWeight: 700 }}>{user.name}</div>
                      <div style={{ color: 'var(--gm)', fontSize: 12 }}>{user.email}</div>
                    </div>
                    {[['🧾 My Orders', '/orders'], ['❤️ Wishlist', '/wishlist'], ['⚙️ Profile', '/profile']].map(([l, r]) => (
                      <button key={l} onClick={() => go(r)} style={dropItemSt}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--saffron-p)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>{l}</button>
                    ))}
                    <button onClick={() => { logout(); setAccOpen(false); }} style={{ ...dropItemSt, color: 'var(--err)', borderTop: '1px solid var(--gl)' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>🚪 Logout</button>
                  </>
                ) : (
                  <>
                    <div style={{ padding: '10px 18px 6px', fontSize: 13, color: 'var(--gm)', fontWeight: 500 }}>Welcome! Sign in to continue</div>
                    {[['🔑 Login', '/login'], ['✨ Sign Up', '/signup']].map(([l, r]) => (
                      <button key={l} onClick={() => go(r)} style={dropItemSt}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--saffron-p)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>{l}</button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart icon */}
          <button onClick={() => go('/cart')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6, transition: 'transform .2s', fontSize: 24 }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            🛍️
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--saffron)', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button onClick={() => setMobOpen(o => !o)} className="hamburger"
            style={{ background: 'none', border: '1.5px solid var(--saffron-l)', borderRadius: 8, fontSize: 18, cursor: 'pointer', padding: '5px 8px', color: 'var(--ch)', display: 'none' }}>
            {mobOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── Desktop nav links ── */}
      <nav className="desktop-nav" style={{ borderTop: '1px solid rgba(0,0,0,.05)', display: 'flex', justifyContent: 'center', gap: 4, background: '#fff', padding: '0 24px', overflowX: 'auto' }}>
        {NAV_LINKS.map(({ label, route }) => (
          <button key={label} onClick={() => go(route)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '9px 12px', fontSize: 13.5, fontWeight: 500, color: currentRoute === route ? 'var(--saffron)' : 'var(--ch)', fontFamily: 'var(--fb)', whiteSpace: 'nowrap', position: 'relative', transition: 'color .2s', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--saffron)'}
            onMouseLeave={e => e.currentTarget.style.color = currentRoute === route ? 'var(--saffron)' : 'var(--ch)'}>
            {label}
            {currentRoute === route && <span style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2, background: 'var(--saffron)', borderRadius: 1 }} />}
          </button>
        ))}
      </nav>

      {/* ── Mobile menu ── */}
      {mobOpen && (
        <div className="asd" style={{ borderTop: '1px solid var(--saffron-l)', background: '#fff', padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'var(--saffron-p)', border: '1.5px solid var(--saffron-l)', borderRadius: 50, padding: '8px 14px', gap: 8, marginBottom: 12 }}>
            <span style={{ color: '#9ca3af' }}>🔍</span>
            <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search…" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, color: 'var(--ch)' }} />
          </form>
          {NAV_LINKS.map(({ label, route }) => (
            <button key={label} onClick={() => go(route)}
              style={{ background: 'none', border: 'none', padding: '11px 0', textAlign: 'left', fontSize: 15, fontWeight: 500, color: currentRoute === route ? 'var(--saffron)' : 'var(--ch)', cursor: 'pointer', borderBottom: '1px solid var(--gl)', fontFamily: 'var(--fb)' }}>
              {label}
            </button>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            {user
              ? <button onClick={() => { logout(); setMobOpen(false); }} className="btn-o" style={{ flex: 1 }}>Logout</button>
              : <>
                <button onClick={() => go('/login')} className="btn-p" style={{ flex: 1, justifyContent: 'center' }}>Login</button>
                <button onClick={() => go('/signup')} className="btn-o" style={{ flex: 1, justifyContent: 'center' }}>Sign Up</button>
              </>
            }
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hamburger    { display: flex !important; }
          .desktop-nav  { display: none !important; }
          .nav-search   { display: none !important; }
        }
      `}</style>
    </header>
  );
}

const dropItemSt = {
  display: 'block', width: '100%', padding: '11px 18px', fontSize: 14, fontWeight: 500,
  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ch)',
  textAlign: 'left', transition: 'background .2s', fontFamily: 'var(--fb)',
};