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

      if (response.ok) {
        setStep(2);
        setTimeout(() => {
          login(data.user, data.token); // Auto login after signup using the returned token
          navigate('/');
        }, 2000);
      } else {
        setErrors({ email: data.message || 'Signup failed' });
      }

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
        <style>{`@keyframes spin{from{ transform: rotate(0deg) }to{ transform: rotate(360deg) } } `}</style>
      </div>
    </main>
  );

  return (
    <main style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(ellipse at 80% 50%, rgba(249, 115, 22, 0.09), transparent 60%), var(--cream)`,
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

        {/* Social signup */}
        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-light)' }} />
          <span style={{ fontSize: 13, color: 'var(--gray-mid)' }}>or sign up with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-light)' }} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href={`${API_URL}/auth/google`} style={{
            flex: 1, padding: '11px', border: '2px solid var(--gray-light)', borderRadius: 12,
            background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-body)', color: 'var(--charcoal)', transition: 'var(--transition)',
            textDecoration: 'none'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron-light)'; e.currentTarget.style.background = 'var(--saffron-pale)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-light)'; e.currentTarget.style.background = 'none'; }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg> Google
          </a>

          <button style={{
            flex: 1, padding: '11px', border: '2px solid var(--gray-light)', borderRadius: 12,
            background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-body)', color: 'var(--charcoal)', transition: 'var(--transition)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron-light)'; e.currentTarget.style.background = 'var(--saffron-pale)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-light)'; e.currentTarget.style.background = 'none'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.005 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg> Facebook
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--gray-mid)' }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: 'var(--saffron)', fontWeight: 700, cursor: 'pointer' }}>Sign In →</span>
        </p>
      </div>

      <style>{`
@keyframes spin{from{ transform: rotate(0deg) }to{ transform: rotate(360deg) } }
@media(max-width: 480px) { .signup-grid{ grid-template-columns: 1fr!important; } }
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