import React, { useEffect, useState } from 'react';
import { styles } from '../senary/styles';

const fieldLabel = {
  display: 'block',
  fontSize: '0.65rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: '#6B6B6B',
  marginBottom: '0.5rem',
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.85rem 1rem',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  border: '1px solid #E8E6E3',
  backgroundColor: '#fff',
  color: '#1C1C1C',
  marginBottom: '1.1rem',
};

const hint = {
  fontSize: '0.75rem',
  lineHeight: 1.55,
  color: '#6B6B6B',
  margin: '0 0 1.25rem',
};

const modalWide = {
  ...styles.modalBox,
  maxWidth: '26rem',
};

function pitchDeckUrl() {
  const fromEnv = (process.env.REACT_APP_PITCH_DECK_URL || '').trim();
  if (fromEnv) return fromEnv;
  const base = process.env.PUBLIC_URL || '';
  return `${base}/senary-pitch-deck.pdf`;
}

async function submitLead(name, email) {
  const res = await fetch('/api/investor-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });

  if (res.ok) return { ok: true };

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev && (res.status === 404 || res.status === 405)) {
    return { ok: true, devBypass: true };
  }

  let message = 'Something went wrong. Please try again or email us directly.';
  try {
    const data = await res.json();
    if (data && data.error) message = data.error;
  } catch {
    /* ignore */
  }
  return { ok: false, error: message };
}

export default function InvestorDeckModal({ open, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [devNote, setDevNote] = useState(false);

  useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setStep('form');
      setSubmitting(false);
      setError('');
      setDevNote(false);
    }
  }, [open]);

  if (!open) return null;

  const deckUrl = pitchDeckUrl();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const n = name.trim();
    const em = email.trim();
    if (!n || !em) {
      setError('Please enter your name and email.');
      return;
    }
    setSubmitting(true);
    const result = await submitLead(n, em);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || 'Submission failed.');
      return;
    }
    if (result.devBypass) setDevNote(true);
    setStep('success');
  };

  return (
    <div
      style={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="investor-modal-title"
    >
      <div style={modalWide} onClick={(ev) => ev.stopPropagation()}>
        <button type="button" style={styles.modalClose} onClick={onClose} aria-label="Close">
          ×
        </button>

        {step === 'form' ? (
          <>
            <h2 id="investor-modal-title" style={{ ...styles.logo, marginBottom: '0.75rem', fontSize: '1rem' }}>
              Investor deck
            </h2>
            <p style={hint}>
              Leave your name and email. You will get immediate access to our pitch deck (PDF).
            </p>
            <form onSubmit={onSubmit}>
              <label style={fieldLabel} htmlFor="investor-name">
                Name
              </label>
              <input
                id="investor-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                style={inputStyle}
              />
              <label style={fieldLabel} htmlFor="investor-email">
                Email
              </label>
              <input
                id="investor-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                style={inputStyle}
              />
              {error ? (
                <p style={{ color: '#8b2942', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
              ) : null}
              <button type="submit" style={styles.button} disabled={submitting}>
                {submitting ? 'Sending…' : 'View pitch deck'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 id="investor-modal-title" style={{ ...styles.logo, marginBottom: '0.75rem', fontSize: '1rem' }}>
              Thank you
            </h2>
            <p style={{ ...styles.modalText, marginBottom: '1.25rem' }}>
              Your deck is ready. Use the button below to open the PDF in a new tab.
            </p>
            {devNote ? (
              <p style={{ ...hint, fontSize: '0.7rem', color: '#8A8A8A' }}>
                Local dev: API route is unavailable on the CRA dev server; the deck still opened for testing.
              </p>
            ) : null}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <a
                href={deckUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.button}
                onClick={() => onClose()}
              >
                Open pitch deck
              </a>
              <button
                type="button"
                onClick={onClose}
                style={{
                  ...styles.pill,
                  cursor: 'pointer',
                  background: 'transparent',
                  fontFamily: 'inherit',
                }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
