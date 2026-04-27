const SESSION_KEY = 'senary_blog_admin';

function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

function trimEnv(value) {
  if (value == null || typeof value !== 'string') return '';
  return value.trim();
}

/** Admin username — set REACT_APP_BLOG_ADMIN_USER (and password) in .env.local / Vercel. */
export function getAdminCredentials() {
  const fromEnvUser = trimEnv(process.env.REACT_APP_BLOG_ADMIN_USER);
  const fromEnvPass = trimEnv(process.env.REACT_APP_BLOG_ADMIN_PASSWORD);
  const user = fromEnvUser || (isDevelopment() ? 'senary_editor' : '');
  const pass = fromEnvPass || (isDevelopment() ? 'local_only_change_me' : '');
  return { user, pass };
}

export function tryLogin(username, password) {
  const { user, pass } = getAdminCredentials();
  const u = String(username ?? '').trim();
  const p = String(password ?? '').trim();

  if (!user || !pass) {
    return {
      ok: false,
      error:
        'Blog admin is not wired into this build. In Vercel: add REACT_APP_BLOG_ADMIN_USER and REACT_APP_BLOG_ADMIN_PASSWORD (exact names, REACT_APP_ prefix), enable them for Production, then redeploy so a new build runs — CRA only reads these at build time.',
    };
  }
  if (u === user && p === pass) {
    sessionStorage.setItem(SESSION_KEY, '1');
    return { ok: true };
  }
  return {
    ok: false,
    error:
      'Invalid credentials. Check for extra spaces, correct capitalization, and that you are using the Production deployment if variables are only set for Production.',
  };
}

export function isAdminSession() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
}
