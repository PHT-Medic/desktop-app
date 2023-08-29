/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { TrainContainerPath } from '@personalhealthtrain/core';
import path from 'node:path';
import { decompressTarFile, decryptPaillierNumberInTarFiles, decryptSymmetric } from '../../core';
import { parseTrainConfig } from '../train-config';
import type { TarFile, TrainResultLoaderContext, TrainResultOutput } from './type';
import { TrainResultSourceType } from './constants';

const CONFIG_FILE = path.basename(TrainContainerPath.CONFIG);
const RESULT_DIRECTORY = path.basename(TrainContainerPath.RESULTS);

export async function readTrainResult(context: TrainResultLoaderContext) : Promise<TrainResultOutput> {
    let files : TarFile[] = [];

    switch (context.sourceType) {
        case TrainResultSourceType.FILE:
            files = await decompressTarFile(context.source);
            break;
        case TrainResultSourceType.URL:
            break;
    }

    if (files.length === 0) {
        throw new Error('The result is empty.');
    }

    const configIndex = files.findIndex((file) => file.path === CONFIG_FILE);
    if (configIndex === -1) {
        throw new Error(`The ${CONFIG_FILE} does not exist in the compressed tar file.`);
    }

    const { config, key } = await parseTrainConfig({
        content: files[configIndex].content,
        privateKey: context.rsaPrivateKey,
    });

    let resultFiles : TarFile[] = files
        .filter((file) => file.path.startsWith(RESULT_DIRECTORY))
        .map((file) => {
            file.path = file.path.replace(`${RESULT_DIRECTORY}/`, '');
            return file;
        });

    for (let i = 0; i < resultFiles.length; i++) {
        try {
            const data = decryptSymmetric(key, resultFiles[i].content);

            resultFiles[i].content = Buffer.from(data);
            resultFiles[i].decrypted = true;
        } catch (e) {
            resultFiles[i].decrypted = false;
        }
    }

    if (context.paillierPrivateKey) {
        resultFiles = decryptPaillierNumberInTarFiles(
            context.paillierPrivateKey,
            resultFiles,
        );
    }

    return {
        config,
        files: resultFiles,
    };
}
