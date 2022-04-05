import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { decryptRSAPrivateKey, generateRSAKeyPair } from '../../src/renderer/domains/encryption/utils/rsa';
import { signHash } from '../../src/renderer/domains/signature/sign';

describe('src/renderer/domains/signature*.ts', () => {
    const privateKeyFilePath = path.join(__dirname, '..', 'data', 'private.pem');
    it('should sign a hex string', async () => {
        const random_hash = crypto.randomBytes(64);

        const hex_hash = crypto.createHash('sha512')
            .update(random_hash)
            .digest('hex');

        const passphrase = 'leuko';
        // const { privateKey, publicKey } = generateRSAKeyPair(passphrase);

        let privateKey = await fs.promises.readFile(privateKeyFilePath, { encoding: 'utf-8' });
        let privateKeyDecrypted = decryptRSAPrivateKey(privateKey, passphrase);

        const pubKeyObject = crypto.createPublicKey({
            key: privateKeyDecrypted,
            format: 'pem'
        });

        const publicKey = pubKeyObject.export({
            format: 'pem',
            type: 'spki'
        });

        let signature = signHash(hex_hash, privateKeyDecrypted);
        console.log(hex_hash);
        console.log(signature);
        expect(signature)
            .toBeDefined();

        let publicKeyObj = crypto.createPublicKey(publicKey);

        let verify = crypto.createVerify('SHA512');

        verify.update(Buffer.from(hex_hash, 'hex'));

        let result = verify.verify({ publicKeyObj }, Buffer.from(signature, 'hex'));
        console.log(result);
        expect(result)
            .toBeTruthy();


    });

});
