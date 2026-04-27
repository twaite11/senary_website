import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AsteriskWave } from '../senary/AsteriskWave';
import { styles, LOADING_STEPS, TERMINAL_LOGS } from '../senary/styles';
import InvestorDeckModal from '../components/InvestorDeckModal';
import { getAllPostsMerged, subscribeBlogChanged } from '../blog/storage';

const blogNavButton = {
  display: 'inline-block',
  color: '#1C1C1C',
  backgroundColor: '#FAF9F7',
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  textDecoration: 'none',
  padding: '0.65rem 1.25rem',
  border: '1px solid #1C1C1C',
  lineHeight: 1.2,
  transition: 'background-color 0.2s ease, color 0.2s ease',
};

function formatPostDate(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [investorModalOpen, setInvestorModalOpen] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);

  const reloadPosts = useCallback(() => {
    getAllPostsMerged().then(setBlogPosts);
  }, []);

  useEffect(() => {
    if (isLoading) return undefined;
    reloadPosts();
    return subscribeBlogChanged(reloadPosts);
  }, [isLoading, reloadPosts]);

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

  const pageScrollable = {
    ...styles.page,
    overflowX: 'hidden',
    overflowY: 'auto',
  };

  return (
    <div style={pageScrollable}>
      <AsteriskWave />
      <div style={styles.content}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.logo}>[S6] SENARY BIO</h1>
            <p style={styles.tagline}>In Silico Precision // In Vivo Destruction</p>
          </div>
          <div style={styles.meta}>
            <p style={{ ...styles.metaLine, marginBottom: '0.65rem' }}>
              <Link to="/blog" style={blogNavButton} className="blog-header-nav">
                Blog
              </Link>
            </p>
            <p style={styles.metaLine}>Phase: Pre-Seed / In Silico</p>
            <p style={styles.metaLine}>San Francisco, CA</p>
          </div>
        </header>

        <main style={{ ...styles.main, justifyContent: 'flex-start', paddingTop: '1rem' }}>
          <div
            style={{
              minHeight: 'min(78vh, 52rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
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
          </div>

          {blogPosts.length > 0 ? (
            <section
              style={{
                width: '100%',
                maxWidth: '56rem',
                margin: '0 auto',
                padding: '3rem 0 4rem',
                borderTop: '1px solid #E8E6E3',
              }}
              aria-label="Latest posts"
            >
              <p
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: '#6B6B6B',
                  margin: '0 0 1.75rem',
                }}
              >
                Scroll — latest writing
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {blogPosts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blog/${encodeURIComponent(p.slug)}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      border: '1px solid #E8E6E3',
                      backgroundColor: '#fff',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    className="landing-blog-card"
                  >
                    <div style={{ aspectRatio: '4 / 3', backgroundColor: '#E8E6E3', position: 'relative' }}>
                      {p.imageDataUrl ? (
                        <img
                          src={p.imageDataUrl}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#8A8A8A',
                          }}
                        >
                          S6
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1rem 1.1rem 1.15rem' }}>
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          letterSpacing: '-0.02em',
                          lineHeight: 1.25,
                          margin: '0 0 0.45rem',
                        }}
                      >
                        {p.title}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.65rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          color: '#6B6B6B',
                        }}
                      >
                        {formatPostDate(p.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

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
