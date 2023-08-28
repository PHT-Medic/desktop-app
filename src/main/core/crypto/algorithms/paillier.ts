/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PrivateKey } from 'paillier-bigint';

export function decryptContentRecursive(privateKey: PrivateKey, data: unknown) {
    if (
        typeof data === 'object' &&
        data !== null
    ) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            (data as Record<string, any>)[keys[i]] = decryptContentRecursive(privateKey, (data as Record<string, any>)[keys[i]]);
        }

        return data;
    }

    if (typeof data === 'string') {
        return privateKey.decrypt(BigInt(data));
    }

    if (typeof data === 'bigint') {
        return privateKey.decrypt(data);
    }

    return data;
}
