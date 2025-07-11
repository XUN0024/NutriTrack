// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ttbbbjnkpyesplxqlvoh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmJiam5rcHllc3BseHFsdm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNTE2MjksImV4cCI6MjA2NzYyNzYyOX0.8AwxZCJzdvV1Z7VIVRNn2BZWK28DWgwd7MZeQ2DleKI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
