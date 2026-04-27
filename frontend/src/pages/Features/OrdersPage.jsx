import { useApp } from '../../context/AppContext';

export default function OrdersPage({ navigate }) {
    const { orders } = useApp();

    const getStatusStyle = (status) => {
        if (status === 'Delivered') return { text: 'Delivered ✅', color: 'var(--ok, #16a34a)' };
        if (status === 'In Transit') return { text: 'In Transit 🚚', color: 'var(--saffron)' };
        return { text: 'Processing 🔄', color: '#6366f1' };
    };

    if (orders.length === 0) return (
        <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
            <div style={{ textAlign: 'center', animation: 'fadeUp 0.5s ease' }}>
                <div style={{ fontSize: 80, marginBottom: 20 }}>📦</div>
                <h2 style={{ fontSize: '1.9rem', color: 'var(--ch)', marginBottom: 12 }}>No orders yet</h2>
                <p style={{ color: 'var(--gm)', marginBottom: 28, fontSize: 15 }}>Looks like you haven't placed any orders.</p>
                <button className="btn-p" onClick={() => navigate('/')}>Start Shopping →</button>
            </div>
        </main>
    );

    return (
        <main style={{ padding: '60px 24px', minHeight: '70vh' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--ch)', margin: 0 }}>My Orders 📦</h1>
                    {/* Live indicator */}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fee2e2', color: '#dc2626', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 50 }}>
                        <span style={{ width: 8, height: 8, background: '#dc2626', borderRadius: '50%', display: 'inline-block', animation: 'livePulse 1.2s ease-in-out infinite' }} />
                        LIVE
                    </span>
                </div>
                <p style={{ color: 'var(--gm)', marginBottom: 40 }}>Track and manage your orders here. Status updates automatically.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {orders.map(ord => {
                        const status = getStatusStyle(ord.status || 'Processing');
                        return (
                            <div key={ord.id} style={{
                                background: 'white', borderRadius: 16, padding: '24px',
                                boxShadow: 'var(--sh)', border: '1px solid rgba(0,0,0,0.05)',
                                animation: 'fadeUp 0.3s ease'
                            }}>
                                {/* Order Header */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid var(--gl)', paddingBottom: 16, marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ch)', marginBottom: 4 }}>{ord.id}</div>
                                        <div style={{ fontSize: 13, color: 'var(--gm)' }}>{new Date(ord.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} • {ord.items.length} items</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--ch)' }}>₹{ord.total.toLocaleString()}</div>
                                        <span style={{ padding: '6px 16px', borderRadius: 50, fontSize: 13, fontWeight: 700, background: `${status.color}18`, color: status.color }}>{status.text}</span>
                                    </div>
                                </div>

                                {/* Shipping & Payment Info */}
                                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20, fontSize: 13, color: 'var(--gm)' }}>
                                    <div style={{ flex: 1, minWidth: 200, background: 'var(--saffron-p)', padding: '12px', borderRadius: 12 }}>
                                        <strong style={{ color: 'var(--ch)', display: 'block', marginBottom: 4 }}>Shipping to:</strong>
                                        {ord.shipping.name} <br />
                                        {ord.shipping.address}<br />
                                        {ord.shipping.city} - {ord.shipping.pin}<br />
                                        Phone: {ord.shipping.phone}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 200, background: 'var(--saffron-p)', padding: '12px', borderRadius: 12 }}>
                                        <strong style={{ color: 'var(--ch)', display: 'block', marginBottom: 4 }}>Payment Method:</strong>
                                        {ord.payment}
                                    </div>
                                </div>

                                {/* Items */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {ord.items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <img src={item.img} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ch)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--gm)' }}>Qty: {item.qty}</div>
                                            </div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ch)' }}>₹{(item.price * item.qty).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

/* CSS animation for the live pulse dot */
const _styles = document.createElement('style');
_styles.textContent = `
    @keyframes livePulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.4; transform: scale(1.5); }
    }
`;
document.head.appendChild(_styles);
