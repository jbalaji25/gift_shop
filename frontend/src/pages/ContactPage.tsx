import { useState, useRef, useEffect } from 'react';
import {
    Mail, Phone, MapPin, Clock, Send, CheckCircle,
    MessageSquare, Instagram, Facebook, Twitter,
    ChevronDown, ChevronUp
} from 'lucide-react';

interface ContactPageProps {
    onNavigate: (page: string) => void;
}

const faqs = [
    {
        q: 'Do you offer customization for gifts?',
        a: 'Yes! We offer full customization including premium packaging, custom notes, box colors, and ribbons. Contact us with your requirements for a custom quote.',
    },
    {
        q: 'What packaging materials do you use?',
        a: 'We work with premium packaging materials including sustainable materials, premium acrylics, and recycled papers. All sourced from certified, sustainable suppliers.',
    },
    {
        q: 'How long does delivery take?',
        a: 'Standard items ship within 7–14 days. Custom pieces take 3–6 weeks depending on complexity. We deliver across Tamil Nadu and ship PAN India.',
    },
    {
        q: "What is your return policy?",
        a: 'We offer hassle-free returns within 14 days for any unopened and unused items. Personalized and customized gifts are non-refundable unless damaged on arrival.',
    },
    {
        q: 'Can I visit the showroom?',
        a: 'Absolutely! We welcome visits at our showroom at 49, GST Road, Pasumalai, Madurai. Open Monday–Saturday, 9 AM – 7 PM.',
    },
];

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

