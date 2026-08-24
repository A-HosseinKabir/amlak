// src/utils/storage.ts

/**
 * مدیریت متمرکز localStorage
 * تمام کلیدهای localStorage در اینجا تعریف می‌شوند
 */
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  BOOKMARKS: 'saved_property_ids',
  HISTORY: 'viewed_properties_history',
  VISIT_REQUESTS: 'visit_requests',
} as const;

export const storage = {
  // --- Auth ---
  getToken: (): string | null => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  setToken: (token: string) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  removeToken: () => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),

  getUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: any) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(STORAGE_KEYS.USER),

  // --- Theme ---
  getTheme: (): 'dark' | 'light' => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'light' ? 'light' : 'dark'; // پیش‌فرض dark
  },
  setTheme: (theme: 'dark' | 'light') => localStorage.setItem(STORAGE_KEYS.THEME, theme),

  // --- Bookmarks ---
  getBookmarkIds: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  setBookmarkIds: (ids: string[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(ids));
  },
  toggleBookmark: (propertyId: string): boolean => {
    const ids = storage.getBookmarkIds();
    const index = ids.indexOf(propertyId);
    if (index > -1) {
      ids.splice(index, 1);
      storage.setBookmarkIds(ids);
      return false; // removed
    } else {
      ids.push(propertyId);
      storage.setBookmarkIds(ids);
      return true; // added
    }
  },

  // --- History ---
  getHistoryIds: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  addToHistory: (propertyId: string): void => {
    let history = storage.getHistoryIds();
    history = history.filter(id => id !== propertyId);
    history.unshift(propertyId);
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },
  clearHistory: () => localStorage.removeItem(STORAGE_KEYS.HISTORY),

  // --- Visit Requests ---
  getVisitRequests: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VISIT_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  setVisitRequests: (requests: any[]) => {
    localStorage.setItem(STORAGE_KEYS.VISIT_REQUESTS, JSON.stringify(requests));
  },
};