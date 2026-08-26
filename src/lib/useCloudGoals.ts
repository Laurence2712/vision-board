import { useCallback, useEffect, useState } from "react";
import type { Goal } from "./types";
import { supabase } from "./supabase";

interface Row {
  id: string;
  title: string;
  type: Goal["type"];
  category: Goal["category"];
  target: number;
  current: number;
  entries: Goal["entries"];
  completed: boolean;
  created_at: string;
  year: number;
}

function rowToGoal(row: Row): Goal {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    category: row.category,
    target: row.target,
    current: row.current,
    entries: row.entries ?? [],
    completed: row.completed,
    createdAt: row.created_at,
    year: row.year,
  };
}

export function useCloudGoals(userId: string | undefined, year: number) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase || !userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .eq("year", year)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setGoals((data as Row[]).map(rowToGoal));
    }
    setLoading(false);
  }, [userId, year]);

  useEffect(() => {
    load();
  }, [load]);

  async function addGoal(goal: Omit<Goal, "id" | "createdAt">) {
    if (!supabase || !userId) return;
    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: userId,
        title: goal.title,
        type: goal.type,
        category: goal.category,
        target: goal.target,
        current: goal.current,
        entries: goal.entries,
        completed: goal.completed,
        year: goal.year,
      })
      .select()
      .single();
    if (!error && data) {
      setGoals((prev) => [rowToGoal(data as Row), ...prev]);
    }
  }

  async function updateGoal(id: string, patch: Partial<Goal>) {
    if (!supabase) return;
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...patch } : g))
    );
    const dbPatch: Record<string, unknown> = {};
    if (patch.completed !== undefined) dbPatch.completed = patch.completed;
    if (patch.current !== undefined) dbPatch.current = patch.current;
    if (patch.entries !== undefined) dbPatch.entries = patch.entries;
    if (patch.title !== undefined) dbPatch.title = patch.title;
    await supabase.from("goals").update(dbPatch).eq("id", id);
  }

  async function removeGoal(id: string) {
    if (!supabase) return;
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await supabase.from("goals").delete().eq("id", id);
  }

  async function addEntry(goalId: string, label: string) {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const entries = [
      ...goal.entries,
      { id: crypto.randomUUID(), label, date: new Date().toISOString() },
    ];
    await updateGoal(goalId, { entries });
  }

  async function removeEntry(goalId: string, entryId: string) {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const entries = goal.entries.filter((e) => e.id !== entryId);
    await updateGoal(goalId, { entries });
  }

  async function clearAll() {
    if (!supabase || !userId) return;
    const ids = goals.map((g) => g.id);
    setGoals([]);
    if (ids.length > 0) {
      await supabase.from("goals").delete().in("id", ids);
    }
  }

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    removeGoal,
    addEntry,
    removeEntry,
    clearAll,
    reload: load,
  };
}
