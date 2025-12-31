import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const getServiceConfig = () => {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url) {
    throw new Error("Supabase URL missing (set NEXT_PUBLIC_SUPABASE_URL).");
  }
  if (!serviceKey) {
    throw new Error("Supabase service role key missing (set SUPABASE_SERVICE_ROLE_KEY).");
  }
  return { url, serviceKey };
};

export const createServiceSupabaseClient = (): SupabaseClient => {
  const { url, serviceKey } = getServiceConfig();
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export { getServiceConfig };
