const crypto = require('crypto');

// Your new password
const newPassword = 'CxerKhayi2024';

// Generate hash
const newHash = crypto.createHash('sha256').update(newPassword).digest('hex');

console.log('Update your .env.local with this hash:');
console.log(`NEXT_PUBLIC_ADMIN_PASSWORD_HASH=${newHash}`);
