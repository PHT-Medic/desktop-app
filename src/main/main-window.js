/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ipcMain, dialog} from 'electron';
import BrowserWinHandler from './browser-win-handler'

const winHandler = new BrowserWinHandler({
    height: 768,
    width: 1024
})

winHandler.onCreated(_browserWindow => {
    if(process.env.NODE_ENV !== 'development') {
        _browserWindow.setMenu(null);
    }

    winHandler.loadPage('/')
        .then(r => r);

    ipcMain.on('select-dirs', async (event, arg) => {
        const result = await dialog.showOpenDialog(_browserWindow, {
            properties: ['openDirectory']
        });

        event.reply('select-dirs-result', result);
    });

    ipcMain.on('result-file-select', async (event, arg) => {
        const result = await dialog.showOpenDialog(_browserWindow, {
            properties: ['openFile'],
            filters: [
                {name: 'PHT-Result', extensions: ['tar']}
            ]
        });

        event.reply('result-file-selected', result);
    });
});

export default winHandler
