import { useEffect, useState } from "react";
import type { Goal } from "../lib/types";
import { generateShareImage } from "../lib/shareImage";

interface Props {
  goals: Goal[];
  year: number;
  onClose: () => void;
}

export default function ShareModal({ goals, year, onClose }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    generateShareImage(goals, year)
      .then((b) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(b);
        setBlob(b);
        setUrl(objectUrl);
      })
      .catch(() => active && setError(true));
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [goals, year]);

  async function handleShare() {
    if (!blob) return;
    const file = new File([blob], `vision-board-${year}.png`, {
      type: "image/png",
    });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Vision board ${year}`,
        });
        return;
      } catch {
        // L'utilisateur a annulé ou le partage a échoué, on retombe sur le téléchargement.
      }
    }
    handleDownload();
  }

  function handleDownload() {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `vision-board-${year}.png`;
    a.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-t-2xl border border-line bg-panel p-5 sm:rounded-2xl sm:p-6"
      >
        <h2 className="font-display text-xl text-mist">Mon année en étoiles</h2>
        <p className="mt-1 font-body text-xs text-muted">
          Une image récapitulative, prête à partager.
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-ink">
          {error ? (
            <p className="p-6 text-center font-body text-xs text-muted">
              Impossible de générer l'image pour le moment.
            </p>
          ) : url ? (
            <img
              src={url}
              alt={`Récapitulatif vision board ${year}`}
              className="w-full"
            />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p className="font-body text-xs text-muted">Génération…</p>
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-line py-2.5 font-body text-sm text-muted hover:text-mist"
          >
            Fermer
          </button>
          <button
            onClick={handleDownload}
            disabled={!url}
            className="flex-1 rounded-lg border border-line py-2.5 font-body text-sm text-mist hover:border-lavender disabled:opacity-40"
          >
            Télécharger
          </button>
          <button
            onClick={handleShare}
            disabled={!url}
            className="flex-1 rounded-lg bg-gold py-2.5 font-body text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-40"
          >
            Partager
          </button>
        </div>
      </div>
    </div>
  );
}
