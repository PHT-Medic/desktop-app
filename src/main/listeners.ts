/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { BrowserWindow } from 'electron';
import {
    clipboard, dialog, ipcMain, shell,
} from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { resguard } from 'resguard';
import { generateRandomKeys } from 'paillier-bigint';
import { IPCChannel } from './constants';
import { decryptRSAPrivateKey, generateRSAKeyPair, sign } from './core';
import { readTrainResult } from './domains/train-result';

export function registerListeners(mainWindow: BrowserWindow) {
    ipcMain.handle(
        IPCChannel.CRYPTO_SIGN,
        async (event, input, privateKey) => sign(input, privateKey),
    );
    ipcMain.handle(
        IPCChannel.CRYPTO_HE_GENERATE,
        async () => {
            const {
                publicKey,
                privateKey,
            } = await generateRandomKeys(128);

            return {
                publicKey: JSON.stringify({
                    n: publicKey.n.toString(),
                    g: publicKey.g.toString(),
                }),
                privateKey: JSON.stringify({
                    mu: privateKey.mu.toString(),
                    lambda: privateKey.lambda.toString(),
                }),
            };
        },
    );

    ipcMain.handle(
        IPCChannel.CRYPTO_RSA_GENERATE,
        async (event, passphrase) => generateRSAKeyPair(passphrase),
    );
    ipcMain.handle(
        IPCChannel.CRYPTO_RSA_KEY_DECRYPT,
        async (event, key, passphrase) => {
            try {
                return decryptRSAPrivateKey(key, passphrase);
            } catch (e) {
                return undefined;
            }
        },
    );
    // ---------------------------------------------------------------------------------------

    ipcMain.handle(
        IPCChannel.FS_READ_FILE,
        async (event, filePath) => {
            try {
                await fs.promises.access(filePath, fs.constants.F_OK);

                return await fs.promises.readFile(filePath, { encoding: 'utf-8' });
            } catch (e) {
                return undefined;
            }
        },
    );

    ipcMain.handle(
        IPCChannel.FS_WRITE_FILE,
        async (event, filePath, content) => {
            try {
                return await fs.promises.writeFile(filePath, content, { encoding: 'utf-8' });
            } catch (e) {
                return undefined;
            }
        },
    );

    ipcMain.handle(
        IPCChannel.FS_MKDIR,
        async (event, input) => {
            try {
                await fs.promises.access(input);
            } catch (e) {
                await fs.promises.mkdir(input, { recursive: true });
            }
        },
    );

    // ---------------------------------------------------------------------------------------

    ipcMain.on(
        IPCChannel.COPY_TO_CLIPBOARD,
        async (event, arg) => {
            clipboard.writeText(arg);
        },
    );

    // ---------------------------------------------------------------------------------------

    ipcMain.handle(
        IPCChannel.DIR_SELECT,
        async () => dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
        }),
    );

    ipcMain.on(
        IPCChannel.DIR_OPEN,
        async (event, arg) => {
            arg = arg.replaceAll('/', path.sep);
            await shell.openPath(arg);
        },
    );

    // ---------------------------------------------------------------------------------------

    ipcMain.handle(
        IPCChannel.RESULT_FILE_SELECT,
        async () => dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [
                { name: 'PHT-Result', extensions: ['tar'] },
            ],
        }),
    );

    ipcMain.handle(
        IPCChannel.RESULT_READ,
        async (event, context) => resguard(readTrainResult(context)),
    );
}
