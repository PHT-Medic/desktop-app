/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { TrainConfig } from '@personalhealthtrain/core';
import type { PrivateKey } from 'paillier-bigint';

export type TarFile = {
    path: string,
    content: Buffer,
    decrypted?: boolean
};

// -------------------------------------

export type TrainResultLoaderContext = {
    token: string,
    /**
     * web or file url.
     */
    source: string,

    rsaPrivateKey: string,
    paillierPrivateKey?: PrivateKey
};

export type TrainResultOutput = {
    config: TrainConfig,
    files: TarFile[]
};
