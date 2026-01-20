export type GameId = "lol";
export type Role = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";
export type ItemKind = "STARTER" | "BOOTS" | "CORE" | "FUN";

export type Champion = {
    id: string;
    name: string;
    roles : Role[];
    tags?: string[];
};

export type Item = {
  id: string;
  name: string;
  kind: ItemKind;
  tags?: string[]; // ex: ["JUNGLE_STARTER","SUPPORT_STARTER","FUN"]
  roleAffinity?: Partial<Record<Role, number>>;
  championAffinity?: Record<string, number>;
};

export type BuildInput = {
  gameId: GameId;
  championId: string;
  role: Role;
  chaos: boolean;
  seed?: string;
};

export type BuildResult = {
  v: number;
  gameId: GameId;
  seed: string;
  publicId: string;

  championId: string;
  championName: string;
  role: Role;
  chaos: boolean;

  items: Item[];

  createdAt: number;
  favorite: boolean;
};