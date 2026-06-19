// Temporary file to test environment variables
console.log('=== ENVIRONMENT VARIABLES TEST ===');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING');
console.log('Expected URL:', 'https://eyufkjnsrcaexkbgchyk.supabase.co');
console.log('==================================');
