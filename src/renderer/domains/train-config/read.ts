/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import crypto from 'crypto';
import {TrainConfig} from "@personalhealthtrain/central-common";
import { ReadTrainResultConfigContext } from '../train-result/type';
import { TrainConfigPath } from '../../config/constants';

export async function parseTrainConfig(context: ReadTrainResultConfigContext) : Promise<{
    config: TrainConfig,
    key: Buffer
}> {
    const configIndex = context.files.findIndex((file) => file.path === TrainConfigPath.RESULT_CONFIG_FILE_NAME);
    if (configIndex === -1) {
        throw new Error(`The ${TrainConfigPath.RESULT_CONFIG_FILE_NAME} does not exist in the compressed tar file.`);
    }

    let config : TrainConfig;

    try {
        config = JSON.parse(context.files[configIndex].content.toString("utf-8"));
    } catch (e) {
        throw new Error(`The ${TrainConfigPath.RESULT_CONFIG_FILE_NAME} could not be parsed.`);
    }

    if(!config.creator.encrypted_key) {
        throw new Error(`The encrypted key is not present.`);
    }

    const symBuff = Buffer.from(config.creator.encrypted_key, 'hex');

    try {
        const content = crypto.privateDecrypt({
            key: context.privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha512',
            oaepLabel: undefined,
        }, symBuff);

        return {
            config,
            key: content
        }
    } catch (e) {
        throw new Error('The symmetric key could not be decrypted using the private key.');
    }
}
