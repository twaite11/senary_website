import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AsteriskWave } from '../senary/AsteriskWave';
import { styles } from '../senary/styles';
import { getAllPostsMerged, subscribeBlogChanged } from '../blog/storage';

const navLink = {
  color: '#6B6B6B',
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  textDecoration: 'none',
  borderBottom: '1px solid #E8E6E3',
};

const listWrap = {
  width: '100%',
  maxWidth: '36rem',
  margin: '0 auto',
  padding: '2rem 0 4rem',
};

const postRow = {
  display: 'block',
  padding: '1.25rem 0',
  borderBottom: '1px solid #E8E6E3',
  textDecoration: 'none',
  color: 'inherit',
};

const postTitle = {
  fontSize: '1.125rem',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  margin: '0 0 0.35rem',
};

const postMeta = {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: '#6B6B6B',
  margin: 0,
};

function formatDate(iso) {
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

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  const reload = useCallback(() => {
    getAllPostsMerged().then(setPosts);
  }, []);

  useEffect(() => {
    reload();
    return subscribeBlogChanged(reload);
  }, [reload]);

  return (
    <div style={styles.page}>
      <AsteriskWave />
      <div style={styles.content}>
        <header style={styles.header}>
          <div>
            <Link
              to="/"
              style={{ ...styles.logo, textDecoration: 'none', color: 'inherit', display: 'block' }}
              className="senary-logo-link"
            >
              [S6] SENARY BIO
            </Link>
            <p style={styles.tagline}>Notes // Lab</p>
          </div>
          <div style={styles.meta}>
            <p style={styles.metaLine}>
              <Link to="/" style={navLink} className="senary-nav-link">
                Home
              </Link>
            </p>
            <p style={styles.metaLine}>
              <Link to="/blog/admin" style={navLink} className="senary-nav-link">
                Publish
              </Link>
            </p>
          </div>
        </header>

        <main style={{ ...styles.main, justifyContent: 'flex-start' }}>
          <h1 style={{ ...styles.headline, fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '0.5rem' }}>
            Blog
          </h1>
          <p
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#6B6B6B',
              marginBottom: '2rem',
            }}
          >
            In silico updates
          </p>

          <div style={listWrap}>
            {posts.length === 0 ? (
              <p style={{ ...styles.body, borderLeft: 'none', paddingLeft: 0, fontSize: '0.95rem' }}>
                No posts yet. Use Publish (admin) to add one.
              </p>
            ) : (
              posts.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${encodeURIComponent(p.slug)}`}
                  style={postRow}
                  className="senary-blog-row"
                >
                  <h2 style={postTitle}>{p.title}</h2>
                  <p style={postMeta}>{formatDate(p.createdAt)}</p>
                </Link>
              ))
            )}
          </div>
        </main>

        <footer style={{ ...styles.footer, borderTop: '1px solid #E8E6E3', paddingTop: '1.5rem' }}>
          <p style={styles.footerNote}>Senary Bio — minimal signal, maximum clarity.</p>
        </footer>
      </div>
    </div>
  );
}
