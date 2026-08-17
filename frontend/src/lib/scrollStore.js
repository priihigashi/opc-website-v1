if (typeof window !== "undefined" && !window.__scrollStore) {
  window.__scrollStore = { p: 0, intro: 0, lenis: null };
}

export const scrollStore =
  typeof window !== "undefined" ? window.__scrollStore : { p: 0, intro: 0, lenis: null };
