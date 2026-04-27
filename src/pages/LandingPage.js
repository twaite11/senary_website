import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AsteriskWave } from '../senary/AsteriskWave';
import { styles, LOADING_STEPS, TERMINAL_LOGS } from '../senary/styles';
import InvestorDeckModal from '../components/InvestorDeckModal';

const navLink = {
  color: '#6B6B6B',
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  textDecoration: 'none',
  borderBottom: '1px solid #E8E6E3',
  paddingBottom: '0.1rem',
};

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [investorModalOpen, setInvestorModalOpen] = useState(false);
  const [terminalText, setTerminalText] = useState('');

  useEffect(() => {
    const t1 = setTimeout(() => setLoadingStep(1), 900);
    const t2 = setTimeout(() => setLoadingStep(2), 1800);
    const t3 = setTimeout(() => setIsLoading(false), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    let i = 0;
    const interval = setInterval(() => {
      setTerminalText(TERMINAL_LOGS[i % TERMINAL_LOGS.length]);
      i += 1;
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!contactModalOpen && !investorModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setContactModalOpen(false);
        setInvestorModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [contactModalOpen, investorModalOpen]);

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
      <AsteriskWave />
      <div style={styles.content}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.logo}>[S6] SENARY BIO</h1>
            <p style={styles.tagline}>In Silico Precision // In Vivo Destruction</p>
          </div>
          <div style={styles.meta}>
            <p style={styles.metaLine}>
              <Link to="/blog" style={navLink}>
                Blog
              </Link>
            </p>
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
              The contrarian approach: We wield deep learning tools and the unique behavior of a novel class of
              CRISPR enzymes - often considered a liability - as a precision weapon against solid tumors.
            </p>
          </section>

          <section style={styles.ctaSection}>
            <p style={styles.ctaLabel}>In Silico Precision // In Vivo Destruction</p>
            <div style={styles.ctaRow}>
              <button type="button" onClick={() => setContactModalOpen(true)} style={styles.button}>
                Contact HQ
              </button>
              <button
                type="button"
                onClick={() => setInvestorModalOpen(true)}
                style={{
                  ...styles.pill,
                  cursor: 'pointer',
                  backgroundColor: '#FAF9F7',
                  fontFamily: 'inherit',
                }}
              >
                Investor deck
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

          <InvestorDeckModal open={investorModalOpen} onClose={() => setInvestorModalOpen(false)} />
        </main>

        <footer style={styles.footer}>
          <p style={styles.footerNote}>
            Proprietary &quot;Hybrid Cloud&quot; platform identifying and utilizing novel enzyme scaffolds to leverage
            the unique complexities of cancer cells against themselves.
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

export default LandingPage;
