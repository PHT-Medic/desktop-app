/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { decompressTarFile, decryptPaillierNumberInTarFiles, decryptSymmetric } from '../../core';
import { TrainConfigPath, parseTrainConfig } from '../train-config';
import type { TarFile, TrainResultLoaderContext, TrainResultOutput } from './type';
import { TrainResultSourceType } from './constants';

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

    const { config, key } = await parseTrainConfig({
        files,
        privateKey: context.rsaPrivateKey,
    });

    let resultFiles : TarFile[] = files
        .filter((file) => file.path.startsWith(TrainConfigPath.RESULT_PATH))
        .map((file) => {
            file.path = file.path.replace(`${TrainConfigPath.RESULT_PATH}/`, '');
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
