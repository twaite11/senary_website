const SESSION_KEY = 'senary_blog_admin';

function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

/** Admin username — set REACT_APP_BLOG_ADMIN_USER (and password) in .env.local / Vercel. */
export function getAdminCredentials() {
  const user =
    process.env.REACT_APP_BLOG_ADMIN_USER || (isDevelopment() ? 'senary_editor' : '');
  const pass =
    process.env.REACT_APP_BLOG_ADMIN_PASSWORD || (isDevelopment() ? 'local_only_change_me' : '');
  return { user, pass };
}

export function tryLogin(username, password) {
  const { user, pass } = getAdminCredentials();
  if (!user || !pass) {
    return {
      ok: false,
      error:
        'Blog admin is not configured. Set REACT_APP_BLOG_ADMIN_USER and REACT_APP_BLOG_ADMIN_PASSWORD in your environment (see .env.example).',
    };
  }
  if (username === user && password === pass) {
    sessionStorage.setItem(SESSION_KEY, '1');
    return { ok: true };
  }
  return { ok: false, error: 'Invalid credentials.' };
}

export function isAdminSession() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
}
