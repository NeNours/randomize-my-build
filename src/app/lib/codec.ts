/**
 * codec.ts — publicId encoding/decoding
 *
 * But :
 * - Encoder les infos nécessaires au replay (seed/champion/role/chaos) dans une string partageable.
 * - Décoder cette string pour rejouer exactement le même build.
 *
 * Format :
 * - On sérialise un petit objet JSON (versionné)
 * - Puis on l’encode en base64url (URL-safe)
 *
 * Note :
 * - Ce n’est pas de la sécurité / crypto.
 * - C’est juste un format compact et pratique pour partage (copy/paste + URL).
 */

/**
 * base64url : variante de base64 compatible URL
 * - remplace + par -
 * - remplace / par _
 * - enlève le padding =
 */
function toBase64Url(str: string) {
  // btoa/atob travaillent en latin1, donc on encode en UTF-8 proprement
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(b64url: string) {
  // On restaure le format base64 standard + padding
  const b64 =
    b64url.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((b64url.length + 3) % 4);

  const str = decodeURIComponent(escape(atob(b64)));
  return str;
}

/**
 * PublicPayload : contenu minimal nécessaire pour rejouer un build.
 * v : version du format (permet de faire évoluer le schéma plus tard)
 * g : gameId
 * s : seed
 * c : championId
 * r : role
 * ch : chaos (0/1) pour éviter "true/false" et rester compact
 */
export type PublicPayload = {
  v: number;
  g: string;
  s: string;
  c: string;
  r: string;
  ch: 0 | 1;
};

/**
 * encodePublicId :
 * - JSON.stringify(payload)
 * - base64url(JSON)
 * → string partageable (publicId)
 */
export function encodePublicId(payload: PublicPayload) {
  return toBase64Url(JSON.stringify(payload));
}

/**
 * decodePublicId :
 * - base64url → JSON string
 * - JSON.parse
 * - validation minimale du schéma
 *
 * Retourne null si :
 * - publicId invalide
 * - JSON invalide
 * - champs manquants / mauvais types
 */
export function decodePublicId(publicId: string): PublicPayload | null {
  try {
    const json = fromBase64Url(publicId.trim());
    const obj = JSON.parse(json);

    if (!obj || typeof obj !== "object") return null;

    // validation minimale (évite de crasher le generator)
    if (typeof obj.v !== "number") return null;
    if (typeof obj.g !== "string") return null;
    if (typeof obj.s !== "string") return null;
    if (typeof obj.c !== "string") return null;
    if (typeof obj.r !== "string") return null;
    if (obj.ch !== 0 && obj.ch !== 1) return null;

    return obj as PublicPayload;
  } catch {
    return null;
  }
}
