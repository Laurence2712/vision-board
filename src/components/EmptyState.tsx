interface Props {
  onAdd: () => void;
}

export default function EmptyState({ onAdd }: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
      <p className="font-display text-2xl italic text-lavender">
        Qu'est-ce que tu veux accomplir cette année ?
      </p>
      <p className="mt-2 max-w-xs font-body text-sm text-muted">
        Chaque objectif ajouté devient une étoile dans ton ciel. Commence par
        le premier.
      </p>
      <button
        onClick={onAdd}
        className="mt-6 rounded-full bg-gold px-5 py-2.5 font-body text-sm font-medium text-ink hover:bg-gold/90"
      >
        Ajouter un objectif
      </button>
    </div>
  );
}
