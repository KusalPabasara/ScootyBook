// Clear corrupted token script
// Run this in the browser console to fix the authorization issue

console.log('🔧 Clearing corrupted authentication token...');

// Clear the token from localStorage
localStorage.removeItem('token');

console.log('✅ Token cleared from localStorage');

// Reload the page to reset the authentication state
console.log('🔄 Reloading page to reset authentication...');
window.location.reload();
