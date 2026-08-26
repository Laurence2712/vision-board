export type GoalType = "simple" | "counter" | "list";

export type Category = "perso" | "pro" | "sante" | "voyage" | "creatif";

export interface GoalEntry {
  id: string;
  label: string;
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  category: Category;
  target: number;
  current: number;
  entries: GoalEntry[];
  completed: boolean;
  createdAt: string;
  year: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  perso: "Perso",
  pro: "Pro",
  sante: "Santé",
  voyage: "Voyage",
  creatif: "Créatif",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  perso: "#9B93D6",
  pro: "#5DAEE1",
  sante: "#6FBF8B",
  voyage: "#E8B34A",
  creatif: "#E08AA6",
};

export function progressRatio(goal: Goal): number {
  if (goal.type === "simple") return goal.completed ? 1 : 0;
  if (goal.type === "counter") {
    if (goal.target <= 0) return 0;
    return Math.min(1, goal.current / goal.target);
  }
  if (goal.type === "list") {
    if (goal.target <= 0) return 0;
    return Math.min(1, goal.entries.length / goal.target);
  }
  return 0;
}

export function isGoalDone(goal: Goal): boolean {
  if (goal.type === "simple") return goal.completed;
  return progressRatio(goal) >= 1;
}

// Retourne un message de rappel doux si l'objectif est en retard par rapport
// au temps déjà écoulé dans l'année — null si tout va bien ou si non applicable.
export function paceNudge(goal: Goal, now = new Date()): string | null {
  if (goal.type === "simple") return null;
  if (isGoalDone(goal)) return null;

  const yearStart = new Date(goal.year, 0, 1).getTime();
  const yearEnd = new Date(goal.year, 11, 31, 23, 59, 59).getTime();
  const t = now.getTime();
  const totalDays = (yearEnd - yearStart) / 86400000;
  const elapsedDays = Math.min(totalDays, Math.max(0, (t - yearStart) / 86400000));
  const remainingDays = Math.max(0, (yearEnd - t) / 86400000);

  if (t > yearEnd || remainingDays < 1) return null;

  const expectedRatio = totalDays > 0 ? elapsedDays / totalDays : 0;
  const actualRatio = progressRatio(goal);

  // On ne signale que si vraiment en retard, pour rester discret.
  if (actualRatio >= expectedRatio - 0.15) return null;

  const months = Math.round(remainingDays / 30.4);
  const timeLabel =
    months >= 1
      ? `${months} mois`
      : `${Math.max(1, Math.round(remainingDays))} jours`;

  if (goal.type === "counter") {
    const remaining = Math.max(0, goal.target - goal.current);
    return `${remaining} restants, encore ${timeLabel} pour finir`;
  }
  const remaining = Math.max(0, goal.target - goal.entries.length);
  return `${remaining} restants, encore ${timeLabel} pour finir`;
}
