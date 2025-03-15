import { createClient } from '@supabase/supabase-js'

// Supabase istemcisini oluştur
let supabase: ReturnType<typeof createClient> | null = null

// Tarayıcı ortamında istemciyi başlat
if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (!supabaseUrl) console.warn('Supabase URL tanımlanmamış')
  if (!supabaseAnonKey) console.warn('Supabase Anon Key tanımlanmamış')
  
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase } 