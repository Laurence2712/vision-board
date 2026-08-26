import { useState } from "react";
import { CATEGORY_LABELS } from "../lib/types";
import type { Category, Goal, GoalType } from "../lib/types";

interface Props {
  onClose: () => void;
  onCreate: (goal: Omit<Goal, "id" | "createdAt" | "year">) => void;
}

const TYPE_INFO: Record<GoalType, { label: string; hint: string }> = {
  simple: { label: "Simple", hint: "Une case à cocher, un point c'est tout." },
  counter: { label: "Compteur", hint: "Ex : courir 8 fois, 10 000 pas × 30 jours." },
  list: { label: "Liste", hint: "Ex : lire 10 livres, garder le titre de chacun." },
};

export default function AddGoalModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<GoalType>("simple");
  const [category, setCategory] = useState<Category>("perso");
  const [target, setTarget] = useState(10);
  const [error, setError] = useState("");

  function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Donne un titre à cet objectif.");
      return;
    }
    if (type !== "simple" && (!target || target < 1)) {
      setError("La cible doit être un nombre supérieur à 0.");
      return;
    }
    onCreate({
      title: trimmed,
      type,
      category,
      target: type === "simple" ? 0 : target,
      current: 0,
      entries: [],
      completed: false,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-2xl border border-line bg-panel p-5 sm:rounded-2xl sm:p-6"
      >
        <h2 className="font-display text-xl text-mist">Nouvel objectif</h2>

        <label className="mt-5 block font-body text-xs text-muted">
          Titre
        </label>
        <input
          autoFocus
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          placeholder="Visiter le Portugal"
          className="mt-1.5 w-full rounded-lg border border-line bg-panel2 px-3 py-2.5 font-body text-sm text-mist outline-none placeholder:text-muted focus:border-lavender"
        />

        <label className="mt-4 block font-body text-xs text-muted">
          Type
        </label>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {(Object.keys(TYPE_INFO) as GoalType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-lg border px-2 py-2 font-body text-xs transition-colors ${
                type === t
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-line text-muted hover:border-lavender hover:text-mist"
              }`}
            >
              {TYPE_INFO[t].label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 font-body text-[11px] text-muted">
          {TYPE_INFO[type].hint}
        </p>

        {type !== "simple" && (
          <>
            <label className="mt-4 block font-body text-xs text-muted">
              Cible {type === "counter" ? "(nombre)" : "(nombre d'items)"}
            </label>
            <input
              type="number"
              min={1}
              value={target}
              onChange={(e) => {
                setTarget(Number(e.target.value));
                setError("");
              }}
              className="mt-1.5 w-full rounded-lg border border-line bg-panel2 px-3 py-2.5 font-body text-sm text-mist outline-none focus:border-lavender"
            />
          </>
        )}

        <label className="mt-4 block font-body text-xs text-muted">
          Catégorie
        </label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1 font-body text-xs transition-colors ${
                category === c
                  ? "border-lavender bg-lavender/15 text-lavender"
                  : "border-line text-muted hover:border-lavender hover:text-mist"
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-3 font-body text-xs text-red-400">{error}</p>
        )}

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-line py-2.5 font-body text-sm text-muted hover:text-mist"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-gold py-2.5 font-body text-sm font-medium text-ink hover:bg-gold/90"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
