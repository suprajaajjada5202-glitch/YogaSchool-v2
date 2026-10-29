"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigured } from "@/lib/supabase";

let client: SupabaseClient | null = null;
/** Browser Supabase client for staff sign-in (publishable key; RLS limits changes to admins). */
export function supabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  client ??= createClient(SUPABASE_URL, SUPABASE_KEY);
  return client;
}
