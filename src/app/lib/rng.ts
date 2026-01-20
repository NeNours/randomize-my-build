/**
 * rng.ts — Seeded (déterministe) Random Utilities
 *
 * But : avoir du hasard reproductible.
 * Même seed → mêmes résultats.
 */

/**
 * xmur3 :
 * Transforme une string (seed) en un état numérique.
 * Étape 1 du pipeline RNG.
 */
export function xmur3(str: string) {
  let h = 1779033703 ^ str.length;

  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  // Retourne une fonction qui génère des entiers pseudo-aléatoires
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

/**
 * mulberry32 :
 * Transforme un état numérique en une fonction rng() → nombre entre 0 et 1.
 * Étape 2 du pipeline RNG.
 */
export function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * makeRng :
 * Crée un RNG déterministe à partir d’un seed.
 * C’est la fonction principale utilisée par le générateur.
 */
export function makeRng(seed: string) {
  const seedFn = xmur3(seed);
  return mulberry32(seedFn());
}

/**
 * randomSeed :
 * Génère un seed court, lisible et suffisant pour ce projet.
 */
export function randomSeed() {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${time}-${rand}`;
}

/**
 * pickWeighted :
 * Sélectionne une valeur aléatoirement selon des poids.
 * Ex: [{A, w:10}, {B, w:1}] → A sort ~10x plus souvent que B.
 */
export function pickWeighted<T>(
  rng: () => number,
  items: Array<{ value: T; w: number }>
) {
  const total = items.reduce((s, it) => s + Math.max(0, it.w), 0);
  if (total <= 0) return items[0]?.value;

  let r = rng() * total;

  for (const it of items) {
    r -= Math.max(0, it.w);
    if (r <= 0) return it.value;
  }

  return items[items.length - 1].value;
}
