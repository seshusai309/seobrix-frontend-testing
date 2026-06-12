'use client';
import Link from 'next/link';

// ─── Feature icons (inline SVG, no external dep) ──────────────────────────────
function Icon({ d, d2 }: { d: string; d2?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
      {d2 && <path d={d2} />}
    </svg>
  );
}

const FEATURES = [
  { icon: 'M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z', title: 'Keyword Research', desc: 'AI-powered discovery with volume, difficulty, and intent analysis across clusters.' },
  { icon: 'M3 3v18h18', icon2: 'M7 16l4-8 4 4 5-6', title: 'SERP Intelligence', desc: 'Analyse top-ranking pages, featured snippets, and the competitive landscape instantly.' },
  { icon: 'M8 6h13M8 12h13M8 18h13M3 6h0M3 12h0M3 18h0', title: 'Content Planning', desc: 'Automated content calendar with AI-generated briefs, outlines, and publishing cadence.' },
  { icon: 'M17 3l4 4L7 21H3v-4L17 3z', title: 'AI Writing Engine', desc: 'Generate SEO-optimised, unique content at scale with qualification compliance built in.' },
  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Content Optimization', desc: 'Real-time SEO scoring with on-page checks, readability, and semantic coverage.' },
  { icon: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12', title: 'One-click Publishing', desc: 'Direct WordPress and Shopify publishing with scheduling and schema injection.' },
  { icon: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z', title: 'Technical Audits', desc: 'Comprehensive crawl audits that auto-convert into client proposals with AI remediation.' },
  { icon: 'M23 6l-9.5 9.5-5-5L1 18', icon2: 'M17 6h6v6', title: 'Rank Tracking', desc: 'Real-time position monitoring across keywords, locations, devices, and SERP features.' },
  { icon: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71', icon2: 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71', title: 'Backlink Outreach', desc: 'Prospect discovery, personalised email outreach, and full CRM pipeline management.' },
  { icon: 'M3 11l19-9-9 19-2-8-8-2z', title: 'AEO Tracking', desc: 'Monitor brand mentions in ChatGPT, Perplexity, Gemini, Claude, and Google AI Overview.' },
  { icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', icon2: 'M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', title: 'Client Portal', desc: 'Beautiful client-facing dashboard with progress, approvals, and deliverable tracking.' },
  { icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', icon2: 'M14 2v6h6', title: 'White-label Reports', desc: 'Monthly reports with AI-generated executive summaries, KPI highlights, and traffic charts.' },
];

const WORKFLOW = [
  { step: '01', title: 'Client Onboarding', desc: 'Add clients, connect their CMS, define services and target markets in minutes.' },
  { step: '02', title: 'Keyword Research', desc: 'AI-powered discovery with volume, difficulty, and intent analysis across your niche.' },
  { step: '03', title: 'Content Creation', desc: 'Generate SEO-optimised content with team review before anything goes to a client.' },
  { step: '04', title: 'Approval & Publish', desc: 'Content flows through your approval queue — approved, then published directly to WordPress or Shopify.' },
  { step: '05', title: 'Track & Report', desc: 'Monitor rankings, backlinks, and AI visibility. Deliver white-label reports automatically.' },
];

const PRICING = [
  {
    name: 'Starter',
    price: '499',
    desc: 'Perfect for solo consultants',
    features: ['Up to 5 clients', 'Basic content generation', 'Rank tracking (500 keywords)', 'Standard reports', 'Email support'],
    hl: false,
  },
  {
    name: 'Growth',
    price: '1,299',
    desc: 'Best for growing agencies',
    badge: 'Most popular',
    features: ['Up to 20 clients', 'Unlimited content generation', 'Advanced rank tracking', 'White-label reports', 'Priority support', 'Custom approval workflows', 'AEO tracking'],
    hl: true,
  },
  {
    name: 'Agency',
    price: '2,999',
    desc: 'For scale operations',
    features: ['Unlimited clients', 'All Growth features', 'Dedicated account manager', 'Custom integrations', '24/7 phone support', 'SLA guarantee'],
    hl: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Tailored to your needs',
    features: ['Everything in Agency', 'On-premise deployment', 'Custom AI model training', 'Dedicated infrastructure', 'White-glove migration'],
    hl: false,
  },
];

const STATS = [
  { value: '500+', label: 'Agencies' },
  { value: '50K+', label: 'Keywords Analyzed' },
  { value: '100K+', label: 'Content Assets' },
  { value: '99.9%', label: 'Uptime' },
];

const BLOG_STATUS_FLOW = ['Draft', 'In Review', 'Changes', 'Approved', 'Published'];
const STATUS_COLORS = ['#71717a', '#3b82f6', '#d97706', '#27a06a', '#16a34a'];

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--ink)', fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)', background: 'rgba(10,10,12,0.85)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>SB</span>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px' }}>SEO Brix</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--ink-2)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }}>
              Sign in
            </Link>
            <Link href="/login" style={{ padding: '7px 16px', borderRadius: 8, background: 'var(--brand)', color: '#fff', fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 24px 80px' }}>
        {/* Aurora background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(39,160,106,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        </div>

        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 99, border: '1px solid rgba(39,160,106,0.3)', background: 'rgba(39,160,106,0.08)', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)' }} />
            <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--brand)' }}>Now in Beta — Free for early agencies</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 24 }}>
            The Operating System for{' '}
            <span style={{ background: 'linear-gradient(135deg, var(--brand) 0%, #6ee7b7 60%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Modern SEO Agencies
            </span>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--ink-2)', maxWidth: 600, margin: '0 auto 40px', fontWeight: 400 }}>
            Manage clients, automate SEO execution, generate content, track rankings, win backlinks, and deliver reports — all from one platform.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 10, background: 'var(--brand)', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 32px rgba(39,160,106,0.35)' }}>
              Start Free Trial
            </Link>
            <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 10, border: '1px solid var(--border-2)', color: 'var(--ink-2)', fontSize: 15, fontWeight: 500, textDecoration: 'none', background: 'var(--surface)' }}>
              ▶ Watch Demo
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px,5vw,64px)', flexWrap: 'wrap' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', fontFamily: "'Geist Mono', monospace" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approval workflow visual ── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--brand)', marginBottom: 10 }}>Approval Engine</p>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 12 }}>Human Control at Every Step</h2>
            <p style={{ color: 'var(--ink-2)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>Every AI-generated output flows through your approval queue before it reaches a client.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0 }}>
            {BLOG_STATUS_FLOW.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', border: `2px solid ${STATUS_COLORS[i]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${STATUS_COLORS[i]}33`, background: `${STATUS_COLORS[i]}10` }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: STATUS_COLORS[i], fontFamily: "'Geist Mono', monospace" }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)' }}>{s}</span>
                </div>
                {i < BLOG_STATUS_FLOW.length - 1 && (
                  <div style={{ width: 'clamp(24px,4vw,60px)', height: 2, background: `linear-gradient(90deg, ${STATUS_COLORS[i]}, ${STATUS_COLORS[i + 1]})`, margin: '0 8px', marginBottom: 22, flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section id="features" style={{ padding: '80px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--brand)', marginBottom: 10 }}>Platform</p>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 12 }}>Everything You Need</h2>
            <p style={{ color: 'var(--ink-2)', fontSize: 15, maxWidth: 460, margin: '0 auto' }}>A complete suite of tools to manage every aspect of your SEO operations.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="feat-card" style={{ padding: '20px 22px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: 'var(--brand)' }}>
                  <Icon d={f.icon} d2={f.icon2} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--brand)', marginBottom: 10 }}>Workflow</p>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 12 }}>From Audit to Impact</h2>
            <p style={{ color: 'var(--ink-2)', fontSize: 15, maxWidth: 460, margin: '0 auto' }}>The complete SEO pipeline from client onboarding to measurable results.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 23, top: 28, bottom: 28, width: 2, background: 'linear-gradient(to bottom, var(--brand), transparent)', borderRadius: 99 }} />
            {WORKFLOW.map((w, i) => (
              <div key={w.step} style={{ display: 'flex', gap: 24, padding: '20px 0', position: 'relative' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--brand)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)', fontFamily: "'Geist Mono', monospace" }}>{w.step}</span>
                </div>
                <div style={{ paddingTop: 10 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 5 }}>{w.title}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.7 }}>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integrations ── */}
      <section style={{ padding: '60px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28, fontWeight: 500 }}>Connects with the tools your agency already uses</p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
            {[
              { name: 'WordPress', bg: '#21759b', l: 'W' },
              { name: 'Shopify', bg: '#96bf48', l: 'S' },
              { name: 'Google Search Console', bg: '#4285f4', l: 'G' },
              { name: 'Google Analytics', bg: '#e37400', l: 'A' },
              { name: 'OpenAI', bg: '#10a37f', l: 'O' },
              { name: 'Stripe', bg: '#635bff', l: 'S' },
            ].map((it) => (
              <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <span style={{ width: 20, height: 20, borderRadius: 5, background: it.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{it.l}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>{it.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--brand)', marginBottom: 10 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 12 }}>Plans for Every Agency</h2>
            <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>Simple, transparent pricing. No hidden fees. Cancel anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
            {PRICING.map((p) => (
              <div key={p.name} style={{ padding: 28, borderRadius: 14, border: p.hl ? '2px solid var(--brand)' : '1px solid var(--border)', background: p.hl ? 'rgba(39,160,106,0.05)' : 'var(--surface)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {p.badge && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', padding: '3px 12px', borderRadius: 99, background: 'var(--brand)', color: '#fff', fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{p.badge}</div>
                )}
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{p.name}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 20 }}>{p.desc}</p>
                <div style={{ marginBottom: 20 }}>
                  {p.price === 'Custom' ? (
                    <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink)', fontFamily: "'Geist Mono', monospace" }}>Custom</span>
                  ) : (
                    <>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-2)', verticalAlign: 'super' }}>$</span>
                      <span style={{ fontSize: 38, fontWeight: 800, color: 'var(--ink)', fontFamily: "'Geist Mono', monospace", lineHeight: 1 }}>{p.price}</span>
                      <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 4 }}>/mo</span>
                    </>
                  )}
                </div>
                <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '9px 16px', borderRadius: 8, background: p.hl ? 'var(--brand)' : 'var(--surface-2)', color: p.hl ? '#fff' : 'var(--ink)', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', marginBottom: 24, border: p.hl ? 'none' : '1px solid var(--border)' }}>
                  Get started
                </Link>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--ink-2)' }}>
                      <span style={{ color: 'var(--brand)', marginTop: 1, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '80px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(39,160,106,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 700, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16 }}>
            Run Your Entire SEO Agency{' '}
            <span style={{ background: 'linear-gradient(135deg, var(--brand) 0%, #6ee7b7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              From One Platform
            </span>
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Everything from audits to content, backlinks, rankings, AI visibility, approvals, and reporting.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', borderRadius: 10, background: 'var(--brand)', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 32px rgba(39,160,106,0.3)' }}>
              Start Free Trial
            </Link>
            <a href="#pricing" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', borderRadius: 10, border: '1px solid var(--border-2)', color: 'var(--ink-2)', fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>SB</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>SEO Brix</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>The AI-powered operating system for modern SEO agencies.</p>
            </div>
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              {[
                { title: 'Product', links: ['Features', 'Pricing', 'Integrations'] },
                { title: 'Company', links: ['About', 'Blog', 'Careers'] },
                { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 14 }}>{col.title}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {col.links.map((l) => (
                      <a key={l} href="#" style={{ fontSize: 13.5, color: 'var(--ink-2)', textDecoration: 'none' }}>{l}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>© 2026 SEO Brix. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <Link href="/login" style={{ fontSize: 12.5, color: 'var(--muted)', textDecoration: 'none' }}>Sign in</Link>
              <Link href="/login" style={{ fontSize: 12.5, color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}>Get Started →</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
