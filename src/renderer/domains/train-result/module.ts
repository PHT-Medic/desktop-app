/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import fernet from 'fernet';

import { TarFile, TrainResultConfig, TrainResultLoaderContext } from './type';
import { readTrainResultConfig } from './config-read';
import { TrainConfig } from '../../config/constants';
import { TrainResultSourceOption } from './constants';
import { decompressTarFile } from '../fs/decompress';
import { decryptPaillierNumberInTarFiles } from '../encryption/utils/paillier';

export async function loadTrainResult(context: TrainResultLoaderContext) : Promise<{
    config: TrainResultConfig,
    files: TarFile[]
}> {
    let files : TarFile[] = [];

    switch (context.sourceOption) {
        case TrainResultSourceOption.FILE:
            files = await decompressTarFile(context.source);
            break;
        case TrainResultSourceOption.URL:
            break;
    }

    if (files.length === 0) {
        throw new Error();
    }

    const config = await readTrainResultConfig({
        files,
        encryption: context.encryption.rsa,
    });

    let resultFiles : TarFile[] = files
        .filter((file) => file.path.startsWith(TrainConfig.RESULT_PATH))
        .map((file) => {
            file.path = file.path.replace(`${TrainConfig.RESULT_PATH}/`, '');
            return file;
        });

    for (let i = 0; i < resultFiles.length; i++) {
        try {
            const secret = new fernet.Secret(config.user_decrypted_sym_key);

            const token = new fernet.Token({
                secret,
                token: resultFiles[i].content,
                ttl: 0,
            });

            resultFiles[i].content = token.decode();
        } catch (e) {
            throw new Error('The result file could not be decrypted with the decrypted symmetric key.');
        }
    }

    if (context.encryption.paillier) {
        resultFiles = decryptPaillierNumberInTarFiles(
            context.encryption.paillier.privateKey,
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
