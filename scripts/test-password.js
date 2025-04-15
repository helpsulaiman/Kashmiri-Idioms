const crypto = require('crypto');

// Your current hash from .env.local
const currentHash = 'bf6cd2ddbc165ec86d73f291ec4246d6267fcb031180c014cc4efa6a39ac59be';

// Test a password
const testPassword = 'Cxer2024'; // Or try your current password
const testHash = crypto.createHash('sha256').update(testPassword).digest('hex');

console.log('Test Password:', testPassword);
console.log('Generated Hash:', testHash);
console.log('Matches Current Hash:', testHash === currentHash);

// If it doesn't match, generate a new hash for your current password
if (testHash !== currentHash) {
  console.log('\nYour current password does not match the stored hash.\n');
  console.log('To fix this, update your .env.local with this hash:\n');
  console.log(`NEXT_PUBLIC_ADMIN_PASSWORD_HASH=${testHash}`);
}
