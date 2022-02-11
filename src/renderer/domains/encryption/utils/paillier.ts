/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PrivateKey } from 'paillier-bigint';
import { TarFile } from '../../train-result/type';

function decryptContentRecursive(privateKey: PrivateKey, data: any) {
    switch (true) {
        case Object.prototype.toString.call(data) === '[object Object]': {
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                data[keys[i]] = decryptContentRecursive(privateKey, data[keys[i]]);
            }

            return data;
        }
        default:
            return privateKey.decrypt(BigInt(data as string));
    }
}

export function decryptPaillierNumberInTarFiles(
    privateKey: PrivateKey,
    files: TarFile[],
) {
    for (let i = 0; i < files.length; i++) {
        if (files[i].path.indexOf('.he.json') === -1) {
            // eslint-disable-next-line no-continue
            continue;
        }

        const parsed = JSON.parse(files[i].content);

        files[i].content = JSON.stringify(decryptContentRecursive(privateKey, parsed));
    }

    return files;
}
