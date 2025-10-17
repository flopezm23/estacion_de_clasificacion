import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pkcztxjbodxttippnbaw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrY3p0eGpib2R4dHRpcHBuYmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDIxODIsImV4cCI6MjA3NjIxODE4Mn0.Ho_kQrt-vPD0uMXQGq--5ClBALIUaIF7NFvdyKpVqwo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
