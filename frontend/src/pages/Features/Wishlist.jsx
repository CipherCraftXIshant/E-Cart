import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/ProductCard';

export default function Wishlist({ navigate }) {
  const { wishlist } = useApp();

  if (wishlist.length === 0) return (
    <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🤍</div>
        <h2 style={{ fontSize: '1.9rem', color: 'var(--charcoal)', marginBottom: 12 }}>Your wishlist is empty</h2>
        <p style={{ color: 'var(--gray-mid)', marginBottom: 28, fontSize: 15 }}>Save items you love and revisit them anytime.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Explore Products →</button>
      </div>
    </main>
  );

  return (
    <main style={{ padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--charcoal)', marginBottom: 8 }}>My Wishlist ❤️</h1>
        <p style={{ color: 'var(--gray-mid)', marginBottom: 36 }}>{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }} className="grid-4">
          {wishlist.map(p => <ProductCard key={p.id} product={p} navigate={navigate} />)}
        </div>
      </div>
    </main>
  );
}