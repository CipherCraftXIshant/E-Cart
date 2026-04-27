import { useState, useEffect } from 'react';
import { API_URL } from '../../context/AppContext';
import ProductCard from '../../components/ProductCard';

export default function SearchResults({ query, navigate }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = (query || '').trim();
    if (!q) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    fetch(`${API_URL}/products?search=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setLoading(false);
      });
  }, [query]);

  return (
    <main style={{ padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: 'var(--gray-mid)' }}>
          <span style={{ cursor: 'pointer', color: 'var(--saffron)' }} onClick={() => navigate('/')}>Home</span>
          <span>›</span>
          <span style={{ color: 'var(--charcoal)', fontWeight: 600 }}>Search Results</span>
        </div>

        <h1 style={{ fontSize: '1.9rem', color: 'var(--charcoal)', marginBottom: 6 }}>
          Results for "<span style={{ color: 'var(--saffron)' }}>{query}</span>"
        </h1>
        <p style={{ color: 'var(--gray-mid)', marginBottom: 36 }}>{results.length} product{results.length !== 1 ? 's' : ''} found</p>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--gray-mid)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--charcoal)', marginBottom: 12 }}>No results found</h2>
            <p style={{ marginBottom: 24 }}>Try different keywords or browse by category.</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Browse Categories →</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }} className="grid-4">
            {results.map(p => <ProductCard key={p.id} product={p} navigate={navigate} />)}
          </div>
        )}
      </div>
    </main>
  );
}