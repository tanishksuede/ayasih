// Session persistence utility — dual localStorage/sessionStorage fallback (Safari Private Mode safe)

const KEYS = {
  userId: 'aya_user_id',
  mobile: 'aya_user_mobile',
  name: 'aya_user_name',
  age: 'aya_user_age',
  quizDone: 'aya_quiz_done',
};

const safeSet = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch {}
  try { sessionStorage.setItem(key, value); } catch {}
};

const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch {
    try { return sessionStorage.getItem(key); } catch { return null; }
  }
};

const safeRemove = (key: string) => {
  try { localStorage.removeItem(key); } catch {}
  try { sessionStorage.removeItem(key); } catch {}
};

export const saveSession = (user: { id: string; mobile: string; name: string; age: number; username?: string }) => {
  safeSet(KEYS.userId, user.id);
  safeSet(KEYS.mobile, user.mobile);
  safeSet(KEYS.name, user.name);
  safeSet(KEYS.age, String(user.age));
  console.log('[Session] Saved:', user.id);
};

export const getSession = () => ({
  userId: safeGet(KEYS.userId),
  mobile: safeGet(KEYS.mobile),
  name: safeGet(KEYS.name),
  age: Number(safeGet(KEYS.age) || 0),
});

export const clearSession = () => {
  Object.values(KEYS).forEach(safeRemove);
  console.log('[Session] Cleared.');
};

export const clearAllUserData = () => {
  clearSession();
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('aya_') || k === 'user-storage')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    localStorage.clear();
  } catch {}

  try {
    const sessionKeys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && (k.startsWith('aya_') || k === 'user-storage')) {
        sessionKeys.push(k);
      }
    }
    sessionKeys.forEach((k) => sessionStorage.removeItem(k));
    sessionStorage.clear();
  } catch {}
  console.log('[Session] All user data cleared from local and session storage.');
};

export const markQuizDone = () => {
  safeSet(KEYS.quizDone, 'true');
};

export const isQuizDone = (): boolean => safeGet(KEYS.quizDone) === 'true';

export function getSessionId(): string {
  const key = 'aya_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

