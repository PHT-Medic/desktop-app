/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import crypto from 'crypto';
import { ReadTrainResultConfigContext, TrainResultConfig } from './type';
import { TrainConfig } from '../../config/constants';

export async function readTrainResultConfig(context: ReadTrainResultConfigContext) {
    const configIndex = context.files.findIndex((file) => file.path === TrainConfig.RESULT_CONFIG_FILE_NAME);
    if (configIndex === -1) {
        throw new Error(`The ${TrainConfig.RESULT_CONFIG_FILE_NAME} does not exist in the compressed tar file.`);
    }

    let config : TrainResultConfig;

    try {
        config = JSON.parse(context.files[configIndex].content);
    } catch (e) {
        throw new Error(`The ${TrainConfig.RESULT_CONFIG_FILE_NAME} could not be parsed.`);
    }

    const symBuff = Buffer.from(config.user_encrypted_sym_key, 'hex');

    try {
        const content = crypto.privateDecrypt({
            key: context.encryption.privateKey,
            passphrase: context.encryption.passphrase,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha512',
            oaepLabel: undefined,
        }, symBuff);

        config.user_decrypted_sym_key = content.toString('utf-8');
    } catch (e) {
        throw new Error('The symmetric key could not be decrypted using the private key.');
    }

    return config;
}
