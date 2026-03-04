import { useState } from 'react';
import { useApp, API_URL } from '../../context/AppContext';

export default function Signup({ navigate }) {
  const { login } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', agree: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = success

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.agree) e.agree = 'You must accept the terms';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ email: data.message || 'Signup failed' });
        setLoading(false);
        return;
      }

      login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      });

      setStep(2);
      setTimeout(() => navigate('/'), 2000);

    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ email: 'Failed to connect to the server. Is the backend running?' });
    } finally {
      setLoading(false);
    }
  };

  const inp = (field) => ({
    value: form[field],
    onChange: e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: '' })); },
  });

  if (step === 2) return (
    <main style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--cream)' }}>
      <div style={{ textAlign: 'center', animation: 'scaleIn 0.4s ease' }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontSize: '2rem', color: 'var(--charcoal)', marginBottom: 12 }}>Account Created!</h2>
        <p style={{ color: 'var(--gray-mid)', fontSize: 16 }}>Welcome to e-cart, {form.name.split(' ')[0]}! Redirecting you to homepage…</p>
        <div style={{ width: 48, height: 48, border: '3px solid var(--saffron)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '24px auto 0' }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </main>
  );

  return (
    <main style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(ellipse at 80% 50%, rgba(249,115,22,0.09), transparent 60%), var(--cream)`,
      padding: '40px 24px',
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: 'clamp(28px,5vw,52px)',
        boxShadow: '0 20px 60px rgba(249,115,22,0.12)', width: '100%', maxWidth: 520,
        border: '1px solid rgba(249,115,22,0.10)', animation: 'scaleIn 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 58, height: 58, background: 'var(--saffron)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 14px', boxShadow: '0 8px 20px rgba(249,115,22,0.30)',
          }}>🛒</div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--charcoal)', marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: 'var(--gray-mid)', fontSize: 15 }}>Join e-<span style={{ color: 'var(--saffron)' }}>cart</span> — it's free!</p>
        </div>

        {/* Benefits chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
          {['🎁 Exclusive Deals', '🚀 Free Delivery', '❤️ Save Wishlist', '📦 Track Orders'].map(b => (
            <span key={b} style={{ background: 'var(--saffron-pale)', border: '1px solid var(--saffron-light)', padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600, color: 'var(--saffron)' }}>{b}</span>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="signup-grid">
            <Field label="Full Name" icon="👤" error={errors.name} full={false}>
              <input {...inp('name')} type="text" placeholder="Rahul Sharma" style={inputStyle(errors.name)} />
            </Field>
            <Field label="Phone Number" icon="📱" error={errors.phone} full={false}>
              <input {...inp('phone')} type="tel" placeholder="9876543210" style={inputStyle(errors.phone)} />
            </Field>
          </div>

          <Field label="Email Address" icon="📧" error={errors.email}>
            <input {...inp('email')} type="email" placeholder="you@example.com" style={inputStyle(errors.email)} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="signup-grid">
            <Field label="Password" icon="🔒" error={errors.password} full={false}>
              <div style={{ position: 'relative' }}>
                <input {...inp('password')} type={showPass ? 'text' : 'password'} placeholder="6+ characters" style={{ ...inputStyle(errors.password), paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </Field>
            <Field label="Confirm Password" icon="🔐" error={errors.confirm} full={false}>
              <input {...inp('confirm')} type="password" placeholder="Repeat password" style={inputStyle(errors.confirm)} />
            </Field>
          </div>

          {/* Strength indicator */}
          {form.password && (
            <div style={{ marginTop: -12, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {['Weak', 'Fair', 'Good', 'Strong'].map((lbl, i) => {
                  const str = form.password.length < 6 ? 0 : form.password.length < 8 ? 1 : /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 3 : 2;
                  const colors = ['#ef4444', '#f59e0b', '#22c55e', '#16a34a'];
                  return <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= str ? colors[str] : 'var(--gray-light)', transition: 'background 0.3s' }} />;
                })}
              </div>
            </div>
          )}

          {/* Terms */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.agree} onChange={e => { setForm(f => ({ ...f, agree: e.target.checked })); setErrors(er => ({ ...er, agree: '' })); }}
              style={{ accentColor: 'var(--saffron)', width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--gray-mid)', lineHeight: 1.5 }}>
              I agree to the <span style={{ color: 'var(--saffron)', fontWeight: 600 }}>Terms & Conditions</span> and <span style={{ color: 'var(--saffron)', fontWeight: 600 }}>Privacy Policy</span>
              {errors.agree && <span style={{ color: 'var(--error)', display: 'block', fontSize: 12 }}>⚠️ {errors.agree}</span>}
            </span>
          </label>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: loading ? 'var(--saffron-light)' : 'var(--saffron)',
            color: 'white', border: 'none', borderRadius: 50, fontSize: 16, fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--font-body)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 6px 20px rgba(249,115,22,0.30)', transition: 'var(--transition)',
          }}>
            {loading ? <><Spinner /> Creating account…</> : '✨ Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--gray-mid)' }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: 'var(--saffron)', fontWeight: 700, cursor: 'pointer' }}>Sign In →</span>
        </p>
      </div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @media(max-width:480px){.signup-grid{grid-template-columns:1fr!important;}}
      `}</style>
    </main>
  );
}

function Spinner() {
  return <span style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />;
}

function Field({ label, icon, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>{icon} {label}</label>
      {children}
      {error && <span style={{ fontSize: 12, color: 'var(--error)', marginTop: 4, display: 'block' }}>⚠️ {error}</span>}
    </div>
  );
}

const inputStyle = (error) => ({
  width: '100%', padding: '11px 14px',
  border: `2px solid ${error ? 'var(--error)' : 'var(--saffron-light)'}`,
  borderRadius: 10, fontSize: 14, color: 'var(--charcoal)',
  background: error ? '#fef2f2' : 'var(--saffron-pale)',
  outline: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.25s',
});