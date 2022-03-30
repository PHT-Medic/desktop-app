/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

const fernet = require('fernet');
import { TarFile, TrainResultLoaderContext } from './type';
import { parseTrainConfig } from '../train-config/read';
import { TrainConfigPath } from '../../config/constants';
import { TrainResultSourceType } from './constants';
import { decompressTarFile } from '../fs/decompress';
import { decryptPaillierNumberInTarFiles } from '../encryption/utils/paillier';
import {TrainConfig} from "@personalhealthtrain/central-common";

export async function readTrainResult(context: TrainResultLoaderContext) : Promise<{
    config: TrainConfig,
    files: TarFile[]
}> {
    let files : TarFile[] = [];

    switch (context.sourceType) {
        case TrainResultSourceType.FILE:
            files = await decompressTarFile(context.source);
            break;
        case TrainResultSourceType.URL:
            break;
    }

    if (files.length === 0) {
        throw new Error();
    }

    const {config, key} = await parseTrainConfig({
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
            const secret = new fernet.Secret(key);

            const token = new fernet.Token({
                secret,
                token: resultFiles[i].content,
                ttl: 0,
            });

            resultFiles[i].content = token.decode();
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

export async function saveExtractedTrainResult(filePath: string, files: TarFile[]) {
    // ...
}
