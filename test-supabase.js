const { createClient } = require('@supabase/supabase-js');
const url = "https://pzkptzzydhcpuparnkug.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6a3B0enp5ZGhjcHVwYXJua3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTkxNzgsImV4cCI6MjA5MTM5NTE3OH0.4NCqQgyR5wFKC-6f86df8K6ICavxTENZ6q-NMqGq_g0";
const supabase = createClient(url, key);

supabase.from('candidates').select('name, cv_url').limit(5).then(res => {
  console.log(res.data);
}).catch(console.error);
