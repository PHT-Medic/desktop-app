import {app, BrowserWindow, ipcMain, dialog, clipboard, shell} from 'electron';
import {registerRenderedFiles} from 'electron-adapter';

import {watchFile} from "fs";
import * as path from "path";
import {buildContextMenu} from "./utils/context-menu";

app.on('window-all-closed', () => {
    // On mac-os it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

const isProd: boolean = process.env.NODE_ENV === 'production';

if (!isProd) {
    watchFile(__filename, () => {
        app.exit(0);
    });
}

let mainWindow : BrowserWindow;

(async () => {
    if(isProd) {
        registerRenderedFiles({directory: 'entrypoint/dist'});
    }

    await app.whenReady();

    mainWindow = new BrowserWindow({
        height: 768,
        width: 1024,
        autoHideMenuBar: true,
        title: 'PHT - LocalTool',
        webPreferences: {
            devTools: !app.isPackaged,
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    if (isProd) {
        await mainWindow.loadURL(`app://-`);
    } else {
        const port = process.env.ELECTRON_MAIN_PORT || 9000;
        await mainWindow.loadURL(`http://localhost:${port}`);
    }

    ipcMain.on('dir-select', async (event) => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
        });

        event.reply('dir-selected', result);
    });

    ipcMain.on('result-file-select', async (event) => {
        const result = await dialog.showOpenDialog(mainWindow, {
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

    ipcMain.on('dir-open', async (event, arg) => {
        await shell.openPath(arg);
    });
})();

app.on('ready', () => {
    buildContextMenu();
})
app.on('window-all-closed', () => {
    app.quit();
});
