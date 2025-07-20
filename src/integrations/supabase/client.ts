import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vlvvvpaabcmexbgkyksi.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdnZ2cGFhYmNtZXhiZ2t5a3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzQ0MDksImV4cCI6MjA2MDg1MDQwOX0.9y6bFQWJBdnPBtT64Gf0SWeMIV_O41m6sLc2nXQVqsY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);