import React, { useState, useEffect } from 'react';

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: '#FAF9F7',
    color: '#1C1C1C',
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    flexDirection: 'column',
    padding: 'clamp(1.5rem, 5vw, 4rem)',
    overflow: 'hidden',
  },
  asteriskWave: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
    overflow: 'hidden',
  },
  asteriskRow: (offset, color, delay) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    transform: `translateX(${offset}px)`,
    fontSize: '7px',
    letterSpacing: '0.35em',
    color,
    whiteSpace: 'nowrap',
    fontFamily: 'monospace',
    animation: 'asterisk-row-pulse 2.8s ease-in-out infinite',
    animationDelay: `${delay}s`,
  }),
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #E8E6E3',
    marginBottom: 'auto',
  },
  logo: {
    fontSize: '1.125rem',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    margin: 0,
  },
  tagline: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#6B6B6B',
    marginTop: '0.25rem',
    margin: 0,
  },
  meta: {
    textAlign: 'right',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#6B6B6B',
    margin: 0,
  },
  metaLine: { margin: '0.15rem 0' },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '42rem',
    margin: '0 auto',
    padding: '3rem 0',
  },
  headline: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 600,
    letterSpacing: '-0.03em',
    lineHeight: 1.05,
    marginBottom: '2rem',
    marginTop: 0,
  },
  headlineAccent: {
    display: 'inline-block',
    backgroundColor: '#1C1C1C',
    color: '#FAF9F7',
    padding: '0.15em 0.4em',
    marginTop: '0.2em',
  },
  body: {
    fontSize: '1.0625rem',
    lineHeight: 1.7,
    color: '#3D3D3D',
    maxWidth: '36rem',
    borderLeft: '3px solid #E8E6E3',
    paddingLeft: '1.5rem',
    margin: 0,
  },
  ctaSection: {
    marginTop: '3rem',
  },
  ctaLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#6B6B6B',
    marginBottom: '1rem',
  },
  ctaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#1C1C1C',
    color: '#FAF9F7',
    padding: '1rem 2rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  pill: {
    padding: '1rem 2rem',
    border: '1px solid #E8E6E3',
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#6B6B6B',
  },
  footer: {
    paddingTop: '2.5rem',
    borderTop: '1px solid #E8E6E3',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '2rem',
  },
  footerNote: {
    fontSize: '0.65rem',
    lineHeight: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#8A8A8A',
    maxWidth: '16rem',
    margin: 0,
  },
  terminal: {
    width: '100%',
    maxWidth: '20rem',
    backgroundColor: '#2C2C2C',
    color: '#C8E6C9',
    padding: '1.25rem',
    fontSize: '0.7rem',
    fontFamily: '"DM Sans", monospace',
    letterSpacing: '0.05em',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  terminalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '0.5rem',
    marginBottom: '0.75rem',
    borderBottom: '1px solid rgba(200,230,201,0.3)',
  },
  terminalDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#C8E6C9',
    opacity: 0.9,
  },
  // Loading screen
  loader: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#0a0a0a',
    color: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    fontFamily: '"DM Sans", monospace',
    transition: 'opacity 0.5s ease-out',
  },
  loaderInner: {
    textAlign: 'left',
    padding: '2rem',
  },
  loaderLine: {
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    fontWeight: 500,
  },
  loaderCursor: {
    display: 'inline-block',
    width: '2px',
    height: '1em',
    backgroundColor: '#fafafa',
    marginLeft: '2px',
    verticalAlign: 'text-bottom',
    animation: 'loader-blink 1s step-end infinite',
  },
  // Contact modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '1.5rem',
  },
  modalBox: {
    backgroundColor: '#FAF9F7',
    color: '#1C1C1C',
    padding: '2rem 2.5rem',
    maxWidth: '22rem',
    boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
    position: 'relative',
    border: '1px solid #E8E6E3',
  },
  modalClose: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    color: '#6B6B6B',
    cursor: 'pointer',
    padding: '0.25rem',
    lineHeight: 1,
  },
  modalText: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: '#3D3D3D',
    margin: 0,
  },
  modalEmail: {
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
  modalEmailLink: {
    color: '#1C1C1C',
    fontWeight: 600,
    textDecoration: 'underline',
  },
};

const LOADING_STEPS = ['> IDENTIFYING_SENARY_SYSTEM...', '> VALIDATING_SCAFFOLDS...', '> READY.'];

