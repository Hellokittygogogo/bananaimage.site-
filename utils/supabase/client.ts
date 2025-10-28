import { createBrowserClient } from "@supabase/ssr";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const createClient = () => {
  if (!isSupabaseConfigured) {
    // Minimal noop client for client-side code paths.
    return {
      auth: {
        async getUser() {
          return { data: { user: null }, error: null } as any;
        },
      },
    } as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
