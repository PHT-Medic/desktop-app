import {decryptSymmetric, encryptSymmetric} from '../../src/renderer/domains/encryption/symmetric';
import crypto from 'crypto';

describe('src/renderer/domains/encryption/symmetric.ts', () => {
    fit('should encrypt & decrypt symmetric data', () => {
        const iv = crypto.randomBytes(16);
        const key = Buffer.from('5d0e507512ad9c5691e5088dcb1d8c611a15ce06d93a9de4f610987ebbaa407d', 'hex')
        const text = 'hallo peter';

        const encrypted = encryptSymmetric(key, iv, text);

        const decrypted = decryptSymmetric(key, encrypted);

        expect(decrypted).toEqual(text);
    });
});
