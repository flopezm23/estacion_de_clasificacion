import { createClient } from "@supabase/supabase-js";

// Configuración directa sin variables de entorno para evitar problemas
const SUPABASE_URL = "https://pkcztxjbodxttippnbaw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrY3p0eGpib2R4dHRpcHBuYmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDIxODIsImV4cCI6MjA3NjIxODE4Mn0.Ho_kQrt-vPD0uMXQGq--5ClBALIUaIF7NFvdyKpVqwo";

console.log("🔑 Inicializando Supabase...");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: window.localStorage,
  },
});

// Verificar conexión básica
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("❌ Error de conexión Supabase:", error);
  } else {
    console.log("✅ Supabase conectado correctamente");
  }
});

export { supabase };
