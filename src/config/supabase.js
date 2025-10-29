import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pkcztxjbodxttippnbaw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// Determinar la URL base según el entorno
const getBaseUrl = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:3000";
  }
  return "https://flopezm23.github.io/estacion_de_clasificacion";
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    redirectTo: getBaseUrl(),
  },
});
