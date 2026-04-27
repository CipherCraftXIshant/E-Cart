import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export default function FlashSaleBanner() {
  const { flashSale, setFlashSale } = useApp();
  const [timeLeft, setTimeLeft] = useState('');
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  // Animate in when flash sale starts
  useEffect(() => {
    if (flashSale) {
      setVisible(true);
    }
  }, [flashSale]);

  // Countdown timer
  useEffect(() => {
    if (!flashSale) return;

    const tick = () => {
      const diff = new Date(flashSale.endsAt) - new Date();
      if (diff <= 0) {
        setFlashSale(null);
        setVisible(false);
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [flashSale, setFlashSale]);

  const copyCode = useCallback(() => {
    if (!flashSale) return;
    navigator.clipboard.writeText(flashSale.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [flashSale]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => setFlashSale(null), 400);
  };

  if (!flashSale) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: visible ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        background: 'linear-gradient(90deg, #7c3aed, #f97316, #dc2626)',
        backgroundSize: '300% 100%',
        animation: 'flashGradient 3s ease infinite',
        boxShadow: '0 4px 24px rgba(249,115,22,0.5)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        flexWrap: 'wrap',
      }}>

        {/* Left: Emoji + Message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26, animation: 'flashPulse 0.8s ease-in-out infinite' }}>⚡</span>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: '.3px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            {flashSale.message}
          </span>
        </div>

        {/* Center: Promo Code (click to copy) */}
        <button
          onClick={copyCode}
          title="Click to copy code"
          style={{
            background: copied ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)',
            border: '2px dashed rgba(255,255,255,0.8)',
            borderRadius: 10,
            padding: '6px 18px',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 900,
            fontSize: 18,
            fontFamily: 'monospace',
            letterSpacing: 3,
            transition: 'all 0.2s',
            transform: copied ? 'scale(0.96)' : 'scale(1)',
          }}
        >
          {copied ? '✓ Copied!' : flashSale.code}
        </button>

        {/* Right: Countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600 }}>Ends in:</span>
          <span style={{
            background: 'rgba(0,0,0,0.3)',
            color: '#fff',
            fontWeight: 900,
            fontSize: 22,
            fontFamily: 'monospace',
            padding: '4px 12px',
            borderRadius: 8,
            minWidth: 72,
            textAlign: 'center',
            textShadow: '0 0 12px rgba(255,255,255,0.6)',
            letterSpacing: 2,
          }}>
            {timeLeft}
          </span>
        </div>

        {/* Dismiss button */}
        <button
          onClick={dismiss}
          style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 28, height: 28, cursor: 'pointer', color: '#fff', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >✕</button>
      </div>

      <style>{`
        @keyframes flashGradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes flashPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50%       { transform: scale(1.3) rotate(-10deg); }
        }
      `}</style>
    </>
  );
}
