import crypto from 'crypto';

export function decryptSymmetric(key: Buffer, data: Buffer, ivLength = 16): string {
    const iv = data.slice(0, ivLength);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.write(data.slice(ivLength));
    decipher.end();

    const decrypted = decipher.read();
    return decrypted.toString();
}

export function encryptSymmetric(key: Buffer, iv: Buffer, data: string) : Buffer {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.write(data);
    cipher.end();

    const encrypted = cipher.read();

    return Buffer.concat([iv, encrypted]);
}
