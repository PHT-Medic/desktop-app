/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PrivateKey } from 'paillier-bigint';
import { TarFile } from '../../train-result/type';

function decryptContentRecursive(privateKey: PrivateKey, data: unknown) {
    if(
        typeof data === 'object' &&
        data !== null
    ) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            data[keys[i]] = decryptContentRecursive(privateKey, data[keys[i]]);
        }

        return data;
    }

    if(typeof data === 'number') {
        return privateKey.decrypt(BigInt(data));
    }

    return data;
}

export function decryptPaillierNumberInTarFiles(
    privateKey: PrivateKey,
    files: TarFile[],
) {
    // @ts-ignore
    BigInt.prototype.toJSON = function() { return this.toString() }

    for (let i = 0; i < files.length; i++) {
        if (files[i].path.indexOf('.he.json') === -1) {
            // eslint-disable-next-line no-continue
            continue;
        }

        const parsed = JSON.parse(files[i].content.toString());
        const decrypted = decryptContentRecursive(privateKey, parsed);

        files[i].content = Buffer.from(JSON.stringify(decrypted));
    }

    return files;
}
