// localStorage utility for play history and favorites

const HISTORY_KEY = 'pod_history';
const FAVORITES_KEY = 'pod_favorites';
const MAX_HISTORY = 50;

export type HistoryEntry = {
  pid: string;
  eid: string;
  title: string;
  playedAt: string; // ISO timestamp
};

// ── Play History ─────────────────────────────────────────────────────────────

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addHistory(entry: Omit<HistoryEntry, 'playedAt'>): void {
  const history = getHistory().filter(h => !(h.pid === entry.pid && h.eid === entry.eid));
  history.unshift({ ...entry, playedAt: new Date().toISOString() });
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ── Favorites ────────────────────────────────────────────────────────────────

export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Toggle a favorite by its key (format: "pid:eid").
 * Returns true if the item was added, false if removed.
 */
export function toggleFavorite(key: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(key);
  if (idx >= 0) {
    favs.splice(idx, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    return false;
  } else {
    favs.unshift(key);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    return true;
  }
}

export function isFavorite(key: string): boolean {
  return getFavorites().includes(key);
}
