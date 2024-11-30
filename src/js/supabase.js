import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://mbqotxhfiltqmcccqmbi.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icW90eGhmaWx0cW1jY2NxbWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4OTc5NjIsImV4cCI6MjA0ODQ3Mzk2Mn0.0ZUe4lgsC7v3NsTxrGwyzUKk5Ea6MNMhrZPJbRtruRE')
console.log(createClient, supabase)
