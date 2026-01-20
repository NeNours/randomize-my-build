import { useMemo, useState } from "react";
import { generateBuild } from "./lib/generator";
import type { Role } from "./lib/types";
import { LOL_CHAMPIONS, LOL_ROLES } from "./games/lol/data";

export default function App() {
  const [championId, setChampionId] = useState(LOL_CHAMPIONS[0].id);
  const [role, setRole] = useState<Role>(LOL_ROLES[0]);
  const [chaos, setChaos] = useState(false);

  const build = useMemo(() => {
    return generateBuild({ gameId: "lol", championId, role, chaos });
  }, [championId, role, chaos]);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Random Build Generator (Core Test)</h1>

      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        <label>
          Champion{" "}
          <select value={championId} onChange={(e) => setChampionId(e.target.value)}>
            {LOL_CHAMPIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Role{" "}
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
      </div>

      <div style={{ marginTop: 16 }}>
        <div>
          <b>
            {build.championName} — {build.role} {build.chaos ? "(Chaos)" : ""}
          </b>
        </div>
        <div style={{ marginTop: 8 }}>
          <div>Seed: {build.seed}</div>
          <div>Code: {build.publicId}</div>
        </div>

        <ol style={{ marginTop: 12 }}>
          {build.items.map((it) => (
            <li key={it.id}>
              {it.name} <small>({it.kind})</small>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
