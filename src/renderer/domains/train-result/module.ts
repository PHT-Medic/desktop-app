/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import fernet from 'fernet';

import { ReadTrainResultContext, TarFile, TrainResultConfig } from './type';
import { decompressTarFile } from '../../modules/fs/decompress';
import { readTrainResultConfig } from './config-read';
import { TrainConfig } from '../../config/constants';

export async function readTrainResult(context: ReadTrainResultContext) : Promise<{
    config: TrainResultConfig,
    files: TarFile[]
}> {
    const files : TarFile[] = await decompressTarFile(context.filePath);

    const config = await readTrainResultConfig({
        files,
        encryption: context.encryption,
    });

    const resultFiles = files.filter((file) => file.path.startsWith(TrainConfig.RESULT_PATH));

    for (let i = 0; i < resultFiles.length; i++) {
        try {
            const secret = new fernet.Secret(config.user_decrypted_sym_key);

            const token = new fernet.Token({
                secret,
                token: resultFiles[i].content,
                ttl: 0,
            });

            resultFiles[i] = token.decode();
        } catch (e) {
            throw new Error('The result file could not be decrypted with the decrypted symmetric key.');
        }
    }

    return {
        config,
        files: resultFiles,
    };
}

export async function saveExtractedTrainResult(filePath: string, files: any) {

}
