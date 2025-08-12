// Simple test to check environment variables
console.log('Environment variables:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_STRIPE_PUBLISHABLE_KEY:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log('All env vars:', import.meta.env);