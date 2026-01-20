# 🎲 Randomize My Build

Un générateur de builds aléatoires (inspiré de League of Legends) construit avec **React + TypeScript**.  
Le projet génère des builds **déterministes** : le même `seed` produit toujours le même résultat, ce qui permet de partager et rejouer des builds via un code (`publicId`).

---

## 🚀 Fonctionnalités (actuelles)

- ✅ Génération de build aléatoire par **Champion / Rôle / Chaos**
- ✅ Générateur **déterministe** basé sur un seed
- ✅ Code partageable (`publicId`) pour rejouer un build
- ✅ Preview du champion + rôle à partir du code
- ✅ Architecture extensible (prévue pour supporter d’autres jeux plus tard)

> ⚠️ MVP actuel : League of Legends uniquement.

---

## 🛠️ Tech Stack

### Frontend
- **React**
- **TypeScript**
- **Vite**
- (UI de test basique pour l’instant — Tailwind prévu plus tard)

### Core (moteur du générateur)
- `rng.ts` → RNG déterministe (seeded random)
- `codec.ts` → Encodage / décodage du `publicId`
- `generator.ts` → Logique de génération du build

---

## 📁 Structure du projet (simplifiée)

- src/
- app/
- App.tsx # UI principale (test du générateur)
- lib/
- types.ts # Modèles de données
- rng.ts # RNG déterministe
- codec.ts # Encodage / décodage du publicId
- generator.ts # Moteur de génération du build
- games/
- lol/
- data.ts # Champions + items
- rules.ts # Règles (starter jungle/support, etc.)
- weights.ts # Pondération des items


---

## ▶️ Lancer le projet en local

- **npm install**
- **npm run dev**
- **Puis ouvre :**
👉 http://localhost:xxxx
---

## 🔁 Comment fonctionne le générateur (haut niveau)

1. Un seed est créé (ou fourni).
2. Ce seed initialise un RNG déterministe (makeRng).
3. Le générateur :
  - applique les règles (starter obligatoire pour Jungle/Support, max 1 boots),
  - sélectionne les items avec pondération,
  - construit un build de 6 items.
4. Un publicId est généré pour partager le build.
5. Le même publicId peut être décodé pour rejouer exactement le même build.

---

## 📦 À venir (roadmap)
 - UI moderne avec Tailwind
 - Historique local + favoris
 - Mode “Rejouer” propre (champ dédié au code)
 - Support d’autres jeux (architecture prête)
 -   (Optionnel) Backend + stockage des builds publics

---

## 🤝 Contribuer
- Toute contribution est bienvenue !
- Fork le repo
- Crée une branche : git checkout -b feature/ta-fonctionnalite
- Commit : git commit -m "Add ta fonctionnalité"
- Push : git push origin feature/ta-fonctionnalite
- Ouvre une Pull Request

---

## 📄 Licence

- Projet personnel — usage libre pour apprentissage et fun.


---