import type { BuildResult } from "./types";

// Clé utilisée dans le localStorage
const KEY = "rmb_build_history_v1";

// Charger l’historique depuis le navigateur
export function loadHistory(): BuildResult[]{
    try{
        const raw = localStorage.getItem(KEY);
        if(!raw) return [];
        return JSON.parse(raw) as BuildResult[];
    }catch {
        return [];
    }
}

// Sauvegarder toute la liste
export function saveHistory(list: BuildResult[]){
    localStorage.setItem(KEY, JSON.stringify(list));
}

// Ajouter un build à l’historique
export function addToHistory(build: BuildResult) {
  const list = loadHistory();

  // Évite les doublons (même code)
  const withoutDuplicates = list.filter(
    (b) => b.publicId !== build.publicId
  );

  // Ajoute au début, limite à 50 entrées
  const next = [build, ...withoutDuplicates].slice(0, 50);

  saveHistory(next);
  return next;
}

// Marquer / retirer un favori
export function toggleFavorite(publicId: string) {
  const list = loadHistory();

  const next = list.map((b) =>
    b.publicId === publicId ? { ...b, favorite: !b.favorite } : b
  );

  saveHistory(next);
  return next;
}

// Supprimer un build
export function removeFromHistory(publicId: string) {
  const list = loadHistory();
  const next = list.filter((b) => b.publicId !== publicId);
  saveHistory(next);
  return next;
}

// Vider l’historique
export function clearHistory() {
  saveHistory([]);
  return [];
}