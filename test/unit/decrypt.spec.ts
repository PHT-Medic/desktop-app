import { decrypt } from '../../src/renderer/domains/encryption/symmetric';

describe('src/renderer/domains/encryption/symmetric.ts', () => {
    it('should decrypt data', () => {


        const key = '72addd06a3cccec223b696052e371a9c953e1df7b9280763';
        const iv = 'fed91d4c0d16444083b11b8c3c';

        const data = Buffer.from('test data');
        const encrypted_data = '47f55f76ab1cf77579ea2b514d77876eb5a86c7eeb21a002c0';

        let decrypted_data = decrypt(key, iv, Buffer.from(encrypted_data, 'hex'));

        expect(decrypted_data.toString())
            .toEqual(data.toString());

    });

});
