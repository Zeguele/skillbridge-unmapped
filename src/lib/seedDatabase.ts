import { supabase } from "@/integrations/supabase/client";
import { SEED_PROFILES } from "@/data/seedProfiles";

let seedingPromise: Promise<void> | null = null;

/**
 * Seeds the profiles table with 87 test profiles if (and only if) it is empty.
 * Safe to call multiple times — runs at most once per page load.
 */
export function ensureProfilesSeeded(): Promise<void> {
  if (seedingPromise) return seedingPromise;
  seedingPromise = (async () => {
    try {
      const { count, error: countErr } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      if (countErr) {
        console.warn("Seed check failed:", countErr.message);
        return;
      }
      if ((count ?? 0) > 0) return;

      // Insert in chunks to keep payloads small.
      const chunkSize = 30;
      for (let i = 0; i < SEED_PROFILES.length; i += chunkSize) {
        const chunk = SEED_PROFILES.slice(i, i + chunkSize);
        const { error: insErr } = await supabase.from("profiles").insert(chunk);
        if (insErr) {
          console.warn("Seed insert failed:", insErr.message);
          return;
        }
      }
      console.log("Seeded 87 test profiles (48 Ghana, 39 Bangladesh)");
    } catch (e) {
      console.warn("Seed routine error:", e);
    }
  })();
  return seedingPromise;
}
