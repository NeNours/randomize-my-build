/**
 * generator.ts — Build generator core
 *
 * Responsabilités :
 * - Construire un build déterministe à partir d’un seed
 * - Appliquer les règles (starter, boots max 1, etc.)
 * - Générer un code partageable (publicId)
 * - Rejouer un build à partir d’un publicId
 */

import type { BuildInput, BuildResult, Champion, GameId, Item, Role } from "./types";
import { decodePublicId, encodePublicId } from "./codec";
import { makeRng, pickWeighted, randomSeed } from "./rng";
import { LOL_CHAMPIONS, LOL_ITEMS, LOL_ROLES } from "../games/lol/data";
import {
  isJungleStarter,
  isSupportStarter,
  requiresJungleStarter,
  requiresSupportStarter,
} from "../games/lol/rules";
import { itemWeightForContext } from "../games/lol/weights";

/**
 * GameDef : description minimale d’un jeu supporté.
 * (Utile pour ajouter d’autres jeux plus tard.)
 */
type GameDef = {
  id: GameId;
  roles: Role[];
  champions: Champion[];
  items: Item[];
};

/**
 * Registry des jeux supportés.
 * MVP : seulement LoL pour l’instant.
 */
const GAMES: Record<GameId, GameDef> = {
  lol: {
    id: "lol",
    roles: LOL_ROLES,
    champions: LOL_CHAMPIONS,
    items: LOL_ITEMS,
  },
};

function getGame(gameId: GameId) {
  return GAMES[gameId];
}

function findChampion(gameId: GameId, championId: string) {
  const game = getGame(gameId);
  return game.champions.find((c) => c.id === championId);
}

/**
 * Lit un publicId sans régénérer le build complet.
 * Utile pour afficher une preview (champion + rôle).
 */
export function previewFromPublicId(publicId: string): {
  championId: string;
  role: Role;
  gameId: GameId;
} | null {
  const payload = decodePublicId(publicId);
  if (!payload) return null;
  if (payload.g !== "lol") return null; // MVP

  return {
    championId: payload.c,
    role: payload.r as Role,
    gameId: payload.g as GameId,
  };
}

/**
 * generateBuild — fonction principale du générateur.
 *
 * Étapes :
 * 1) Crée (ou utilise) un seed
 * 2) Crée un RNG déterministe
 * 3) Sélectionne un starter (règles Jungle/Support)
 * 4) Sélectionne 0 ou 1 boots
 * 5) Remplit jusqu’à 6 slots avec CORE/FUN (sans doublons)
 * 6) Génère un publicId partageable
 * 7) Retourne un BuildResult complet
 */
export function generateBuild(input: BuildInput): BuildResult {
  const v = 1; // version du format

  // 1) Seed
  const seed = input.seed?.trim() || randomSeed();
  const rng = makeRng(seed);

  const game = getGame(input.gameId);
  const champion = findChampion(input.gameId, input.championId);
  if (!champion) throw new Error("Champion not found");

  const role = input.role;

  // =========================
  // 2) STARTER (règles)
  // =========================
  const starters = game.items.filter((it) => it.kind === "STARTER");
  let starter: Item | undefined;

  if (requiresJungleStarter(role)) {
    starter = starters.find(isJungleStarter);
  } else if (requiresSupportStarter(role)) {
    starter = starters.find(isSupportStarter);
  } else {
    const pool = starters.filter(
      (it) => !isJungleStarter(it) && !isSupportStarter(it)
    );

    starter = pickWeighted(
      rng,
      pool.map((it) => ({
        value: it,
        w: itemWeightForContext({
          item: it,
          champion,
          role,
          chaos: input.chaos,
        }),
      }))
    );
  }

  if (!starter) throw new Error("No starter available");

  // =========================
  // 3) BOOTS (0 ou 1 max)
  // =========================
  const bootsPool = game.items.filter((it) => it.kind === "BOOTS");
  let boots: Item | null = null;

  if (rng() < 0.7 && bootsPool.length > 0) {
    boots =
      pickWeighted(
        rng,
        bootsPool.map((it) => ({
          value: it,
          w: itemWeightForContext({
            item: it,
            champion,
            role,
            chaos: input.chaos,
          }),
        }))
      ) || null;
  }

  // =========================
  // 4) ITEMS CORE / FUN
  // (jusqu’à 6 slots)
  // =========================
  const pool = game.items.filter(
    (it) => it.kind === "CORE" || it.kind === "FUN"
  );

  const picked = new Set<string>([starter.id]);
  if (boots) picked.add(boots.id);

  const items: Item[] = [starter];
  if (boots) items.push(boots);

  while (items.length < 6) {
    const candidates = pool.filter((it) => !picked.has(it.id));
    if (candidates.length === 0) break;

    const next = pickWeighted(
      rng,
      candidates.map((it) => ({
        value: it,
        w: itemWeightForContext({
          item: it,
          champion,
          role,
          chaos: input.chaos,
        }),
      }))
    );

    if (!next) break;
    items.push(next);
    picked.add(next.id);
  }

  // =========================
  // 5) PUBLIC ID (partage)
  // =========================
  const publicId = encodePublicId({
    v,
    g: input.gameId,
    s: seed,
    c: champion.id,
    r: role,
    ch: input.chaos ? 1 : 0,
  });

  // =========================
  // 6) RÉSULTAT FINAL
  // =========================
  return {
    v,
    gameId: input.gameId,
    seed,
    publicId,
    championId: champion.id,
    championName: champion.name,
    role,
    chaos: input.chaos,
    items,
    createdAt: Date.now(),
    favorite: false,
  };
}

/**
 * generateFromPublicId — Replay exact d’un build.
 *
 * 1) Décode le publicId
 * 2) Récupère seed/champion/role/chaos
 * 3) Appelle generateBuild avec ces valeurs
 */
export function generateFromPublicId(
  publicId: string
): BuildResult | null {
  const payload = decodePublicId(publicId);
  if (!payload) return null;
  if (payload.g !== "lol") return null; // MVP

  return generateBuild({
    gameId: payload.g as GameId,
    seed: payload.s,
    championId: payload.c,
    role: payload.r as Role,
    chaos: payload.ch === 1,
  });
}
