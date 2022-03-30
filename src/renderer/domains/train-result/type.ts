/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PrivateKey } from 'paillier-bigint';
import { TrainResultSourceType } from './constants';

export type TarFile = {
    path: string,
    content: string,
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
