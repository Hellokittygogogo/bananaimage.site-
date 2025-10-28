import { createClient } from "@supabase/supabase-js";

export const isServiceRoleConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const createServiceRoleClient = () => {
  if (!isServiceRoleConfigured) {
    // Return a noop client to avoid crashing preview builds. Any call will
    // simply return empty results. Endpoints depending on this should guard
    // against missing configuration when used.
    const noop = {
      from() {
        return {
          select: async () => ({ data: null, error: new Error("Supabase not configured") }),
          insert: async () => ({ data: null, error: new Error("Supabase not configured") }),
          update: async () => ({ data: null, error: new Error("Supabase not configured") }),
          upsert: async () => ({ data: null, error: new Error("Supabase not configured") }),
          delete: async () => ({ data: null, error: new Error("Supabase not configured") }),
          eq: function () { return this; },
          single: async () => ({ data: null, error: new Error("Supabase not configured") }),
          maybeSingle: async () => ({ data: null, error: new Error("Supabase not configured") }),
          order: function () { return this; },
        } as any;
      },
    } as any;
    return noop;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
