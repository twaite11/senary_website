import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AsteriskWave } from '../senary/AsteriskWave';
import { styles } from '../senary/styles';
import {
  getAllPostsMerged,
  upsertLocalPost,
  buildSlug,
  makePostId,
  exportMergedForDeploy,
  subscribeBlogChanged,
} from '../blog/storage';
import { tryLogin, isAdminSession, logoutAdmin, getAdminCredentials } from '../blog/auth';

const navLink = {
  color: '#6B6B6B',
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  textDecoration: 'none',
  borderBottom: '1px solid #E8E6E3',
};

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
  maxWidth: '28rem',
  boxSizing: 'border-box',
  padding: '0.85rem 1rem',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  border: '1px solid #E8E6E3',
  backgroundColor: '#fff',
  color: '#1C1C1C',
  marginBottom: '1.25rem',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '12rem',
  resize: 'vertical',
  lineHeight: 1.6,
};

const hint = {
  fontSize: '0.7rem',
  lineHeight: 1.5,
  color: '#8A8A8A',
  maxWidth: '28rem',
  marginTop: '-0.75rem',
  marginBottom: '1.25rem',
};

const MAX_IMAGE_BYTES = 900 * 1024;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Could not read file'));
    r.readAsDataURL(file);
  });
}

export default function BlogAdmin() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => isAdminSession());
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [publishError, setPublishError] = useState('');
  const [publishOk, setPublishOk] = useState('');
  const [merged, setMerged] = useState([]);

  const reloadMerged = useCallback(() => {
    getAllPostsMerged().then(setMerged);
  }, []);

  useEffect(() => {
    reloadMerged();
    return subscribeBlogChanged(reloadMerged);
  }, [reloadMerged]);

  const onLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const result = tryLogin(user, pass);
    if (result.ok) {
      setSession(true);
      setPass('');
    } else {
      setLoginError(result.error || 'Login failed');
    }
  };

  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    setPublishError('');
    setPublishOk('');
    if (!file) {
      setImagePreview(null);
      setImageFileName('');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setPublishError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setPublishError('Image is too large (max about 900 KB). Use a smaller photo.');
      return;
    }
    try {
      const url = await readFileAsDataUrl(file);
      setImagePreview(url);
      setImageFileName(file.name);
    } catch {
      setPublishError('Could not read the image.');
    }
  };

  const onPublish = async (e) => {
    e.preventDefault();
    setPublishError('');
    setPublishOk('');
    const t = title.trim();
    if (!t) {
      setPublishError('Title is required.');
      return;
    }
    const b = body.trim();
    if (!b) {
      setPublishError('Body is required.');
      return;
    }
    if (!imagePreview) {
      setPublishError('Please add a cover photo.');
      return;
    }

    const list = await getAllPostsMerged();
    const slug = buildSlug(t, list);
    const now = new Date().toISOString();
    const post = {
      id: makePostId(),
      title: t,
      slug,
      body: b,
      imageDataUrl: imagePreview,
      createdAt: now,
      updatedAt: now,
    };
    upsertLocalPost(post);
    setTitle('');
    setBody('');
    setImagePreview(null);
    setImageFileName('');
    navigate(`/blog/${encodeURIComponent(slug)}`);
  };

  const onExportDeploy = async () => {
    const list = await getAllPostsMerged();
    exportMergedForDeploy(list);
    setPublishOk('Downloaded blog-posts.json — replace public/blog-posts.json in the repo and redeploy so everyone sees the same posts.');
  };

  const { user: credUser } = getAdminCredentials();
  const devHint =
    process.env.NODE_ENV === 'development' && credUser === 'senary_editor'
      ? 'Development default login: senary_editor / local_only_change_me (override with .env.local).'
      : null;

  return (
    <div style={styles.page}>
      <AsteriskWave />
      <div style={styles.content}>
        <header style={styles.header}>
          <div>
            <Link to="/" style={{ ...styles.logo, textDecoration: 'none', color: 'inherit', display: 'block' }}>
              [S6] SENARY BIO
            </Link>
            <p style={styles.tagline}>Publish</p>
          </div>
          <div style={styles.meta}>
            <p style={styles.metaLine}>
              <Link to="/blog" style={navLink}>
                Blog
              </Link>
            </p>
            <p style={styles.metaLine}>
              <Link to="/" style={navLink}>
                Home
              </Link>
            </p>
          </div>
        </header>

        <main style={{ ...styles.main, justifyContent: 'flex-start', maxWidth: '40rem' }}>
          {!session ? (
            <form onSubmit={onLogin} style={{ maxWidth: '22rem' }}>
              <h1 style={{ ...styles.headline, fontSize: 'clamp(1.35rem, 3vw, 2rem)', marginBottom: '1rem' }}>
                Admin
              </h1>
              {devHint ? <p style={hint}>{devHint}</p> : null}
              <label style={fieldLabel} htmlFor="blog-admin-user">
                Username
              </label>
              <input
                id="blog-admin-user"
                autoComplete="username"
                value={user}
                onChange={(ev) => setUser(ev.target.value)}
                style={inputStyle}
              />
              <label style={fieldLabel} htmlFor="blog-admin-pass">
                Password
              </label>
              <input
                id="blog-admin-pass"
                type="password"
                autoComplete="current-password"
                value={pass}
                onChange={(ev) => setPass(ev.target.value)}
                style={inputStyle}
              />
              {loginError ? (
                <p style={{ color: '#8b2942', fontSize: '0.85rem', marginBottom: '1rem' }}>{loginError}</p>
              ) : null}
              <button type="submit" style={styles.button}>
                Sign in
              </button>
            </form>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                <h1 style={{ ...styles.headline, fontSize: 'clamp(1.35rem, 3vw, 2rem)', margin: 0 }}>
                  New article
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    logoutAdmin();
                    setSession(false);
                  }}
                  style={{
                    ...styles.pill,
                    cursor: 'pointer',
                    background: 'transparent',
                    fontFamily: 'inherit',
                  }}
                >
                  Sign out
                </button>
              </div>

              <form onSubmit={onPublish}>
                <label style={fieldLabel} htmlFor="post-title">
                  Title
                </label>
                <input
                  id="post-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                />

                <label style={fieldLabel} htmlFor="post-body">
                  Body
                </label>
                <textarea id="post-body" value={body} onChange={(e) => setBody(e.target.value)} style={textareaStyle} />

                <label style={fieldLabel} htmlFor="post-photo">
                  Cover photo
                </label>
                <input id="post-photo" type="file" accept="image/*" onChange={onPickImage} style={{ marginBottom: '1rem' }} />
                {imageFileName ? (
                  <p style={{ ...hint, marginTop: 0 }}>{imageFileName}</p>
                ) : (
                  <p style={hint}>One image per article; keep files under ~900 KB so the browser can store them reliably.</p>
                )}
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt=""
                    style={{
                      width: '100%',
                      maxWidth: '28rem',
                      maxHeight: '14rem',
                      objectFit: 'cover',
                      border: '1px solid #E8E6E3',
                      marginBottom: '1.25rem',
                    }}
                  />
                ) : null}

                {publishError ? (
                  <p style={{ color: '#8b2942', fontSize: '0.85rem', marginBottom: '1rem' }}>{publishError}</p>
                ) : null}
                {publishOk ? (
                  <p style={{ ...hint, color: '#3d5a40', marginBottom: '1rem' }}>{publishOk}</p>
                ) : null}

                <button type="submit" style={styles.button}>
                  Publish article
                </button>
              </form>

              <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E8E6E3' }}>
                <p style={fieldLabel}>Deploy to all visitors</p>
                <p style={{ ...hint, maxWidth: '32rem' }}>
                  Posts you publish here are stored in this browser. To show the same posts to everyone after you deploy,
                  download the merged JSON and replace <code style={{ color: '#1C1C1C' }}>public/blog-posts.json</code>,
                  then commit and push.
                </p>
                <button type="button" onClick={onExportDeploy} style={{ ...styles.pill, cursor: 'pointer', background: 'transparent', fontFamily: 'inherit' }}>
                  Download blog-posts.json ({merged.length} posts)
                </button>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
