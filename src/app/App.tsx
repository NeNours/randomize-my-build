import { useEffect, useMemo, useState } from "react";
import type { Role, BuildResult } from "./lib/types";
import { generateBuild, generateFromPublicId, previewFromPublicId } from "./lib/generator";
import { LOL_CHAMPIONS, LOL_ROLES } from "./games/lol/data";
import { addToHistory, clearHistory, loadHistory, removeFromHistory, toggleFavorite } from "./lib/storage";
import { Tabs } from "./components/Tabs";

type TabKey = "create" | "replay";

function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

export default function App() {
  const [tab, setTab] = useState<TabKey>("create");

  // --- Create tab state
  const [championId, setChampionId] = useState(LOL_CHAMPIONS[0].id);
  const [role, setRole] = useState<Role>(LOL_ROLES[0]);
  const [chaos, setChaos] = useState(false);

  // --- Replay tab state (séparé pour éviter conflits)
  const [replayInput, setReplayInput] = useState("");
  const replayPreview = useMemo(() => previewFromPublicId(replayInput), [replayInput]);

  // --- History (localStorage)
  const [history, setHistory] = useState<BuildResult[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Build courant (Create)
  const [currentBuild, setCurrentBuild] = useState<BuildResult | null>(null);

  // Génère un build seulement quand l'utilisateur clique
  function handleGenerate() {
    const b = generateBuild({ gameId: "lol", championId, role, chaos });
    setCurrentBuild(b);
  }
  function handleSaveCurrent() {
    if (!currentBuild) return;
    setHistory(addToHistory(currentBuild));
  }

  async function handleShare(build: BuildResult) {
    const text = `🎲 Randomize My Build\n${build.championName} — ${build.role}${build.chaos ? " (Chaos)" : ""}\nCode: ${build.publicId}`;
    await copyToClipboard(text);
    alert("Copié dans le presse-papiers ✅");
  }

  async function handleCopyCode(build: BuildResult) {
    await copyToClipboard(build.publicId);
    alert("Code copié ✅");
  }

  function handleReplay() {
    const b = generateFromPublicId(replayInput);
    if (!b) {
      alert("Code invalide ❌");
      return;
    }
    // Option: sauver le replay dans l’historique
    setHistory(addToHistory(b));
    alert("Build rejoué et sauvegardé ✅");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 4 }}>Randomize My Build</h1>
      <div style={{ opacity: 0.8, marginBottom: 16 }}>
        MVP LoL — seed + code partageable + historique local
      </div>

      <Tabs active={tab} onChange={setTab} />

      {tab === "create" && (
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <label>
              Champion{" "}
              <select value={championId} onChange={(e) => { setChampionId(e.target.value); setCurrentBuild(null); }}>
                {LOL_CHAMPIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Rôle{" "}
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                {LOL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <input type="checkbox" checked={chaos} onChange={(e) => setChaos(e.target.checked)} /> Chaos
            </label>

            <button
              onClick={handleGenerate}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
            >
              Générer
            </button>


            <button
              onClick={handleSaveCurrent}
              disabled={!currentBuild}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                opacity: currentBuild ? 1 : 0.5,
                cursor: currentBuild ? "pointer" : "not-allowed",
              }}
            >
              Sauvegarder
            </button>


            <button
              onClick={() => currentBuild && handleShare(currentBuild)}
              disabled={!currentBuild}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                opacity: currentBuild ? 1 : 0.5,
                cursor: currentBuild ? "pointer" : "not-allowed",
              }}
            >
              Share
            </button>
          </div>

          {!currentBuild ? (
            <div style={{ border: "1px dashed #ccc", borderRadius: 12, padding: 16, opacity: 0.8 }}>
              Aucun build généré. Choisis tes options puis clique sur <b>Générer</b>.
            </div>
          ) : (
            <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 16 }}>
              <div style={{ marginBottom: 6 }}>
                <b>
                  {currentBuild.championName} — {currentBuild.role} {currentBuild.chaos ? "(Chaos)" : ""}
                </b>
              </div>

              <div style={{ fontSize: 14, opacity: 0.8 }}>
                Seed: {currentBuild.seed}
                <br />
                Code: {currentBuild.publicId}{" "}
                <button onClick={() => handleCopyCode(currentBuild)} style={{ marginLeft: 8 }}>
                  Copier
                </button>
              </div>

              <ol style={{ marginTop: 12 }}>
                {currentBuild.items.map((it) => (
                  <li key={it.id}>
                    {it.name} <small style={{ opacity: 0.7 }}>({it.kind})</small>
                  </li>
                ))}
              </ol>
            </div>
          )}

        </div>
      )}

      {tab === "replay" && (
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label>
              Code (publicId){" "}
              <input
                value={replayInput}
                onChange={(e) => setReplayInput(e.target.value)}
                placeholder="Colle le code ici…"
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
              />
            </label>
          </div>

          {replayPreview && (
            <div style={{ padding: 12, borderRadius: 12, border: "1px solid #e5e5e5" }}>
              Preview : <b>{replayPreview.championId}</b> — <b>{replayPreview.role}</b>
            </div>
          )}

          <button onClick={handleReplay} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", width: "fit-content" }}>
            Rejouer
          </button>
        </div>
      )}

      <hr style={{ margin: "24px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Historique local</h2>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setHistory(clearHistory())} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd" }}>
            Clear
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{ opacity: 0.7, marginTop: 8 }}>Aucun build sauvegardé.</div>
      ) : (
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {history.map((b) => (
            <div key={b.publicId} style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <b>
                    {b.championName} — {b.role} {b.chaos ? "(Chaos)" : ""}
                  </b>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>Code: {b.publicId}</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setHistory(toggleFavorite(b.publicId))}
                    title="Favori"
                    style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #ddd" }}
                  >
                    {b.favorite ? "★" : "☆"}
                  </button>

                  <button onClick={() => handleShare(b)} style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #ddd" }}>
                    Share
                  </button>

                  <button onClick={() => setHistory(removeFromHistory(b.publicId))} style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #ddd" }}>
                    Remove
                  </button>
                </div>
              </div>

              <ol style={{ marginTop: 10 }}>
                {b.items.map((it) => (
                  <li key={it.id}>
                    {it.name} <small style={{ opacity: 0.7 }}>({it.kind})</small>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

//commentaire
