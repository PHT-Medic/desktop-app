/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    app, clipboard, dialog, ipcMain,
} from 'electron';
import BrowserWinHandler from './module';

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

const winHandler = new BrowserWinHandler({
    height: 768,
    width: 1024,
    autoHideMenuBar: true,
    title: 'PHT - Local Tool',
    webPreferences: {
        devTools: !app.isPackaged,
    },
});

winHandler.onCreated((_browserWindow) => {
    if (process.env.NODE_ENV !== 'development') {
        _browserWindow.setMenu(null);
    }

    winHandler.loadPage('/')
        .then((r) => r);

    ipcMain.on('dir-select', async (event) => {
        const result = await dialog.showOpenDialog(_browserWindow, {
            properties: ['openDirectory'],
        });

        event.reply('dir-selected', result);
    });

    ipcMain.on('result-file-select', async (event) => {
        const result = await dialog.showOpenDialog(_browserWindow, {
            properties: ['openFile'],
            filters: [
                { name: 'PHT-Result', extensions: ['tar'] },
            ],
        });

        event.reply('result-file-selected', result);
    });

    ipcMain.on('copy-to-clipboard', async (event, arg) => {
        clipboard.writeText(arg);
    });
});
