import type { Champion, Item, Role } from "../../lib/types";
import { isFun } from "./rules";

export function itemWeightForContext(args: {
  item: Item;
  champion: Champion;
  role: Role;
  chaos: boolean;
}) {
  const { item, champion, role, chaos } = args;

  let w = 1;

  if (item.roleAffinity?.[role]) w *= item.roleAffinity[role]!;
  if (item.championAffinity?.[champion.id]) w *= item.championAffinity[champion.id]!;

  if (chaos && isFun(item)) w *= 2.2;
  if (!chaos && isFun(item)) w *= 0.85;

  return w;
}
