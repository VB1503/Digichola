import CryptoJS from 'crypto-js';

// Load the secret key from environment variables
const secretKey = import.meta.env.VITE_SECRET;

if (!secretKey) {
    throw new Error('Secret key not found in environment variables');
}

// Encryption function
export const encryptBusinessId = (businessId) => {
    // Convert the businessId to a string if it's not already
    const text = businessId.toString();
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

// Decryption function
export const decryptBusinessId = (encryptedBusinessId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedBusinessId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