export function ContactPage({ onNavigate }: ContactPageProps) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const formSection = useInView();
    const faqSection = useInView();
    const infoSection = useInView();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) return;
        setStatus('sending');
        // Simulate send
        setTimeout(() => setStatus('sent'), 2000);
    };

    const inputStyle = (field: string): React.CSSProperties => ({
        width: '100%',
        padding: '14px 16px',
        borderRadius: 12,
        border: `1.5px solid ${focusedField === field ? '#f59e0b' : '#e2e8f0'}`,
        background: focusedField === field ? '#fffbf0' : '#f8fafc',
        fontSize: 15,
        color: '#0f172a',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
        boxShadow: focusedField === field ? '0 0 0 3px rgba(245,158,11,0.12)' : 'none',
        fontFamily: "'Inter', sans-serif",
    });

    const labelStyle: React.CSSProperties = {
        display: 'block', marginBottom: 8,
        fontWeight: 600, fontSize: 14, color: '#374151',
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── HERO ── */}
            <section style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #292524 100%)',
                padding: '100px 1.5rem 80px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* decorative orbs */}
                {[
                    { top: -80, right: -80, size: 400, opacity: 0.12 },
                    { top: 100, left: -100, size: 300, opacity: 0.07 },
                ].map((o, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: o.size, height: o.size, borderRadius: '50%',
                        background: `radial-gradient(circle, rgba(245,158,11,${o.opacity}) 0%, transparent 70%)`,
                        top: o.top, right: (o as any).right, left: (o as any).left,
                        pointerEvents: 'none',
                    }} />
                ))}

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(245,158,11,0.12)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: 50, padding: '8px 20px', marginBottom: 28,
                    }}>
                        <MessageSquare style={{ width: 15, height: 15, color: '#f59e0b' }} />
                        <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            We'd Love to Hear From You
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20,
                    }}>
                        Let's{' '}
                        <span style={{
                            background: 'linear-gradient(90deg, #f59e0b, #f97316)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>
                            Connect
                        </span>
                    </h1>

                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
                        Have a question, a custom order, or just want to say hello?
                        Our team is ready to help you create your dream home.
                    </p>
                </div>
            </section>

            {/* ── CONTACT CARDS ── */}
            <section ref={infoSection.ref} style={{ background: '#fff', padding: '0 1.5rem' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: 24,
                        transform: 'translateY(-50px)',
                    }}>
                        {[
                            {
                                icon: MapPin, label: 'Visit Showroom',
                                value: '49, GST Road, Pasumalai', sub: 'Madurai – 625 004',
                                color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',
                            },
                            {
                                icon: Phone, label: 'Call Us',
                                value: '9626262777', sub: '9626262778',
                                color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)',
                            },
                            {
                                icon: Mail, label: 'Email Us',
                                value: 'wuddeninteriors', sub: '@gmail.com',
                                color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)',
                            },
                            {
                                icon: Clock, label: 'Working Hours',
                                value: 'Mon – Sat', sub: '9:00 AM – 7:00 PM',
                                color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)',
                            },
                        ].map((c, i) => (
                            <div
                                key={i}
                                style={{
                                    background: '#fff',
                                    border: `1px solid ${c.border}`,
                                    borderRadius: 20, padding: '28px 24px',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                    opacity: infoSection.inView ? 1 : 0,
                                    transform: infoSection.inView ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `all 0.6s ease ${i * 0.1}s`,
                                    cursor: 'default',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'; }}
                            >
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: c.bg, border: `1px solid ${c.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 16,
                                }}>
                                    <c.icon style={{ color: c.color, width: 24, height: 24 }} />
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                                    {c.label}
                                </div>
                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 16 }}>{c.value}</div>
                                <div style={{ color: '#64748b', fontSize: 14 }}>{c.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FORM + MAP ── */}
            <section ref={formSection.ref} style={{ background: '#f8fafc', padding: '60px 1.5rem 100px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48 }}>

                    {/* FORM */}
                    <div style={{
                        opacity: formSection.inView ? 1 : 0,
                        transform: formSection.inView ? 'translateX(0)' : 'translateX(-40px)',
                        transition: 'all 0.8s ease',
                    }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f59e0b' }}>
                            Send a Message
                        </span>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '12px 0 8px' }}>
                            We'll Reply Within 24 Hours
                        </h2>
                        <p style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.7 }}>
                            Fill in the form below and our team will get back to you as soon as possible.
                        </p>

                        {status === 'sent' ? (
                            <div style={{
                                background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                                border: '1px solid #6ee7b7',
                                borderRadius: 20, padding: '48px 32px',
                                textAlign: 'center',
                            }}>
                                <CheckCircle style={{ width: 56, height: 56, color: '#10b981', margin: '0 auto 16px' }} />
                                <h3 style={{ fontWeight: 800, color: '#065f46', fontSize: 22, marginBottom: 8 }}>
                                    Message Received! 🎉
                                </h3>
                                <p style={{ color: '#047857', lineHeight: 1.7, marginBottom: 24 }}>
                                    Thank you, {form.name}! We'll get back to you at {form.email} within 24 hours.
                                </p>
                                <button
                                    onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        color: '#fff', padding: '12px 28px', borderRadius: 10,
                                        fontWeight: 700, border: 'none', cursor: 'pointer',
                                    }}
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label style={labelStyle}>Full Name *</label>
                                        <input
                                            style={inputStyle('name')}
                                            placeholder="Rajan Kumar"
                                            value={form.name}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Email *</label>
                                        <input
                                            type="email"
                                            style={inputStyle('email')}
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label style={labelStyle}>Phone Number</label>
                                        <input
                                            style={inputStyle('phone')}
                                            placeholder="+91 9626262777"
                                            value={form.phone}
                                            onFocus={() => setFocusedField('phone')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Subject</label>
                                        <select
                                            style={inputStyle('subject')}
                                            value={form.subject}
                                            onFocus={() => setFocusedField('subject')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                        >
                                            <option value="">Select a topic…</option>
                                            <option value="custom">Custom Order</option>
                                            <option value="product">Product Inquiry</option>
                                            <option value="delivery">Delivery / Shipping</option>
                                            <option value="warranty">Warranty</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Message *</label>
                                    <textarea
                                        style={{ ...inputStyle('message'), minHeight: 140, resize: 'vertical' }}
                                        placeholder="Tell us about your requirements or questions…"
                                        value={form.message}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                        background: status === 'sending'
                                            ? 'linear-gradient(135deg, #d97706, #ea580c)'
                                            : 'linear-gradient(135deg, #f59e0b, #f97316)',
                                        color: '#fff', padding: '16px 32px', borderRadius: 12,
                                        fontWeight: 700, fontSize: 16, border: 'none',
                                        cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
                                        transition: 'all 0.3s',
                                        opacity: status === 'sending' ? 0.8 : 1,
                                    }}
                                    onMouseEnter={e => { if (status !== 'sending') (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'}
                                >
                                    {status === 'sending' ? (
                                        <>
                                            <div style={{
                                                width: 18, height: 18, borderRadius: '50%',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderTopColor: '#fff',
                                                animation: 'spin 0.8s linear infinite',
                                            }} />
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            <Send style={{ width: 18, height: 18 }} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* MAP + SOCIAL */}
                    <div style={{
                        opacity: formSection.inView ? 1 : 0,
                        transform: formSection.inView ? 'translateX(0)' : 'translateX(40px)',
                        transition: 'all 0.8s ease 0.15s',
                    }}>
                        {/* Map embed */}
                        <div style={{
                            borderRadius: 20, overflow: 'hidden',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
                            border: '1px solid #e2e8f0',
                            marginBottom: 28,
                        }}>
                            <iframe
                                title="Wudden Interiors Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.0537836849!2d78.10386!3d9.91831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00cfdddb4f99cd%3A0x18ae0ecbc5e91d42!2sGST%20Road%2C%20Pasumalai%2C%20Madurai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                width="100%"
                                height="280"
                                style={{ border: 0, display: 'block' }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>

                        {/* showroom card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                            borderRadius: 20, padding: '28px 28px', marginBottom: 24,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                                    background: 'rgba(245,158,11,0.15)',
                                    border: '1px solid rgba(245,158,11,0.25)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <MapPin style={{ color: '#f59e0b', width: 20, height: 20 }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 4 }}>Elysian Gifts Showroom</div>
                                    <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
                                        49, GST Road, Pasumalai<br />
                                        Madurai – 625 004, Tamil Nadu
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* social links */}
                        <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 16, fontSize: 15 }}>Follow Us</div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                {[
                                    { icon: Instagram, label: 'Instagram', color: '#e1306c', bg: 'rgba(225,48,108,0.08)', border: 'rgba(225,48,108,0.2)' },
                                    { icon: Facebook, label: 'Facebook', color: '#1877f2', bg: 'rgba(24,119,242,0.08)', border: 'rgba(24,119,242,0.2)' },
                                    { icon: Twitter, label: 'Twitter', color: '#1da1f2', bg: 'rgba(29,161,242,0.08)', border: 'rgba(29,161,242,0.2)' },
                                ].map((s, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '10px 18px', borderRadius: 10,
                                            background: s.bg, border: `1px solid ${s.border}`,
                                            color: s.color, fontWeight: 600, fontSize: 14,
                                            textDecoration: 'none', transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                                    >
                                        <s.icon style={{ width: 17, height: 17 }} />
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section ref={faqSection.ref} style={{ background: '#fff', padding: '80px 1.5rem 100px' }}>
                <div style={{ maxWidth: 780, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f59e0b' }}>
                            FAQ
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginTop: 12 }}>
                            Common Questions
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {faqs.map((f, i) => (
                            <div
                                key={i}
                                style={{
                                    border: `1px solid ${openFaq === i ? '#f59e0b' : '#e2e8f0'}`,
                                    borderRadius: 16, overflow: 'hidden',
                                    boxShadow: openFaq === i ? '0 4px 20px rgba(245,158,11,0.1)' : 'none',
                                    opacity: faqSection.inView ? 1 : 0,
                                    transform: faqSection.inView ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s, border-color 0.2s, box-shadow 0.2s`,
                                }}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    style={{
                                        width: '100%', textAlign: 'left',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '20px 24px',
                                        background: openFaq === i ? 'rgba(245,158,11,0.04)' : '#fff',
                                        border: 'none', cursor: 'pointer',
                                        fontWeight: 700, fontSize: 15,
                                        color: openFaq === i ? '#92400e' : '#0f172a',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <span style={{ flex: 1, paddingRight: 16 }}>{f.q}</span>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                        background: openFaq === i ? 'rgba(245,158,11,0.15)' : '#f1f5f9',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s',
                                    }}>
                                        {openFaq === i
                                            ? <ChevronUp style={{ width: 16, height: 16, color: '#f59e0b' }} />
                                            : <ChevronDown style={{ width: 16, height: 16, color: '#64748b' }} />
                                        }
                                    </div>
                                </button>

                                {openFaq === i && (
                                    <div style={{ padding: '0 24px 20px', color: '#475569', lineHeight: 1.8, fontSize: 15 }}>
                                        {f.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 40 }}>
                        <p style={{ color: '#64748b', marginBottom: 16 }}>Still have questions?</p>
                        <button
                            onClick={() => (document.querySelector('#contact-form') as HTMLElement)?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                color: '#fff', padding: '13px 32px', borderRadius: 10,
                                fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
                            }}
                        >
                            Ask Us Directly
                        </button>
                    </div>
                </div>
            </section>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}</style>
        </div>
    );
}
