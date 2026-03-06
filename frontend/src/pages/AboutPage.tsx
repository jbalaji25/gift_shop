import { useEffect, useRef, useState } from 'react';
import {
    Award, Users, Leaf, Shield, Star, ArrowRight,
    ChevronDown, Hammer, TreePine, Heart
} from 'lucide-react';

interface AboutPageProps {
    onNavigate: (page: string) => void;
}

const stats = [
    { value: '15+', label: 'Years of Gifting Excellence' },
    { value: '5000+', label: 'Happy Families' },
    { value: '97+', label: 'Premium Products' },
    { value: '100%', label: 'Satisfaction Guarantee' },
];

const values = [
    {
        icon: Hammer,
        title: 'Curated Selection',
        desc: 'Every gift is carefully selected by our experts, ensuring each detail is perfected for your special occasion.',
        color: 'from-amber-400 to-orange-500',
    },
    {
        icon: TreePine,
        title: 'Exceptional Quality',
        desc: 'We partner with premium brands to bring you the finest luxury gifts.',
        color: 'from-emerald-400 to-teal-500',
    },
    {
        icon: Heart,
        title: 'Customer First',
        desc: 'Your satisfaction is our legacy. From design consultation to after-sales support, we are always by your side.',
        color: 'from-rose-400 to-pink-500',
    },
    {
        icon: Shield,
        title: 'Lifetime Integrity',
        desc: 'We stand behind every product with up to 10 years of warranty, because we provide gifts that last generations.',
        color: 'from-blue-400 to-indigo-500',
    },
];

const timeline = [
    { year: '2009', title: 'The Beginning', desc: 'Started as a small boutique in Madurai with 3 experts and a big dream.' },
    { year: '2013', title: 'First Showroom', desc: 'Opened our flagship showroom on GST Road, welcoming our first 500 customers.' },
    { year: '2017', title: 'Premium Collection', desc: 'Launched our signature premium collection featuring exclusive luxury gifts.' },
    { year: '2020', title: 'Digital Expansion', desc: 'Went online to serve customers across Tamil Nadu and beyond.' },
    { year: '2024', title: 'Today & Beyond', desc: 'Now serving 5000+ families with an expanding catalog of 97+ premium products.' },
];

