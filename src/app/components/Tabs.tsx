type TabKey = "create" | "replay";

// Composant simple pour gérer les onglets
export function Tabs(props: {
  active: TabKey;              // onglet actif
  onChange: (t: TabKey) => void; // callback quand on clique
}) {
  const { active, onChange } = props;

  // Petit helper pour éviter la répétition
  const btn = (key: TabKey, label: string) => (
    <button
      onClick={() => onChange(key)}   // change l’onglet
      style={{
        padding: "10px",
        background: active === key ? "#eee" : "white",
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      {btn("create", "Créer")}
      {btn("replay", "Rejouer")}
    </div>
  );
}
