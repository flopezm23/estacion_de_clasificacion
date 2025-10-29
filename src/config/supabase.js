import { createClient } from "@supabase/supabase-js";

// Configuración directa - ya verificamos que funciona
const SUPABASE_URL = "https://pkcztxjbodxttippnbaw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrY3p0eGpib2R4dHRpcHBuYmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDIxODIsImV4cCI6MjA3NjIxODE4Mn0.Ho_kQrt-vPD0uMXQGq--5ClBALIUaIF7NFvdyKpVqwo";

console.log("🔑 Inicializando Supabase...");

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Importante: deshabilitar para SPAs
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
