import { createClient } from "@supabase/supabase-js";

// Usar variables de entorno con valores por defecto como respaldo
const SUPABASE_URL =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://pkcztxjbodxttippnbaw.supabase.co";
const SUPABASE_KEY =
  process.env.REACT_APP_SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrY3p0eGpib2R4dHRpcHBuYmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDIxODIsImV4cCI6MjA3NjIxODE4Mn0.Ho_kQrt-vPD0uMXQGq--5ClBALIUaIF7NFvdyKpVqwo";

// Log para debugging (solo en desarrollo)
if (process.env.NODE_ENV === "development") {
  console.log("🔑 Configuración de Supabase:");
  console.log("URL:", SUPABASE_URL);
  console.log("Key presente:", !!SUPABASE_KEY);
  console.log(
    "Key inicia con:",
    SUPABASE_KEY ? SUPABASE_KEY.substring(0, 20) + "..." : "No definida"
  );
}

// Validar credenciales
if (!SUPABASE_URL) {
  console.error("❌ ERROR: REACT_APP_SUPABASE_URL no está definida");
}

if (!SUPABASE_KEY) {
  console.error("❌ ERROR: REACT_APP_SUPABASE_KEY no está definida");
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "💡 SOLUCIÓN: Verifica que las variables de entorno estén configuradas en GitHub Secrets"
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    debug: process.env.NODE_ENV === "development", // Solo debug en desarrollo
  },
});
