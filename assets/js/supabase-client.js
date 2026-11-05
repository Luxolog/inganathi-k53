/* Public browser client config. The publishable key is designed for browser use.
   Security must be enforced with Supabase Auth and Row Level Security. */
const ING_SUPABASE_URL = "https://uoohmgrihluuhzhfxnww.supabase.co";
const ING_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_41N3GZwKWne81UCjIBBHjg_xkFSjIJH";

window.inganathiSupabase = window.supabase.createClient(
  ING_SUPABASE_URL,
  ING_SUPABASE_PUBLISHABLE_KEY
);
