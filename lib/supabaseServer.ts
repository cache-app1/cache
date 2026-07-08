import { createClient } from "@supabase/supabase-js";

export function getAccessToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

export function createServerSupabaseClient(accessToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
}

export async function requireUser(request: Request) {
  const token = getAccessToken(request);
  if (!token) {
    return { error: "unauthorized" as const };
  }
  const supabase = createServerSupabaseClient(token);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "unauthorized" as const };
  }
  return { supabase, user };
}