const TERMINAL_LOGS = [
  'INITIATING NCBI_MINER...',
  'SCANNING METAGENOMIC DATABASES...',
  'SCAFFOLD IDENTIFIED: SB-13D-09',
  'VALIDATING HEPN DOMAINS...',
  'MATCHMAKER: SCANNING TCGA FUSION EVENTS...',
  'LEAD CANDIDATE: SPSB4-ACPL2',
  'PFS STATUS: VALIDATED',
  'ENCRYPTING STEALTH_MODE...',
];

const SenaryLandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [terminalText, setTerminalText] = useState('');

  useEffect(() => {
    const t1 = setTimeout(() => setLoadingStep(1), 900);
    const t2 = setTimeout(() => setLoadingStep(2), 1800);
    const t3 = setTimeout(() => setIsLoading(false), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    let i = 0;
    const interval = setInterval(() => {
      setTerminalText(TERMINAL_LOGS[i % TERMINAL_LOGS.length]);
      i++;
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!contactModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setContactModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [contactModalOpen]);

  const asteriskLine = ' * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ';
  const waveRows = 38;
  const amplitude = 45;
  const gradientColor = (i) => {
    const t = i / (waveRows - 1);
    const r = Math.round(28 + (138 - 28) * t);
    const g = Math.round(28 + (138 - 28) * t);
    const b = Math.round(28 + (138 - 28) * t);
    return `rgb(${r},${g},${b})`;
  };

  if (isLoading) {
    return (
      <div style={styles.loader} aria-hidden>
        <div style={styles.loaderInner}>
          <div style={styles.loaderLine}>
            {LOADING_STEPS[loadingStep]}
            <span style={styles.loaderCursor} aria-hidden />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.asteriskWave} aria-hidden>
        {Array.from({ length: waveRows }, (_, i) => (
          <div
            key={i}
            style={{
              ...styles.asteriskRow(Math.sin(i * 0.35) * amplitude, gradientColor(i), i * 0.065),
              top: `${(i / waveRows) * 100}%`,
            }}
          >
            {asteriskLine}
          </div>
        ))}
      </div>
      <div style={styles.content}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.logo}>[S6] SENARY BIO</h1>
          <p style={styles.tagline}>In Silico Precision // In Vivo Destruction</p>
        </div>
        <div style={styles.meta}>
          <p style={styles.metaLine}>Phase: Pre-Seed / In Silico</p>
          <p style={styles.metaLine}>San Francisco, CA</p>
        </div>
      </header>

      <main style={styles.main}>
        <section>
          <h2 style={styles.headline}>
            REPROGRAMMING
            <br />
            <span style={styles.headlineAccent}>COLLATERAL DAMAGE</span>
          </h2>
          <p style={styles.body}>
            The contrarion approach: We are weaponizing the greatest "bug" of a novel enzyme class into a precision weapon against solid tumors.
            By harnessing conditional collateral RNA degradation, we create irreversible suicide switches
            triggered only by tumor-specific fusion transcripts.
          </p>
        </section>

        <section style={styles.ctaSection}>
          <p style={styles.ctaLabel}>— Open for Technical Partnerships</p>
          <div style={styles.ctaRow}>
            <button type="button" onClick={() => setContactModalOpen(true)} style={styles.button}>
              Contact HQ
            </button>
            <div style={styles.pill}>Status: Stealth Mode</div>
          </div>
        </section>

        {contactModalOpen && (
          <div
            style={styles.modalOverlay}
            onClick={() => setContactModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                style={styles.modalClose}
                onClick={() => setContactModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
              <p id="contact-modal-title" style={styles.modalText}>
                Actively seeking funding and partnerships.
              </p>
              <p style={{ ...styles.modalText, ...styles.modalEmail }}>
                Email us:{' '}
                <a href="mailto:tyco711@gmail.com" style={styles.modalEmailLink}>
                  tyco711@gmail.com
                </a>
              </p>
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerNote}>
          Proprietary "Hybrid Cloud" platform identifying and utilizing novel enzyme scaffolds to 
          leverage the unique complexities of cancer cells against themselves. 
        </p>
        <div style={styles.terminal}>
          <div style={styles.terminalHeader}>
            <span>MATCHMAKER_V1.0</span>
            <span style={styles.terminalDot} />
          </div>
          <p style={{ margin: 0, minHeight: '1.25rem' }}>&gt; {terminalText}</p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default SenaryLandingPage;
