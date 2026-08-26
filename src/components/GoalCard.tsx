import { useState } from "react";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  progressRatio,
  isGoalDone,
  paceNudge,
} from "../lib/types";
import type { Goal } from "../lib/types";

interface Props {
  goal: Goal;
  onToggleSimple: (id: string, completed: boolean) => void;
  onCounterChange: (id: string, current: number) => void;
  onAddEntry: (id: string, label: string) => void;
  onRemoveEntry: (goalId: string, entryId: string) => void;
  onRemove: (id: string) => void;
}

export default function GoalCard({
  goal,
  onToggleSimple,
  onCounterChange,
  onAddEntry,
  onRemoveEntry,
  onRemove,
}: Props) {
  const [entryInput, setEntryInput] = useState("");
  const [adding, setAdding] = useState(false);
  const done = isGoalDone(goal);
  const ratio = progressRatio(goal);
  const nudge = paceNudge(goal);
  const color = CATEGORY_COLORS[goal.category];

  function submitEntry() {
    const label = entryInput.trim();
    if (!label) return;
    onAddEntry(goal.id, label);
    setEntryInput("");
    setAdding(false);
  }

  return (
    <div
      className={`group rounded-2xl border bg-panel px-4 py-4 sm:px-5 sm:py-4 transition-colors ${
        done ? "border-gold/40" : "border-line"
      }`}
    >
      <div className="flex items-start gap-3">
        {goal.type === "simple" ? (
          <button
            aria-label={done ? "Marquer comme non fait" : "Marquer comme fait"}
            onClick={() => onToggleSimple(goal.id, !goal.completed)}
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
              done
                ? "border-gold bg-gold text-ink"
                : "border-line text-transparent hover:border-lavender"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10.5L8 14.5L16 6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <div
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
              done ? "border-gold bg-gold/15" : "border-line"
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: done ? "#E8B34A" : "#4A4E68" }}
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`font-body text-[15px] leading-snug ${
                done ? "text-muted line-through" : "text-mist"
              }`}
            >
              {goal.title}
            </p>
            <button
              onClick={() => onRemove(goal.id)}
              aria-label="Supprimer l'objectif"
              className="shrink-0 text-muted opacity-0 transition-opacity hover:text-gold group-hover:opacity-100"
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <span
            className="mt-1.5 inline-block rounded-full px-2 py-0.5 font-body text-[11px]"
            style={{ background: `${color}22`, color }}
          >
            {CATEGORY_LABELS[goal.category]}
          </span>

          {goal.type !== "simple" && (
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${ratio * 100}%`,
                      background: done ? "#E8B34A" : "#5DAEE1",
                    }}
                  />
                </div>
                {goal.type === "counter" ? (
                  <div className="ml-3 flex items-center gap-2 font-body text-xs text-muted">
                    <button
                      aria-label="Diminuer"
                      onClick={() =>
                        onCounterChange(goal.id, Math.max(0, goal.current - 1))
                      }
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-line hover:border-lavender"
                    >
                      −
                    </button>
                    <span className="min-w-[44px] text-center text-mist">
                      {goal.current} / {goal.target}
                    </span>
                    <button
                      aria-label="Augmenter"
                      onClick={() =>
                        onCounterChange(
                          goal.id,
                          Math.min(goal.target, goal.current + 1)
                        )
                      }
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-line hover:border-lavender"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="ml-3 shrink-0 font-body text-xs text-muted">
                    {goal.entries.length} / {goal.target}
                  </span>
                )}
              </div>

              {goal.type === "list" && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {goal.entries.map((entry) => (
                    <span
                      key={entry.id}
                      className="group/pill inline-flex items-center gap-1 rounded-full bg-panel2 px-2.5 py-1 font-body text-xs text-mist"
                    >
                      {entry.label}
                      <button
                        aria-label={`Retirer ${entry.label}`}
                        onClick={() => onRemoveEntry(goal.id, entry.id)}
                        className="text-muted opacity-0 transition-opacity hover:text-gold group-hover/pill:opacity-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {adding ? (
                    <input
                      autoFocus
                      value={entryInput}
                      onChange={(e) => setEntryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitEntry();
                        if (e.key === "Escape") {
                          setAdding(false);
                          setEntryInput("");
                        }
                      }}
                      onBlur={submitEntry}
                      placeholder="Titre..."
                      className="w-28 rounded-full border border-lavender/50 bg-transparent px-2.5 py-1 font-body text-xs text-mist outline-none placeholder:text-muted"
                    />
                  ) : (
                    <button
                      onClick={() => setAdding(true)}
                      className="inline-flex items-center gap-1 rounded-full border border-dashed border-line px-2.5 py-1 font-body text-xs text-muted hover:border-lavender hover:text-lavender"
                    >
                      + ajouter
                    </button>
                  )}
                </div>
              )}

              {nudge && (
                <p className="mt-2.5 font-body text-[11px] text-lavender/80">
                  {nudge}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
