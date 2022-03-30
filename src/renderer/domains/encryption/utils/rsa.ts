/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { createPrivateKey, generateKeyPairSync } from 'crypto';

export function decryptRSAPrivateKey(key: string | Buffer, passphrase: string) : string {
    const privateKey = createPrivateKey({
        type: 'pkcs8',
        format: 'pem',
        key,
        passphrase,
    });

    let content =  privateKey.export({
        type: 'pkcs8',
        format: 'pem',
    });

    if(typeof content !== 'string') {
        content = Buffer.from(content).toString('utf-8');
    }

    return content;
}

export function generateRSAKeyPair(passphrase: string) {
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
