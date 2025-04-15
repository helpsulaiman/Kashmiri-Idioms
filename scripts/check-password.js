const crypto = require('crypto');

// Your current password
const currentPassword = 'Cxer2024';

// Generate hash
const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');

console.log('Current Password:', currentPassword);
console.log('Generated Hash:', currentHash);

// Check against your .env.local hash
const envHash = '728f92b0850203d721f95a829ee6d7fd78293ed168948d7826262be665b88715';
console.log('Matches .env.local hash:', currentHash === envHash);

// If they don't match, show the correct hash to use
if (currentHash !== envHash) {
  console.log('\nYour current password hash does not match the one in .env.local.\n');
  console.log('To fix this, update your .env.local with this hash:\n');
  console.log(`NEXT_PUBLIC_ADMIN_PASSWORD_HASH=${currentHash}`);
}
