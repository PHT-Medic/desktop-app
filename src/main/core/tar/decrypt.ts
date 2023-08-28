/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PrivateKey } from 'paillier-bigint';
import { decryptContentRecursive } from '../crypto';
import { useJsonBigIntTransformer } from '../json-bigint';
import type { TarFile } from './type';

export function decryptPaillierNumberInTarFiles(
    privateKey: PrivateKey,
    files: TarFile[],
) {
    const transformer = useJsonBigIntTransformer();

    for (let i = 0; i < files.length; i++) {
        if (files[i].path.indexOf('.he.json') === -1) {
            // eslint-disable-next-line no-continue
            continue;
        }

        const parsed = transformer.parse(files[i].content.toString());
        const decrypted = decryptContentRecursive(privateKey, parsed);

        files[i].content = Buffer.from(transformer.stringify(decrypted));
    }

    return files;
}
