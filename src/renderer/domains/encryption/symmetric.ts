import crypto from 'crypto';

export function decrypt(key: string, iv: string, data: Buffer): Buffer {

    let bufferKey = Buffer.from(key, 'hex');
    let bufferIv = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-192-cbc', bufferKey, bufferIv);
    return Buffer.concat([decipher.update(data), decipher.final()]);
}
