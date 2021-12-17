/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { createPrivateKey, generateKeyPairSync } from 'crypto';

export async function decryptRSAPrivateKey(key: string | Buffer, passphrase: string) {
    const privateKey = createPrivateKey({
        type: 'pkcs8',
        format: 'pem',
        key,
        passphrase,
    });

    return privateKey.export({
        type: 'pkcs8',
        format: 'pem',
    });
}

export async function generateRSAKeyPair(passphrase: string) {
    return generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase,
        },
    });
}
