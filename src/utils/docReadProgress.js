const STORAGE_KEY = 'luda-log:doc-read-progress';
export const DOC_READ_PROGRESS_EVENT = 'luda-log:doc-read-progress';

export function normalizeDocPath(path) {
  if (!path) {
    return null;
  }

  try {
    const url = new URL(path, window.location.origin);
    return url.pathname.replace(/\/$/, '') || '/';
  } catch {
    return path.replace(/\/$/, '') || '/';
  }
}

export function getDocReadProgress() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getDocReadState(path) {
  const normalizedPath = normalizeDocPath(path);

  if (!normalizedPath) {
    return null;
  }

  return getDocReadProgress()[normalizedPath] || null;
}

export function setDocReadState(path, state) {
  if (typeof window === 'undefined') {
    return;
  }

  const normalizedPath = normalizeDocPath(path);

  if (!normalizedPath) {
    return;
  }

  const progress = getDocReadProgress();
  const previousState = progress[normalizedPath];

  if (previousState === 'completed' || previousState === state) {
    return;
  }

  progress[normalizedPath] = state;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(
    new CustomEvent(DOC_READ_PROGRESS_EVENT, {
      detail: {path: normalizedPath, state},
    }),
  );
}
