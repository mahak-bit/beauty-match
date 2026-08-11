"use client";

// ---------------------------------------------------------------------------
// Client-side "Beauty Shelf" persistence — saved products, the compare
// list, recently viewed products, and saved routines. There's no auth
// system in this app yet (see README), so this is intentionally
// localStorage-backed rather than a fake account system. Swap for a real
// per-user store once auth exists — the hook API below is the seam.
//
// Reads go through useSyncExternalStore (the React-recommended way to
// subscribe to state that lives outside React, like localStorage) rather
// than useEffect+setState, so there's no post-mount flash and no
// server/client hydration mismatch.
// ---------------------------------------------------------------------------
import { useCallback, useSyncExternalStore } from "react";
import type { UserPreferences } from "@/lib/types";

const KEYS = {
  saved: "bm:saved-products",
  compare: "bm:compare-list",
  recent: "bm:recently-viewed",
  routines: "bm:routines",
  profile: "bm:profile",
  draftRoutine: "bm:draft-routine",
} as const;

const EVENT = "bm:store-change";

// Cached parsed values, keyed by storage key — useSyncExternalStore requires
// getSnapshot to return a referentially stable value when nothing changed.
const cache = new Map<string, unknown>();

function readFresh<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getSnapshot<T>(key: string, fallback: T): T {
  if (!cache.has(key)) cache.set(key, readFresh(key, fallback));
  return cache.get(key) as T;
}

function getServerSnapshot<T>(fallback: T): T {
  return fallback;
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  cache.set(key, value);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

function subscribe(key: string, onChange: () => void) {
  const handler = (e: Event) => {
    const custom = e as CustomEvent;
    if (!custom.detail || custom.detail === key) {
      cache.delete(key);
      onChange();
    }
  };
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function useStoredValue<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    useCallback((onChange) => subscribe(key, onChange), [key]),
    () => getSnapshot(key, fallback),
    () => getServerSnapshot(fallback)
  );
}

export function useSavedProducts() {
  const ids = useStoredValue<string[]>(KEYS.saved, []);

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback((id: string) => {
    const current = readFresh<string[]>(KEYS.saved, []);
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    write(KEYS.saved, next);
  }, []);

  return { savedIds: ids, isSaved, toggle };
}

export function useCompareList() {
  const ids = useStoredValue<string[]>(KEYS.compare, []);

  const isInCompare = useCallback((id: string) => ids.includes(id), [ids]);
  const add = useCallback((id: string) => {
    const current = readFresh<string[]>(KEYS.compare, []);
    if (current.includes(id) || current.length >= 4) return;
    write(KEYS.compare, [...current, id]);
  }, []);
  const remove = useCallback((id: string) => {
    write(KEYS.compare, readFresh<string[]>(KEYS.compare, []).filter((x) => x !== id));
  }, []);
  const toggle = useCallback((id: string) => {
    const current = readFresh<string[]>(KEYS.compare, []);
    if (current.includes(id)) write(KEYS.compare, current.filter((x) => x !== id));
    else if (current.length < 4) write(KEYS.compare, [...current, id]);
  }, []);
  const clear = useCallback(() => write(KEYS.compare, []), []);

  return { compareIds: ids, isInCompare, add, remove, toggle, clear };
}

export function useRecentlyViewed() {
  const ids = useStoredValue<string[]>(KEYS.recent, []);

  const record = useCallback((id: string) => {
    const current = readFresh<string[]>(KEYS.recent, []).filter((x) => x !== id);
    write(KEYS.recent, [id, ...current].slice(0, 12));
  }, []);

  return { recentIds: ids, record };
}

export type SavedRoutine = {
  id: string;
  name: string;
  am: string[]; // product ids
  pm: string[]; // product ids
  createdAt: number;
};

export function useRoutines() {
  const routines = useStoredValue<SavedRoutine[]>(KEYS.routines, []);

  const save = useCallback((routine: Omit<SavedRoutine, "id" | "createdAt">) => {
    const current = readFresh<SavedRoutine[]>(KEYS.routines, []);
    const next: SavedRoutine = { ...routine, id: crypto.randomUUID(), createdAt: Date.now() };
    write(KEYS.routines, [next, ...current]);
    return next;
  }, []);
  const remove = useCallback((id: string) => {
    write(KEYS.routines, readFresh<SavedRoutine[]>(KEYS.routines, []).filter((r) => r.id !== id));
  }, []);

  return { routines, save, remove };
}

/**
 * The person's last-completed quiz profile — the input to the match engine
 * everywhere outside the quiz itself (product pages, discover ranking).
 * There's no account system, so "your match score" persists per-browser
 * until they retake the quiz, rather than being faked.
 */
export function useUserProfile() {
  const profile = useStoredValue<UserPreferences | null>(KEYS.profile, null);
  // Distinguishes "no profile yet" from "still on the server snapshot" so
  // callers can render a loading placeholder instead of flashing the
  // logged-out state before the client value is known.
  const loaded = useSyncExternalStore(
    useCallback((onChange) => subscribe(KEYS.profile, onChange), []),
    () => true,
    () => false
  );

  const setProfile = useCallback((next: UserPreferences) => write(KEYS.profile, next), []);
  const clearProfile = useCallback(() => write(KEYS.profile, null), []);

  return { profile, loaded, setProfile, clearProfile };
}

export type DraftRoutine = { am: string[]; pm: string[] };
const EMPTY_DRAFT: DraftRoutine = { am: [], pm: [] };

/** The in-progress AM/PM routine being built — product pages add to it, /routines edits and saves it. */
export function useDraftRoutine() {
  const draft = useStoredValue<DraftRoutine>(KEYS.draftRoutine, EMPTY_DRAFT);

  const addToSlot = useCallback((productId: string, slot: "am" | "pm") => {
    const current = readFresh<DraftRoutine>(KEYS.draftRoutine, EMPTY_DRAFT);
    if (current[slot].includes(productId)) return;
    write(KEYS.draftRoutine, { ...current, [slot]: [...current[slot], productId] });
  }, []);

  const removeFromSlot = useCallback((productId: string, slot: "am" | "pm") => {
    const current = readFresh<DraftRoutine>(KEYS.draftRoutine, EMPTY_DRAFT);
    write(KEYS.draftRoutine, { ...current, [slot]: current[slot].filter((id) => id !== productId) });
  }, []);

  const clearDraft = useCallback(() => write(KEYS.draftRoutine, EMPTY_DRAFT), []);

  return { draft, addToSlot, removeFromSlot, clearDraft };
}
