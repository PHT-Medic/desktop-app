import {decryptSymmetric, encryptSymmetric} from '../../src/renderer/domains/encryption/symmetric';
import crypto from 'crypto';

describe('src/renderer/domains/encryption/symmetric.ts', () => {
    fit('should encrypt & decrypt symmetric data', () => {
        const iv = crypto.randomBytes(16);
        const key = Buffer.from('2cbe3ea035e4a2635b8e20bd4581faa89534ae764e38f66b', 'hex')
        const text = 'hallo peter';

        const encrypted = encryptSymmetric(key, iv, text);

        const decrypted = decryptSymmetric(key, encrypted);

        expect(decrypted).toEqual(text);
    });
});
