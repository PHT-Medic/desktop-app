import crypto from 'crypto';

export function decryptSymmetric(key: Buffer, data: string, ivLength = 16): string {
    const buffer = Buffer.from(data, 'hex');
    const iv = buffer.slice(0, ivLength);
    const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
    decipher.write(buffer.slice(ivLength));
    decipher.end();

    const decrypted = decipher.read();
    return decrypted.toString();
}

export function encryptSymmetric(key: Buffer, iv: Buffer, data: string) {
    const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
    cipher.write(data);
    cipher.end();

    const encrypted = cipher.read();

    return Buffer.concat([iv, encrypted]).toString('hex');
}
