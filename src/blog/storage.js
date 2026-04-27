const STORAGE_KEY = 'senary_blog_posts_v1';
export const BLOG_CHANGED = 'senary-blog-changed';

function notifyChanged() {
  window.dispatchEvent(new CustomEvent(BLOG_CHANGED));
}

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  notifyChanged();
}

export function slugify(title) {
  return String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'post';
}

function uniqueSlug(base, existingSlugs) {
  let s = base;
  let n = 0;
  while (existingSlugs.has(s)) {
    n += 1;
    s = `${base}-${n}`;
  }
  return s;
}

/** Merge static JSON (deployed) with local drafts; same id → keep newer updatedAt. */
export function mergePostLists(staticPosts, localPosts) {
  const byId = new Map();
  const add = (p) => {
    if (!p || !p.id) return;
    const prev = byId.get(p.id);
    if (!prev) {
      byId.set(p.id, p);
      return;
    }
    const tPrev = new Date(prev.updatedAt || prev.createdAt || 0).getTime();
    const tNext = new Date(p.updatedAt || p.createdAt || 0).getTime();
    byId.set(p.id, tNext >= tPrev ? p : prev);
  };
  (staticPosts || []).forEach(add);
  (localPosts || []).forEach(add);
  return [...byId.values()].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  );
}

export async function fetchStaticPosts() {
  try {
    const res = await fetch(`${process.env.PUBLIC_URL || ''}/blog-posts.json`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getAllPostsMerged() {
  const [staticPosts, localPosts] = await Promise.all([fetchStaticPosts(), Promise.resolve(readLocal())]);
  return mergePostLists(staticPosts, localPosts);
}

export function getLocalPostsOnly() {
  return readLocal();
}

export function upsertLocalPost(post) {
  const posts = readLocal();
  const next = [post, ...posts.filter((p) => p.id !== post.id)];
  writeLocal(next);
  return post;
}

export function deleteLocalPost(id) {
  const posts = readLocal().filter((p) => p.id !== id);
  writeLocal(posts);
}

export function exportMergedForDeploy(mergedPosts) {
  const body = JSON.stringify(mergedPosts, null, 2);
  const blob = new Blob([body], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'blog-posts.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function subscribeBlogChanged(handler) {
  window.addEventListener(BLOG_CHANGED, handler);
  return () => window.removeEventListener(BLOG_CHANGED, handler);
}

export function makePostId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function buildSlug(title, mergedPosts) {
  const base = slugify(title);
  const slugs = new Set((mergedPosts || []).map((p) => p.slug));
  return uniqueSlug(base, slugs);
}
