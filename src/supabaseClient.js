import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qgletrinpmialdqtrnan.supabase.co'
const supabaseKey = 'sb_publishable_5El9ORFg2zcS9CUadUNjFQ_JztqWDzr'

export const supabase = createClient(supabaseUrl, supabaseKey)