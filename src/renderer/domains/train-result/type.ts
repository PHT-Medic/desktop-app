/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PrivateKey } from 'paillier-bigint';
import { TrainResultSourceOption } from './constants';

export type TarFile = {
    path: string,
    content: string
};

// -------------------------------------

export type TrainResultLoaderContext = {
    source: string,
    sourceOption: TrainResultSourceOption,
    encryption: {
        rsa: {
            privateKey: string
        },
        paillier?: {
            privateKey: PrivateKey
        }
    }
};

export type ReadTrainResultConfigContext = {
    files: TarFile[],
    encryption: {
        privateKey: string
    }
};
