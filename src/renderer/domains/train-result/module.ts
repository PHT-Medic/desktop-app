/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import crypto from 'crypto';
import tar, {FileStat} from 'tar';
import fernet from 'fernet';

import {TarFile, TrainConfig, TrainResultReadCompressedContext} from './type';

const TRAIN_CONFIG_FILE_NAME = 'train_config.json';
const TRAIN_RESULT_FILE_NAME = 'pht_results/results.txt';

export async function readTrainResult(context: TrainResultReadCompressedContext) {
    const files : TarFile[] = await decompressTarFile(context.filePath);

    const configIndex = files.findIndex(file => file.path === TRAIN_CONFIG_FILE_NAME);
    if(configIndex === -1) {
        throw new Error(`The ${TRAIN_CONFIG_FILE_NAME} does not exist in the compressed result file.`);
    }

    const resultIndex = files.findIndex(file => file.path === TRAIN_RESULT_FILE_NAME);
    if(resultIndex === -1) {
        throw new Error(`The ${TRAIN_RESULT_FILE_NAME} does not exist in the compressed result file.`);
    }

    let config : TrainConfig;

    try {
        config = JSON.parse(files[configIndex].content);
    } catch (e) {
        throw new Error(`The ${TRAIN_CONFIG_FILE_NAME} could not be parsed.`);
    }

    const symBuff =  Buffer.from(config.user_encrypted_sym_key, 'hex');

    let symmetricKey : string;

    try {
        const content = crypto.privateDecrypt({
            key: context.privateKey,
            passphrase: context.passphrase,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha512",
            oaepLabel: undefined
        }, symBuff);

        symmetricKey = content.toString('utf-8')
    } catch (e) {
        throw new Error('The symmetric key could not be decrypted using the private key.');
    }

    try {
        const secret = new fernet.Secret(symmetricKey);

        const token = new fernet.Token({
            secret,
            token: files[resultIndex].content,
            ttl: 0
        })

        return token.decode();
    } catch (e) {
        throw new Error('The result file could not be decrypted with the decrypted symmetric key.');
    }
}

export async function decompressTarFile(filePath: string) : Promise<TarFile[]> {
    return new Promise(((resolve, reject) => {
        const files : TarFile[] = [];

        return tar.t({
            file: filePath,
            onentry(entry: FileStat) {
                let data : Buffer[] = [];

                if(entry.type.toString() !== 'File') {
                    return;
                }

                entry.on('data', (c: Buffer) => data.push(c));
                entry.on('end', () => {
                    files.push({
                        path: entry.path.toString(),
                        content: Buffer.concat(data).toString('utf-8')
                    });
                });
            }
        }, [], (err) => {
            if(err) reject(err);

            resolve(files);
        })
    }))
}

export async function saveExtractedTrainResult(filePath: string, files: any) {


}
