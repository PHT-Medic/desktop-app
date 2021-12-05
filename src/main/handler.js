/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import BrowserWinHandler from "./module";
import {app, clipboard, dialog, ipcMain} from "electron";

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

export default winHandler;
