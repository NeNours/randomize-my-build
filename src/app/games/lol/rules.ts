import type { Item, Role } from "../../lib/types";

export function requiresJungleStarter(role: Role) {
  return role === "JUNGLE";
}
export function requiresSupportStarter(role: Role) {
  return role === "SUPPORT";
}

export function isJungleStarter(item: Item) {
  return item.tags?.includes("JUNGLE_STARTER") ?? false;
}
export function isSupportStarter(item: Item) {
  return item.tags?.includes("SUPPORT_STARTER") ?? false;
}

export function isFun(item: Item) {
  return item.kind === "FUN" || (item.tags?.includes("FUN") ?? false);
}
