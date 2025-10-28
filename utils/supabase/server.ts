import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Returns true when required Supabase envs are provided.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/**
 * A very small noop client that satisfies the methods used in our app
 * during SSR. This lets the site render even when Supabase envs are not
 * configured (preview/first‑time setup). All methods resolve to safe
 * default values.
 */
function createNoopServerClient() {
  return {
    auth: {
      async getUser() {
        return { data: { user: null }, error: null } as any;
      },
    },
  } as any;
}

export const createClient = async () => {
  // If Supabase is not configured we return a noop client so that
  // the app can still render without throwing a 500 error.
  if (!isSupabaseConfigured) {
    return createNoopServerClient();
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Called from a Server Component – ignore, we don't need to
            // persist cookies in that case.
          }
        },
      },
    },
  );
};
