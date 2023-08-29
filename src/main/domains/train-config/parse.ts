/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import crypto from 'node:crypto';
import type { TrainConfig } from '@personalhealthtrain/core';
import type { TrainConfigParseContext, TrainConfigParseOutput } from './type';

export async function parseTrainConfig(context: TrainConfigParseContext) : Promise<TrainConfigParseOutput> {
    let config : TrainConfig;

    try {
        if (Buffer.isBuffer(context.content)) {
            config = JSON.parse(context.content.toString('utf-8'));
        } else {
            config = JSON.parse(context.content);
        }
    } catch (e) {
        throw new Error('The train config could not be parsed.');
    }

    if (!config.creator.encrypted_key) {
        throw new Error('The encrypted key is not present.');
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
            key: content,
        };
    } catch (e) {
        throw new Error('The symmetric key could not be decrypted using the private key.');
    }
}
