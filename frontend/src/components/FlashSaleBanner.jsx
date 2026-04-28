import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function FlashSaleBanner() {
    const { flashSale, setFlashSale } = useApp();
    const [timeLeft, setTimeLeft] = useState('');
    const [copied, setCopied] = useState(false);
    const [visible, setVisible] = useState(false);

    // Animate in when flashSale appears
    useEffect(() => {
        if (flashSale) {
            setTimeout(() => setVisible(true), 50);
        } else {
            setVisible(false);
        }
    }, [flashSale]);

    // Live countdown timer
    useEffect(() => {
        if (!flashSale) return;

        const update = () => {
            const diff = new Date(flashSale.endsAt) - new Date();
            if (diff <= 0) { setFlashSale(null); return; }
            const m = Math.floor(diff / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [flashSale, setFlashSale]);

    const copyCode = () => {
        navigator.clipboard.writeText(flashSale.code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (!flashSale) return null;

    return (
        <>
            <style>{`
                @keyframes flashSlideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to   { transform: translateY(0);     opacity: 1; }
                }
                @keyframes flashPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
                    50%      { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
                }
                @keyframes flashSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>

            <div style={{
                background: 'linear-gradient(135deg, #f97316 0%, #dc2626 50%, #9333ea 100%)',
                color: 'white',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                position: 'relative',
                overflow: 'hidden',
                animation: visible ? 'flashSlideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                zIndex: 1000,
            }}>
                {/* Shimmer overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'flashSpin 3s linear infinite',
                    pointerEvents: 'none'
                }} />

                {/* Left: Icon + Message */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24, animation: 'flashSpin 2s linear infinite' }}>⚡</span>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.3 }}>
                            {flashSale.message}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                            Limited time offer — ends in <strong>{timeLeft}</strong>
                        </div>
                    </div>
                </div>

                {/* Center: Discount badge */}
                <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.5)',
                    borderRadius: 50,
                    padding: '4px 20px',
                    fontWeight: 900,
                    fontSize: 20,
                    letterSpacing: 1,
                    backdropFilter: 'blur(4px)',
                    animation: 'flashPulse 2s ease-in-out infinite',
                }}>
                    {flashSale.discount}% OFF
                </div>

                {/* Right: Code + Close */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={copyCode} style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: '2px dashed rgba(255,255,255,0.7)',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontSize: 14,
                        letterSpacing: 2,
                        transition: 'all 0.2s',
                        backdropFilter: 'blur(4px)',
                    }}>
                        {copied ? '✅ Copied!' : `🏷️ ${flashSale.code}`}
                    </button>

                    <button onClick={() => setFlashSale(null)} style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: 'none',
                        color: 'white',
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        ×
                    </button>
                </div>
            </div>
        </>
    );
}
