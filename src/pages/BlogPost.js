import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
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

const article = {
  maxWidth: '38rem',
  margin: '0 auto',
  padding: '2rem 0 4rem',
};

const heroImg = {
  width: '100%',
  maxHeight: '22rem',
  objectFit: 'cover',
  marginBottom: '2rem',
  border: '1px solid #E8E6E3',
};

const titleStyle = {
  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
  fontWeight: 600,
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
  margin: '0 0 1rem',
};

const meta = {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: '#6B6B6B',
  marginBottom: '2rem',
};

const bodyStyle = {
  fontSize: '1.0625rem',
  lineHeight: 1.75,
  color: '#3D3D3D',
  whiteSpace: 'pre-wrap',
  margin: 0,
};

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(() => {
    getAllPostsMerged().then((list) => {
      const decoded = slug ? decodeURIComponent(slug) : '';
      const found = list.find((p) => p.slug === decoded) || null;
      setPost(found);
      setLoaded(true);
    });
  }, [slug]);

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
            <p style={styles.tagline}>
              <Link to="/blog" style={{ color: '#6B6B6B', textDecoration: 'none' }} className="senary-subtle-link">
                ← Blog
              </Link>
            </p>
          </div>
          <div style={styles.meta}>
            <p style={styles.metaLine}>
              <Link to="/" style={navLink} className="senary-nav-link">
                Home
              </Link>
            </p>
          </div>
        </header>

        <main style={{ ...styles.main, justifyContent: 'flex-start' }}>
          {!loaded ? null : !post ? (
            <div style={article}>
              <h1 style={titleStyle}>Not found</h1>
              <p style={bodyStyle}>This post does not exist or was removed.</p>
              <p style={{ marginTop: '2rem' }}>
                <Link to="/blog" style={{ ...navLink, fontSize: '0.75rem' }} className="senary-nav-link">
                  All posts
                </Link>
              </p>
            </div>
          ) : (
            <article style={article}>
              {post.imageDataUrl ? <img src={post.imageDataUrl} alt="" style={heroImg} /> : null}
              <h1 style={titleStyle}>{post.title}</h1>
              <p style={meta}>{formatDate(post.createdAt)}</p>
              <p style={bodyStyle}>{post.body}</p>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
