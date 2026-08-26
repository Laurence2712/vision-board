import { isGoalDone } from "../lib/types";
import type { Goal } from "../lib/types";

interface Props {
  goals: Goal[];
}

// Positions déterministes en arc de ciel, générées à partir de l'index
function starPosition(i: number, total: number, width: number, height: number) {
  const spread = Math.max(total, 6);
  const t = spread <= 1 ? 0.5 : i / (spread - 1);
  const x = 40 + t * (width - 80);
  // légère variation de hauteur en vague, pour un ciel organique
  const wave = Math.sin(i * 1.7) * (height * 0.22);
  const y = height / 2 + wave;
  return { x, y };
}

export default function Constellation({ goals }: Props) {
  const width = 680;
  const height = 140;
  const points = goals.map((g, i) => ({
    goal: g,
    ...starPosition(i, goals.length, width, height),
  }));

  const doneCount = goals.filter(isGoalDone).length;

  return (
    <div className="relative w-full rounded-2xl border border-line bg-panel/60 overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[120px] sm:h-[140px]"
        role="img"
        aria-label={`${doneCount} objectifs accomplis sur ${goals.length}`}
      >
        <title>Ciel des objectifs</title>
        {points.length > 1 &&
          points.slice(1).map((p, i) => {
            const prev = points[i];
            const bothLit = isGoalDone(prev.goal) && isGoalDone(p.goal);
            return (
              <line
                key={`line-${p.goal.id}`}
                x1={prev.x}
                y1={prev.y}
                x2={p.x}
                y2={p.y}
                stroke={bothLit ? "#E8B34A" : "#2B3048"}
                strokeWidth={bothLit ? 1 : 0.75}
                strokeOpacity={bothLit ? 0.55 : 0.5}
              />
            );
          })}
        {points.map((p) => {
          const done = isGoalDone(p.goal);
          return (
            <g key={p.goal.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={done ? 9 : 6}
                fill={done ? "#E8B34A" : "#171A28"}
                stroke={done ? "#E8B34A" : "#4A4E68"}
                strokeWidth={1}
              />
              {done && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={15}
                  fill="none"
                  stroke="#E8B34A"
                  strokeOpacity={0.25}
                  strokeWidth={1}
                />
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex items-center justify-between px-5 pb-4 -mt-1">
        <p className="font-body text-xs text-muted">
          {goals.length === 0
            ? "Aucune étoile encore placée"
            : `${doneCount} sur ${goals.length} accomplis`}
        </p>
        <p className="font-display text-sm text-lavender italic">2027</p>
      </div>
    </div>
  );
}
