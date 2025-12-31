import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const getPublicConfig = () => {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  if (!url) {
    throw new Error("Supabase URL missing (set NEXT_PUBLIC_SUPABASE_URL).");
  }
  if (!anonKey) {
    throw new Error("Supabase anon key missing (set NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  }
  return { url, anonKey };
};

export const createPublicSupabaseClient = (): SupabaseClient => {
  const { url, anonKey } = getPublicConfig();
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export { getPublicConfig };
