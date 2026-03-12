import crypto from 'crypto'
// Genera una cadena hexadecimal de 64 bytes (512 bits) segura
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);
