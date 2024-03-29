import {decryptSymmetric, encryptSymmetric} from "../../src/main/core";

describe('src/renderer/domains/encryption/symmetric.ts', () => {
    it('should encrypt & decrypt symmetric data', () => {
        const iv = Buffer.from('f3103e7266558e9a053a0442637a11bc', 'hex');
        const key = Buffer.from('981dc2734ed1e484ff8a855d3015b1ba2c8fe55c69cfb47d7808b19b8d06692c', 'hex')
        const text = 'longer test string over 32';

        const encrypted = encryptSymmetric(key, iv, text);
        const decrypted = decryptSymmetric(key, encrypted).toString();


        expect(decrypted).toEqual(text);
    });

    it('should decrypt externally encrypted data', () => {
        const key = Buffer.from('981dc2734ed1e484ff8a855d3015b1ba2c8fe55c69cfb47d7808b19b8d06692c', 'hex')
        const text = 'longer test string over 32';

        const externalBuffer = Buffer.from("f3103e7266558e9a053a0442637a11bcbc42aaa78281f85923bc1b3f7e28ae2dd58935edc99fc225177d9dff10503615", "hex");

        const decrypted = decryptSymmetric(key, externalBuffer).toString();
        expect(decrypted).toEqual(text);
    });
});
