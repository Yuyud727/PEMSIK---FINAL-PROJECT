// src/Utils/SupabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Di SupabaseClient.js - tambahkan sementara untuk debug
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Anon Key exists:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
