import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Cart({ navigate }) {
  const { cart, removeFromCart, updateCartQty, cartTotal, clearCart, user, showToast, placeOrder } = useApp();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  // Checkout flow state: 1 = Cart, 2 = Shipping, 3 = Payment
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', pin: '', phone: '' });
  const [payment, setPayment] = useState('UPI');

  const applyCoupon = () => {
    const codes = { 'ECART10': 0.10, 'SAVE20': 0.20, 'FIRST50': 0.50 };
    if (codes[coupon.toUpperCase()]) {
      setDiscount(codes[coupon.toUpperCase()]);
      setCouponMsg(`✅ Coupon applied! ${coupon.toUpperCase()} — ${(codes[coupon.toUpperCase()] * 100)}% off`);
    } else {
      setCouponMsg('❌ Invalid coupon code');
      setDiscount(0);
    }
  };

  const delivery = cartTotal >= 499 ? 0 : 99;
  const discAmt = Math.round(cartTotal * discount);
  const total = cartTotal - discAmt + delivery;

  const handleNextStep = () => {
    if (!user) { showToast('Please login to checkout 🔑', '⚠️'); navigate('/login'); return; }

    if (step === 1) setStep(2);
    else if (step === 2) {
      if (!shipping.name || !shipping.address || !shipping.city || !shipping.pin || !shipping.phone) {
        showToast('Please fill all shipping details', '⚠️');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      placeOrder(cart, total, shipping, payment);
      navigate('/orders');
    }
  };

  if (cart.length === 0) return (
    <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
        <h2 style={{ fontSize: '1.9rem', color: 'var(--charcoal)', marginBottom: 12 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--gray-mid)', marginBottom: 28, fontSize: 15 }}>Discover amazing products and add them to your cart.</p>
        <button className="btn-p" onClick={() => navigate('/')}>Start Shopping →</button>
      </div>
    </main>
  );

  return (
    <main style={{ padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Checkout Header Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--charcoal)' }}>
            {step === 1 ? 'Shopping Cart' : step === 2 ? 'Shipping Details' : 'Payment Method'}
            {step === 1 && <span style={{ color: 'var(--gray-mid)', fontSize: '1.2rem', fontFamily: 'var(--font-body)' }}> ({cart.length} items)</span>}
          </h1>
          {step === 1 && <button onClick={clearCart} style={{ background: 'none', border: '1.5px solid #fca5a5', color: '#dc2626', padding: '8px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>🗑️ Clear Cart</button>}
          {step > 1 && <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', color: 'var(--saffron)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>← Back</button>}
        </div>

        {/* Step Indicators */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, maxWidth: 600 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: 6, borderRadius: 3,
              background: step >= s ? 'var(--saffron)' : 'var(--saffron-l)',
              transition: 'var(--tr)'
            }} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }} className="cart-layout">

          {/* Main Content Area based on Step */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Step 1: Cart Items */}
            {step === 1 && cart.map(item => (
              <div key={item.id} style={{
                background: 'white', borderRadius: 18, padding: '20px',
                boxShadow: 'var(--sh)', border: '1px solid rgba(0,0,0,0.05)',
                display: 'flex', gap: 20, alignItems: 'flex-start',
                animation: 'fadeUp 0.3s ease',
              }}>
                <img src={item.img} alt={item.name} onClick={() => navigate('product', { product: item })} style={{
                  width: 90, height: 90, borderRadius: 12, objectFit: 'cover',
                  cursor: 'pointer', flexShrink: 0, border: '2px solid var(--saffron-l)',
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--saffron)', fontWeight: 600, marginBottom: 4 }}>{item.brand}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ch)', marginBottom: 6, fontFamily: 'var(--fb)', lineHeight: 1.4 }}>{item.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--ch)' }}>₹{item.price.toLocaleString()}</span>
                    <span style={{ fontSize: 13, color: 'var(--gm)', textDecoration: 'line-through' }}>₹{item.old.toLocaleString()}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ok)' }}>
                      Save ₹{((item.old - item.price) * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--saffron-l)', borderRadius: 50, overflow: 'hidden' }}>
                    <button onClick={() => updateCartQty(item.id, item.qty - 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--saffron)' }}>−</button>
                    <span style={{ padding: '0 10px', fontSize: 14, fontWeight: 700, color: 'var(--ch)', minWidth: 28, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, item.qty + 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--saffron)' }}>+</button>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ch)' }}>₹{(item.price * item.qty).toLocaleString()}</div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--err)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑️ Remove</button>
                </div>
              </div>
            ))}

            {/* Step 2: Shipping Form */}
            {step === 2 && (
              <div style={{ background: 'white', borderRadius: 18, padding: '24px', boxShadow: 'var(--sh)', border: '1px solid rgba(0,0,0,0.05)', animation: 'fadeUp 0.3s ease' }}>
                <h3 style={{ fontSize: 18, marginBottom: 20 }}>Delivery Address</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input className="inp" placeholder="Full Name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} />
                  <input className="inp" placeholder="Phone Number" type="tel" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} />
                  <textarea className="inp" placeholder="Street Address / Apartment / Suite" rows="3" style={{ resize: 'vertical' }} value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
                  <div style={{ display: 'flex', gap: 16 }}>
                    <input className="inp" placeholder="City" style={{ flex: 1 }} value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} />
                    <input className="inp" placeholder="PIN Code" style={{ width: 140 }} value={shipping.pin} onChange={e => setShipping({ ...shipping, pin: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Form */}
            {step === 3 && (
              <div style={{ background: 'white', borderRadius: 18, padding: '24px', boxShadow: 'var(--sh)', border: '1px solid rgba(0,0,0,0.05)', animation: 'fadeUp 0.3s ease' }}>
                <h3 style={{ fontSize: 18, marginBottom: 20 }}>Select Payment Method</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['UPI', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery (COD)'].map(method => (
                    <label key={method} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '16px',
                      border: `2px solid ${payment === method ? 'var(--saffron)' : 'var(--saffron-l)'}`,
                      borderRadius: 12, cursor: 'pointer', background: payment === method ? 'var(--saffron-p)' : '#fff',
                      transition: 'var(--tr)'
                    }}>
                      <input type="radio" name="payment" value={method} checked={payment === method} onChange={() => setPayment(method)} style={{ accentColor: 'var(--saffron)', width: 18, height: 18 }} />
                      <span style={{ fontWeight: 500 }}>{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div style={{ background: 'white', borderRadius: 20, padding: '28px', boxShadow: 'var(--shh)', border: '1px solid rgba(249,115,22,0.10)', position: 'sticky', top: 100 }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--ch)', marginBottom: 24 }}>Order Summary</h2>

            {/* Coupon (only in Step 1) */}
            {step === 1 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={coupon} onChange={e => { setCoupon(e.target.value); setCouponMsg(''); }} placeholder="Enter coupon code" style={{
                    flex: 1, padding: '10px 14px', border: '2px solid var(--saffron-l)', borderRadius: 10,
                    fontSize: 13, outline: 'none', background: 'var(--saffron-p)', fontFamily: 'var(--fb)', color: 'var(--ch)',
                  }} onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
                  <button onClick={applyCoupon} style={{ padding: '10px 16px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Apply</button>
                </div>
                {couponMsg && <p style={{ fontSize: 12, marginTop: 6, color: couponMsg.startsWith('✅') ? 'var(--ok)' : 'var(--err)' }}>{couponMsg}</p>}
                <p style={{ fontSize: 11, color: 'var(--gm)', marginTop: 6 }}>Try: ECART10 · SAVE20 · FIRST50</p>
              </div>
            )}

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: step > 1 ? 'none' : '1px solid var(--gl)', paddingTop: step > 1 ? 0 : 16 }}>
              {[
                ['Subtotal', `₹${cartTotal.toLocaleString()}`],
                ['Delivery', delivery === 0 ? <span style={{ color: 'var(--ok)', fontWeight: 600 }}>FREE 🎉</span> : `₹${delivery}`],
                discount > 0 && ['Coupon Discount', <span style={{ color: 'var(--ok)' }}>−₹{discAmt.toLocaleString()}</span>],
              ].filter(Boolean).map(([lbl, val]) => (
                <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--gm)' }}>
                  <span>{lbl}</span><span>{val}</span>
                </div>
              ))}
              {cartTotal < 499 && (
                <p style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 600, background: 'var(--saffron-p)', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--saffron-l)' }}>
                  Add ₹{(499 - cartTotal).toLocaleString()} more for FREE delivery!
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, color: 'var(--ch)', borderTop: '2px solid var(--saffron-l)', paddingTop: 14, marginTop: 4 }}>
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button className="btn-p" onClick={handleNextStep} style={{ width: '100%', justifyContent: 'center', marginTop: 24, padding: '15px', fontSize: 16 }}>
              {step === 1 ? 'Proceed to Checkout →' : step === 2 ? 'Continue to Payment →' : 'Place Order Now ✅'}
            </button>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.cart-layout{grid-template-columns:1fr!important;}}`}</style>
    </main>
  );
}