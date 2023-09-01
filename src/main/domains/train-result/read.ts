/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { APIClient, TrainContainerPath } from '@personalhealthtrain/core';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { Readable } from 'node:stream';
import { isWebURL } from '../../../core';
import { decompressTarFile, decryptPaillierNumberInTarFiles, decryptSymmetric } from '../../core';
import { parseTrainConfig } from '../train-config';
import type { TarFile, TrainResultLoaderContext, TrainResultOutput } from '../../../core';

const CONFIG_FILE = path.basename(TrainContainerPath.CONFIG);
const RESULT_DIRECTORY = path.basename(TrainContainerPath.RESULTS);

export async function readTrainResult(context: TrainResultLoaderContext) : Promise<TrainResultOutput> {
    let files : TarFile[];

    if (isWebURL(context.source)) {
        const tmpDir = os.tmpdir();
        const filePath = path.join(tmpDir, 'pht.tar');

        const apiClient = new APIClient({
            transform: [],
        });

        const response = await apiClient.get(context.source, {
            responseType: 'stream',
            headers: {
                AUTHORIZATION: `Bearer ${context.token}`,
            },
        });

        if (!response.body) {
            throw new Error('The response body is empty.');
        }

        await new Promise<void>((resolve, reject) => {
            const str = Readable.fromWeb(response.body as any);

            const ws = fs.createWriteStream(filePath);
            str.pipe(ws);
            str.on('error', () => {
                reject();
            });
            str.on('end', () => {
                resolve();
            });
        });

        files = await decompressTarFile(context.source);

        await fs.promises.unlink(filePath);
    } else {
        files = await decompressTarFile(context.source);
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
