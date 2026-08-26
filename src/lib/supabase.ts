import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

// En dev sans clés configurées, on évite de crasher au chargement : l'écran
// de connexion affichera un message clair plutôt qu'une page blanche.
export const supabase = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
