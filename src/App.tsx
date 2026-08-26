import { useMemo, useState } from "react";
import Constellation from "./components/Constellation";
import GoalCard from "./components/GoalCard";
import AddGoalModal from "./components/AddGoalModal";
import EmptyState from "./components/EmptyState";
import YearSwitcher from "./components/YearSwitcher";
import ShareModal from "./components/ShareModal";
import AuthScreen from "./components/AuthScreen";
import { useAuth } from "./lib/useAuth";
import { useCloudGoals } from "./lib/useCloudGoals";
import { useCloudYears } from "./lib/useCloudYears";
import { isGoalDone } from "./lib/types";
import type { Goal } from "./lib/types";
import { defaultYear } from "./lib/years";

export default function App() {
  const { session, loading: authLoading, signInWithEmail, signOut } = useAuth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email ?? "";

  const [year, setYear] = useState<number>(defaultYear());
  const { years, registerYear } = useCloudYears(userId);

  const {
    goals,
    addGoal,
    updateGoal,
    removeGoal,
    addEntry,
    removeEntry,
    clearAll,
  } = useCloudGoals(userId, year);

  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  const filteredGoals = useMemo(() => {
    if (filter === "active") return goals.filter((g) => !isGoalDone(g));
    if (filter === "done") return goals.filter((g) => isGoalDone(g));
    return goals;
  }, [goals, filter]);

  function handleAddNextYear() {
    const next = Math.max(...years) + 1;
    registerYear(next);
    setYear(next);
  }

  function handleCreateGoal(goal: Omit<Goal, "id" | "createdAt" | "year">) {
    addGoal({ ...goal, year });
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-body text-xs text-muted">Chargement…</p>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onSignIn={signInWithEmail} />;
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-muted">
            Vision board
          </p>
          <h1 className="font-display text-3xl text-mist">
            Ce que je veux vivre
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShareOpen(true)}
            aria-label="Partager mon année"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-muted hover:border-gold hover:text-gold"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M14 6.5a2.5 2.5 0 1 0-2.45-3H11.5a2.5 2.5 0 0 0 0 1l-4.6 2.6a2.5 2.5 0 1 0 0 3.8l4.6 2.6a2.5 2.5 0 1 0 .5-.87l-4.6-2.6a2.5 2.5 0 0 0 0-1.06l4.6-2.6c.42.4.98.63 1.6.63Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-muted hover:border-lavender hover:text-lavender"
              aria-label="Options"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="4" r="1.6" fill="currentColor" />
                <circle cx="10" cy="10" r="1.6" fill="currentColor" />
                <circle cx="10" cy="16" r="1.6" fill="currentColor" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-line bg-panel py-1 shadow-lg">
                  <p className="truncate px-3.5 py-2 font-body text-[11px] text-muted">
                    {userEmail}
                  </p>
                  <div className="border-t border-line" />
                  <button
                    onClick={() => {
                      clearAll();
                      setMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left font-body text-xs text-muted hover:bg-panel2 hover:text-mist"
                  >
                    Tout effacer cette année
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left font-body text-xs text-muted hover:bg-panel2 hover:text-mist"
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-mist hover:border-gold hover:text-gold"
            aria-label="Ajouter un objectif"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 3V17M3 10H17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <YearSwitcher
        years={years}
        activeYear={year}
        onSelect={setYear}
        onAddNextYear={handleAddNextYear}
      />

      <Constellation goals={goals} />

      {goals.length > 0 && (
        <div className="mt-6 flex gap-2">
          {(["all", "active", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 font-body text-xs transition-colors ${
                filter === f
                  ? "bg-panel2 text-mist"
                  : "text-muted hover:text-mist"
              }`}
            >
              {f === "all" ? "Tous" : f === "active" ? "En cours" : "Accomplis"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {goals.length === 0 ? (
          <EmptyState onAdd={() => setModalOpen(true)} />
        ) : (
          filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleSimple={(id, completed) => updateGoal(id, { completed })}
              onCounterChange={(id, current) => updateGoal(id, { current })}
              onAddEntry={addEntry}
              onRemoveEntry={removeEntry}
              onRemove={removeGoal}
            />
          ))
        )}
      </div>

      {modalOpen && (
        <AddGoalModal
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateGoal}
        />
      )}

      {shareOpen && (
        <ShareModal
          goals={goals}
          year={year}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}
