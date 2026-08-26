interface Props {
  years: number[];
  activeYear: number;
  onSelect: (year: number) => void;
  onAddNextYear: () => void;
}

export default function YearSwitcher({
  years,
  activeYear,
  onSelect,
  onAddNextYear,
}: Props) {
  return (
    <div className="mb-5 flex items-center gap-2 overflow-x-auto scrollbar-thin">
      {years.map((y) => (
        <button
          key={y}
          onClick={() => onSelect(y)}
          className={`shrink-0 rounded-full px-3 py-1.5 font-body text-xs transition-colors ${
            y === activeYear
              ? "bg-gold/15 text-gold border border-gold/40"
              : "text-muted border border-transparent hover:text-mist"
          }`}
        >
          {y}
        </button>
      ))}
      <button
        onClick={onAddNextYear}
        aria-label="Ajouter une nouvelle année"
        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-line text-muted hover:border-lavender hover:text-lavender"
      >
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 3V17M3 10H17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
