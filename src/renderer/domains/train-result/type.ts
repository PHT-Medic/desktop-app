/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { readTrainResult } from '~/domains/train-result/module';

export type TarFile = {
    path: string,
    content: string
};

export type TrainConfig = {
    master_image: string,
    user_id: number,
    train_id: string,
    session_id: string,
    proposal_id: string,
    user_encrypted_sym_key: string,
    [key: string]: any
};

export type TrainResultReadCompressedContext = {
    filePath: string,
    privateKey: string,
    passphrase: string
};
