/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type TarFile = {
    path: string,
    content: string
};

export type TrainResultConfig = {
    master_image: string,
    user_id: number,
    train_id: string,
    session_id: string,
    proposal_id: string,
    user_encrypted_sym_key: string,
    user_decrypted_sym_key?: string // custom attribute
    [key: string]: any
};

export type TrainResultReadCompressedContext = {
    filePath: string,
    privateKey: string,
    passphrase: string
};

export type ReadTrainResultContext = {
    filePath: string,
    encryption: {
        privateKey: string,
        passphrase: string,
    }
};

export type ReadTrainResultConfigContext = {
    files: TarFile[],
    encryption: {
        privateKey: string,
        passphrase: string,
    }
};
