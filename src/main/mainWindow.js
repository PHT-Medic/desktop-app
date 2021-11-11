/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ipcMain, dialog} from 'electron';
import BrowserWinHandler from './BrowserWinHandler'

const winHandler = new BrowserWinHandler({
    height: 700,
    width: 1000
})

winHandler.onCreated(_browserWindow => {
    winHandler.loadPage('/').then(r => r);

    ipcMain.on('select-dirs', async (event, arg) => {
        const result = await dialog.showOpenDialog(_browserWindow, {
            properties: ['openDirectory']
        });

        event.reply('select-dirs-result', result);
    });

    ipcMain.on('select-files', async (event, arg) => {
        const result = await dialog.showOpenDialog(_browserWindow, {
            properties: ['openFile', 'multiSelections']
        });

        event.reply('select-files-result', result);
    });
});

export default winHandler
