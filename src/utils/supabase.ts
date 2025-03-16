import { createClient } from '@supabase/supabase-js'

// Supabase URL ve anahtar değerlerini al
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Eğer URL veya anahtar yoksa konsola uyarı mesajı yazdır
if (!supabaseUrl) console.warn('Supabase URL tanımlanmamış')
if (!supabaseAnonKey) console.warn('Supabase Anon Key tanımlanmamış')

// Supabase istemcisini oluştur (hem client hem de server tarafı için)
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 