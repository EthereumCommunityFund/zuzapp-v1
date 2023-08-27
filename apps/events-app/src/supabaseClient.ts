
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
let url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
 const supabase = createClient( url,  key);

 export default supabase;