const team = [
    { name: 'Rajan Kumar', role: 'Founder', exp: '25 years experience', initials: 'RK', color: 'from-amber-400 to-orange-500' },
    { name: 'Priya Sundaram', role: 'Head of Design', exp: '15 years experience', initials: 'PS', color: 'from-rose-400 to-pink-500' },
    { name: 'Vikram Nair', role: 'Operations Director', exp: '12 years experience', initials: 'VN', color: 'from-blue-400 to-indigo-500' },
    { name: 'Lakshmi Devi', role: 'Customer Relations', exp: '10 years experience', initials: 'LD', color: 'from-emerald-400 to-teal-500' },
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

export function AboutPage({ onNavigate }: AboutPageProps) {
    const statsSection = useInView();
    const valuesSection = useInView();
    const timelineSection = useInView();
    const teamSection = useInView();

    const [activeTimelineIdx, setActiveTimelineIdx] = useState<number | null>(null);

    return (
        <div className="about-page" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── HERO ── */}
            <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
                {/* animated gradient bg */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #292524 100%)',
                }} />
                {/* decorative circles */}
                <div style={{
                    position: 'absolute', width: 600, height: 600, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
                    top: -150, right: -150, pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
                    bottom: -100, left: -100, pointerEvents: 'none',
                }} />

                {/* wood grain texture overlay */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.04,
                    backgroundImage: `repeating-linear-gradient(
            90deg, transparent, transparent 2px,
            rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px
          )`,
                    pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 1.5rem', maxWidth: 900, margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: 50, padding: '8px 20px', marginBottom: 32,
                    }}>
                        <Award style={{ width: 16, height: 16, color: '#f59e0b' }} />
                        <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Our Story
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 24,
                    }}>
                        Crafting Homes,{' '}
                        <span style={{
                            background: 'linear-gradient(90deg, #f59e0b, #f97316, #f59e0b)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            backgroundSize: '200%',
                        }}>
                            One Piece
                        </span>{' '}
                        at a Time
                    </h1>

                    <p style={{
                        fontSize: '1.15rem', color: '#94a3b8', maxWidth: 640,
                        margin: '0 auto 40px', lineHeight: 1.8,
                    }}>
                        Born in the heart of Madurai, Elysian Gifts has been curating premium gifts
                        for over 15 years. We don't just sell gifts — we create unforgettable memories.
                    </p>

                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => onNavigate('products')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                color: '#fff', padding: '14px 32px', borderRadius: 12,
                                fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
                                boxShadow: '0 8px 32px rgba(245,158,11,0.35)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            Explore Collection <ArrowRight style={{ width: 16, height: 16 }} />
                        </button>
                        <button
                            onClick={() => onNavigate('contact')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: 'transparent',
                                color: '#cbd5e1', padding: '14px 32px', borderRadius: 12,
                                fontWeight: 600, fontSize: 15,
                                border: '1px solid rgba(148,163,184,0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#f59e0b'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; e.currentTarget.style.color = '#cbd5e1'; }}
                        >
                            Contact Us
                        </button>
                    </div>
                </div>

                {/* scroll indicator */}
                <div style={{
                    position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    color: '#475569', animation: 'bounce 2s infinite',
                }}>
                    <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
                    <ChevronDown style={{ width: 18, height: 18 }} />
                </div>
            </section>

            {/* ── STATS ── */}
            <section ref={statsSection.ref} style={{ background: '#fff', padding: '80px 1.5rem' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32,
                    }}>
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                style={{
                                    textAlign: 'center',
                                    opacity: statsSection.inView ? 1 : 0,
                                    transform: statsSection.inView ? 'translateY(0)' : 'translateY(40px)',
                                    transition: `all 0.7s ease ${i * 0.12}s`,
                                }}
                            >
                                <div style={{
                                    fontSize: '3rem', fontWeight: 900, lineHeight: 1,
                                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    marginBottom: 8,
                                }}>
                                    {s.value}
                                </div>
                                <div style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>{s.label}</div>
                                <div style={{ width: 40, height: 3, background: 'linear-gradient(90deg, #f59e0b, #f97316)', margin: '12px auto 0', borderRadius: 2 }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STORY ── */}
            <section style={{ background: '#f8fafc', padding: '100px 1.5rem' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f59e0b' }}>
                            Who We Are
                        </span>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: '16px 0 24px' }}>
                            More Than A Gift —<br />
                            <span style={{ color: '#f59e0b' }}>A Family Legacy</span>
                        </h2>
                        <p style={{ color: '#475569', lineHeight: 1.9, fontSize: 16, marginBottom: 20 }}>
                            Elysian Gifts was born in 2009 from a simple belief: every occasion deserves a gift
                            that tells a story. Founded by Rajan Kumar in Madurai, we began with
                            a small boutique and an unwavering commitment to quality and service.
                        </p>
                        <p style={{ color: '#475569', lineHeight: 1.9, fontSize: 16, marginBottom: 32 }}>
                            Today, we blend 15+ years of traditional wisdom with contemporary design
                            aesthetics. Every gift box and finish is a testament to our dedication
                            to craft. We meticulously hand-pick every item to ensure it meets our rigorous standards for premium gifting.
                        </p>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            {['Corporate Gifts', 'Personalized', 'Festive', 'Luxury Boxes'].map(w => (
                                <span key={w} style={{
                                    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                                    color: '#92400e', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600,
                                }}>
                                    {w}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* visual block */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                            borderRadius: 24, padding: 40,
                            boxShadow: '0 32px 80px rgba(0,0,0,0.15)',
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {[
                                    { icon: '🎁', label: 'Premium Gifts' },
                                    { icon: '🏆', label: 'Award Winning' },
                                    { icon: '♻️', label: 'Eco Friendly' },
                                    { icon: '🛡️', label: '10yr Warranty' },
                                ].map((b, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 16, padding: '24px 20px', textAlign: 'center',
                                    }}>
                                        <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
                                        <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>{b.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{
                                marginTop: 24, background: 'rgba(245,158,11,0.1)',
                                border: '1px solid rgba(245,158,11,0.2)',
                                borderRadius: 16, padding: '20px 24px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                        borderRadius: 12, width: 48, height: 48,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Star style={{ color: '#fff', width: 22, height: 22 }} />
                                    </div>
                                    <div>
                                        <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: 20 }}>4.9 / 5.0</div>
                                        <div style={{ color: '#94a3b8', fontSize: 13 }}>Customer Satisfaction</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* decorative amber blob */}
                        <div style={{
                            position: 'absolute', width: 200, height: 200, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
                            top: -60, right: -60, zIndex: -1,
                        }} />
                    </div>
                </div>
            </section>

            {/* ── VALUES ── */}
            <section ref={valuesSection.ref} style={{ background: '#0f172a', padding: '100px 1.5rem' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f59e0b' }}>
                            What We Stand For
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', marginTop: 12 }}>
                            Our Core Values
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
                        {values.map((v, i) => (
                            <div
                                key={i}
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 20, padding: '36px 28px',
                                    opacity: valuesSection.inView ? 1 : 0,
                                    transform: valuesSection.inView ? 'translateY(0)' : 'translateY(40px)',
                                    transition: `all 0.7s ease ${i * 0.12}s`,
                                    cursor: 'default',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)';
                                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{
                                    width: 56, height: 56, borderRadius: 16, marginBottom: 24,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: `linear-gradient(135deg, ${v.color.replace('from-', '').replace(' to-', ', ')})`,
                                }}>
                                    <v.icon style={{ color: '#fff', width: 26, height: 26 }} />
                                </div>
                                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
                                    {v.title}
                                </h3>
                                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 14 }}>
                                    {v.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TIMELINE ── */}
            <section ref={timelineSection.ref} style={{ background: '#fff', padding: '100px 1.5rem' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 72 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f59e0b' }}>
                            Our Journey
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#0f172a', marginTop: 12 }}>
                            15 Years of Excellence
                        </h2>
                    </div>

                    <div style={{ position: 'relative' }}>
                        {/* center line */}
                        <div style={{
                            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                            top: 0, bottom: 0, width: 3,
                            background: 'linear-gradient(180deg, #f59e0b, #f97316, #f59e0b)',
                            borderRadius: 2,
                        }} />

                        {timeline.map((t, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        justifyContent: isLeft ? 'flex-start' : 'flex-end',
                                        marginBottom: 48,
                                        opacity: timelineSection.inView ? 1 : 0,
                                        transform: timelineSection.inView ? 'translateX(0)' : `translateX(${isLeft ? -40 : 40}px)`,
                                        transition: `all 0.8s ease ${i * 0.15}s`,
                                        position: 'relative',
                                    }}
                                >
                                    {/* dot */}
                                    <div style={{
                                        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                                        top: 20, width: 16, height: 16,
                                        background: activeTimelineIdx === i ? '#f97316' : '#f59e0b',
                                        borderRadius: '50%', border: '3px solid #fff',
                                        boxShadow: '0 0 0 3px rgba(245,158,11,0.3)',
                                        cursor: 'pointer', transition: 'all 0.3s',
                                        zIndex: 10,
                                    }}
                                        onClick={() => setActiveTimelineIdx(activeTimelineIdx === i ? null : i)}
                                    />

                                    <div
                                        style={{
                                            width: '44%',
                                            background: activeTimelineIdx === i ? '#1e293b' : '#f8fafc',
                                            border: `1px solid ${activeTimelineIdx === i ? '#f59e0b' : '#e2e8f0'}`,
                                            borderRadius: 16, padding: '24px 28px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            boxShadow: activeTimelineIdx === i ? '0 8px 32px rgba(245,158,11,0.15)' : 'none',
                                        }}
                                        onClick={() => setActiveTimelineIdx(activeTimelineIdx === i ? null : i)}
                                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)')}
                                        onMouseLeave={e => (e.currentTarget.style.boxShadow = activeTimelineIdx === i ? '0 8px 32px rgba(245,158,11,0.15)' : 'none')}
                                    >
                                        <div style={{
                                            fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
                                            color: '#f59e0b', marginBottom: 6,
                                        }}>
                                            {t.year}
                                        </div>
                                        <h3 style={{
                                            fontWeight: 700, fontSize: 16,
                                            color: activeTimelineIdx === i ? '#fff' : '#0f172a',
                                            marginBottom: 8,
                                        }}>
                                            {t.title}
                                        </h3>
                                        <p style={{
                                            color: activeTimelineIdx === i ? '#94a3b8' : '#64748b',
                                            fontSize: 14, lineHeight: 1.7,
                                        }}>
                                            {t.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── TEAM ── */}
            <section ref={teamSection.ref} style={{ background: '#f8fafc', padding: '100px 1.5rem' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f59e0b' }}>
                            The Makers
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#0f172a', marginTop: 12 }}>
                            Meet Our Team
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
                        {team.map((m, i) => (
                            <div
                                key={i}
                                style={{
                                    background: '#fff', borderRadius: 20,
                                    padding: '36px 28px', textAlign: 'center',
                                    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                                    border: '1px solid #e2e8f0',
                                    opacity: teamSection.inView ? 1 : 0,
                                    transform: teamSection.inView ? 'translateY(0)' : 'translateY(40px)',
                                    transition: `all 0.7s ease ${i * 0.12}s`,
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)'; }}
                            >
                                <div style={{
                                    width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: `linear-gradient(135deg, ${m.color.replace('from-', '').replace(' to-', ', ')})`,
                                    fontSize: 24, fontWeight: 800, color: '#fff',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                }}>
                                    {m.initials}
                                </div>
                                <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: 17, marginBottom: 6 }}>{m.name}</h3>
                                <div style={{ color: '#f59e0b', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{m.role}</div>
                                <div style={{ color: '#94a3b8', fontSize: 12 }}>{m.exp}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '100px 1.5rem', textAlign: 'center',
            }}>
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    <Users style={{ width: 48, height: 48, color: '#f59e0b', margin: '0 auto 24px' }} />
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
                        Ready to Find the Perfect Gift?
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.8, marginBottom: 40 }}>
                        Visit our showroom at 49, GST Road, Pasumalai, Madurai or browse our full collection online.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => onNavigate('products')}
                            style={{
                                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                color: '#fff', padding: '16px 40px', borderRadius: 12,
                                fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer',
                                boxShadow: '0 8px 32px rgba(245,158,11,0.4)',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            Shop Now
                        </button>
                        <button
                            onClick={() => onNavigate('contact')}
                            style={{
                                background: 'transparent',
                                color: '#e2e8f0', padding: '16px 40px', borderRadius: 12,
                                fontWeight: 600, fontSize: 16,
                                border: '1px solid rgba(226,232,240,0.2)',
                                cursor: 'pointer', transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#f59e0b'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(226,232,240,0.2)'; e.currentTarget.style.color = '#e2e8f0'; }}
                        >
                            Get In Touch
                        </button>
                    </div>
                </div>
            </section>

            <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}</style>
        </div>
    );
}
