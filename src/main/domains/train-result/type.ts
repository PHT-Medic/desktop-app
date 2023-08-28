/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { TrainConfig } from '@personalhealthtrain/core';
import type { PrivateKey } from 'paillier-bigint';
import type { TrainResultSourceType } from './constants';

export type TarFile = {
    path: string,
    content: Buffer,
    decrypted?: boolean
};

// -------------------------------------

export type TrainResultLoaderContext = {
    source: string,
    sourceType: `${TrainResultSourceType}`,

    rsaPrivateKey: string,
    paillierPrivateKey?: PrivateKey
};

export type ReadTrainResultConfigContext = {
    files: TarFile[],
    privateKey: string
};

export type TrainResultOutput = {
    config: TrainConfig,
    files: TarFile[]
};
