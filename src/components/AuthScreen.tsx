import { useState } from "react";
import { isSupabaseConfigured } from "../lib/supabase";

interface Props {
  onSignIn: (email: string) => Promise<void>;
}

export default function AuthScreen({ onSignIn }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit() {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Entre une adresse email valide.");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      await onSignIn(trimmed);
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Impossible d'envoyer le lien. Réessaie dans un instant.");
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-2xl text-mist">
          Configuration manquante
        </p>
        <p className="mt-3 font-body text-sm text-muted">
          Les clés Supabase (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY) ne
          sont pas définies. Ajoute-les dans un fichier .env ou dans les
          variables d'environnement Netlify.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-muted">
        Vision board
      </p>
      <h1 className="mt-2 text-center font-display text-3xl text-mist">
        Ce que je veux vivre
      </h1>

      {status === "sent" ? (
        <div className="mt-8 rounded-2xl border border-line bg-panel px-5 py-6 text-center">
          <p className="font-body text-sm text-mist">Lien envoyé.</p>
          <p className="mt-2 font-body text-xs text-muted">
            Ouvre l'email reçu à {email} et clique sur le lien pour te
            connecter.
          </p>
        </div>
      ) : (
        <div className="mt-8 w-full">
          <label className="block font-body text-xs text-muted">
            Adresse email
          </label>
          <input
            autoFocus
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="toi@exemple.com"
            className="mt-1.5 w-full rounded-lg border border-line bg-panel2 px-3 py-2.5 font-body text-sm text-mist outline-none placeholder:text-muted focus:border-lavender"
          />
          {error && (
            <p className="mt-2 font-body text-xs text-red-400">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={status === "sending"}
            className="mt-4 w-full rounded-lg bg-gold py-2.5 font-body text-sm font-medium text-ink hover:bg-gold/90 disabled:opacity-50"
          >
            {status === "sending" ? "Envoi…" : "Recevoir un lien de connexion"}
          </button>
          <p className="mt-3 text-center font-body text-[11px] text-muted">
            Pas de mot de passe. Chaque personne garde son propre board,
            privé.
          </p>
        </div>
      )}
    </div>
  );
}
