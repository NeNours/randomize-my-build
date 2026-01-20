import type { Champion, Item, Role } from "../../lib/types";

export const LOL_ROLES: Role[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export const LOL_CHAMPIONS: Champion[] = [
  { id: "ahri", name: "Ahri", roles: ["MID"] },
  { id: "leesin", name: "Lee Sin", roles: ["JUNGLE"] },
  { id: "garen", name: "Garen", roles: ["TOP"] },
  { id: "jinx", name: "Jinx", roles: ["ADC"] },
  { id: "thresh", name: "Thresh", roles: ["SUPPORT"] },
];

export const LOL_ITEMS: Item[] = [
  // Starters
  { id: "dorans_blade", name: "Doran's Blade", kind: "STARTER", roleAffinity: { ADC: 1.2 } },
  { id: "dorans_ring", name: "Doran's Ring", kind: "STARTER", roleAffinity: { MID: 1.2 } },
  { id: "dorans_shield", name: "Doran's Shield", kind: "STARTER", roleAffinity: { TOP: 1.2 } },

  // Jungle starter obligatoire
  { id: "jungle_pet", name: "Jungle Pet", kind: "STARTER", tags: ["JUNGLE_STARTER"], roleAffinity: { JUNGLE: 10 } },

  // Support starter obligatoire
  { id: "world_atlas", name: "World Atlas", kind: "STARTER", tags: ["SUPPORT_STARTER"], roleAffinity: { SUPPORT: 10 } },

  // Boots (max 1)
  { id: "boots", name: "Boots", kind: "BOOTS" },
  { id: "sorc_shoes", name: "Sorcerer's Shoes", kind: "BOOTS", roleAffinity: { MID: 1.3 } },
  { id: "berserker", name: "Berserker's Greaves", kind: "BOOTS", roleAffinity: { ADC: 1.3 } },

  // Core
  { id: "ludens", name: "Luden's Companion", kind: "CORE", roleAffinity: { MID: 1.4 }, championAffinity: { ahri: 2.0 } },
  { id: "shadowflame", name: "Shadowflame", kind: "CORE", roleAffinity: { MID: 1.2 } },
  { id: "black_cleaver", name: "Black Cleaver", kind: "CORE", roleAffinity: { TOP: 1.3, JUNGLE: 1.1 }, championAffinity: { garen: 1.6, leesin: 1.4 } },
  { id: "infinity_edge", name: "Infinity Edge", kind: "CORE", roleAffinity: { ADC: 1.5 }, championAffinity: { jinx: 2.0 } },
  { id: "rapidfire", name: "Rapid Firecannon", kind: "CORE", roleAffinity: { ADC: 1.3 }, championAffinity: { jinx: 1.5 } },
  { id: "locket", name: "Locket of the Iron Solari", kind: "CORE", roleAffinity: { SUPPORT: 1.4 }, championAffinity: { thresh: 1.8 } },

  // FUN (favorisés en Chaos)
  { id: "heartsteel", name: "Heartsteel", kind: "FUN", tags: ["FUN"], roleAffinity: { TOP: 1.2 } },
  { id: "riftmaker", name: "Riftmaker", kind: "FUN", tags: ["FUN"] },
  { id: "statikk", name: "Statikk Shiv", kind: "FUN", tags: ["FUN"], roleAffinity: { ADC: 1.1 } },
];
