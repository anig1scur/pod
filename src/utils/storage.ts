/**
 * storage.ts — lightweight localStorage helpers for play history & favorites.
 * No external dependencies. All data is stored locally in the browser.
 */

const HISTORY_KEY = 'pod_play_history';
const FAVORITES_KEY = 'pod_favorites';
const MAX_HISTORY = 50;

// ─── Types ────────────────────────────────────────────────────────────────────

export type HistoryEntry = {
  pid: string;
  eid: string;
  title: string;
  playedAt: number; // Unix ms timestamp
};

export type FavoriteEntry = {
  key: string;   // "pid:eid"
  title: string;
  addedAt: number;
};

// ─── History ──────────────────────────────────────────────────────────────────

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addHistory(entry: Omit<HistoryEntry, 'playedAt'>): void {
  try {
    let history = getHistory();
    history = history.filter(h => !(h.pid === entry.pid && h.eid === entry.eid));
    history.unshift({ ...entry, playedAt: Date.now() });
    if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore storage errors
  }
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export function getFavorites(): FavoriteEntry[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function isFavorite(key: string): boolean {
  return getFavorites().some(f => f.key === key);
}

/**
 * Toggle a favorite. Returns true if ADDED, false if REMOVED.
 */
export function toggleFavorite(key: string, title = ''): boolean {
  try {
    const favorites = getFavorites();
    const idx = favorites.findIndex(f => f.key === key);
    if (idx >= 0) {
      favorites.splice(idx, 1);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return false;
    } else {
      favorites.unshift({ key, title, addedAt: Date.now() });
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    }
  } catch {
    return false;
  }
}
