export default function Footer({ navigate }) {
  const cols = [
    { title: 'Information',       links: ['About Us','Privacy Policy','Terms & Conditions','Returns Policy'] },
    { title: 'Customer Services', links: ['Shipping','Payments','Cancellations & Refunds','Track Your Order','Contact Us'] },
    { title: 'Business Enquiry',  links: ['Download Catalogue','Export Enquiries','Our Certifications','International Shipping'] },
  ];

  return (
    <footer style={{ background: '#fdf3e3' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'56px 24px 40px', display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr', gap:48 }} className="footer-grid">

        {/* Brand */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, cursor:'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width:40, height:40, background:'var(--saffron)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🛒</div>
            <span style={{ fontFamily:'var(--fd)', fontWeight:700, fontSize:22 }}>e-<span style={{ color:'var(--saffron)' }}>cart</span></span>
          </div>
          <p style={{ fontSize:13, color:'var(--gm)', fontWeight:600, marginBottom:16 }}>World's Most Trusted Shopping Platform</p>
          <div style={{ fontSize:13, color:'var(--gm)', lineHeight:2.1 }}>
            <div>📍 Dubai Digital Park, Dubai Silicon Oasis, UAE</div>
            <div>📍 62 Tulsi Estate, Ahmedabad, Gujarat — 382213</div>
            <div>📞 (+91) 89991 20020</div>
            <div>✉️ care@ecart.com</div>
          </div>
        </div>

        {/* Link columns */}
        {cols.map(c => (
          <div key={c.title}>
            <h4 style={{ fontSize:14, fontWeight:700, color:'var(--saffron)', marginBottom:18, letterSpacing:'.4px', fontFamily:'var(--fb)' }}>{c.title}</h4>
            {c.links.map(l => (
              <div key={l} style={{ fontSize:13.5, color:'var(--gm)', padding:'6px 0', borderBottom:'1px dashed #e5e7eb', cursor:'pointer', transition:'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color='var(--saffron)'}
                onMouseLeave={e => e.currentTarget.style.color='var(--gm)'}>{l}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ background:'var(--saffron)', padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <span style={{ color:'#fff', fontSize:13 }}>© 2026 e-cart.com. All rights reserved.</span>
        <div style={{ display:'flex', gap:8 }}>
          {['📱','📘','📷'].map((ico,i) => (
            <div key={i} style={{ width:30, height:30, background:'rgba(255,255,255,.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:14, transition:'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.35)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.2)'}>{ico}</div>
          ))}
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['Apple Pay','Visa','PayPal','Mastercard','Amex'].map(p => (
            <span key={p} style={{ background:'#fff', borderRadius:5, padding:'2px 8px', fontSize:10, fontWeight:700, color:'var(--ch)' }}>{p}</span>
          ))}
        </div>
      </div>
      <div style={{ background:'#92400e', padding:'10px 24px', textAlign:'center', fontSize:13, color:'#fef3c7', fontWeight:600 }}>
        🎁 e-cart Rewards | Get up to 10% Off using POPCoins →
      </div>

      <style>{`@media(max-width:768px){ .footer-grid{ grid-template-columns:1fr !important; } }`}</style>
    </footer>
  );
}