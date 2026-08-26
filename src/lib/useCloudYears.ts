import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { defaultYear } from "./years";

export function useCloudYears(userId: string | undefined) {
  const [years, setYears] = useState<number[]>([defaultYear()]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase || !userId) return;
    supabase
      .from("goals")
      .select("year")
      .eq("user_id", userId)
      .then(({ data }) => {
        const distinct = Array.from(
          new Set((data ?? []).map((r) => r.year as number))
        );
        setYears(distinct.length > 0 ? distinct.sort((a, b) => a - b) : [defaultYear()]);
        setLoaded(true);
      });
  }, [userId]);

  // Ajoute une année localement (persistera dès qu'un objectif y sera créé).
  function registerYear(year: number) {
    setYears((prev) =>
      prev.includes(year) ? prev : [...prev, year].sort((a, b) => a - b)
    );
  }

  return { years, loaded, registerYear };
}
