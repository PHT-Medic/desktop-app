import { serve } from 'vitron/main';
import {
    BrowserWindow, app,
} from 'electron';
import path from 'node:path';
import { registerListeners } from './listeners';
import { buildContextMenu } from './utils/context-menu';

app.on('window-all-closed', () => {
    // On mac-os it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

let mainWindow : BrowserWindow;

(async () => {
    await app.whenReady();

    mainWindow = new BrowserWindow({
        height: 768,
        width: 1024,
        autoHideMenuBar: true,
        title: 'PHT - DesktopApp',
        webPreferences: {
            preload: path.join(`${__dirname}/../preload/index.js`),
            devTools: true,
            sandbox: false,
        },
    });

    await serve(mainWindow, {
        directory: path.join(`${__dirname}/../renderer/`),
        port: process.env.PORT,
    });

    registerListeners(mainWindow);
})();

app.on('ready', () => {
    buildContextMenu();
});
app.on('window-all-closed', () => {
    app.quit();
});
