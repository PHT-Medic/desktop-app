/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    Menu, Tray, app, nativeImage,
} from 'electron';
import * as path from 'path';

let tray;

export function buildContextMenu() {
    const imagePath : string = path.join(__dirname, '..', 'assets', 'icons', '512x512.png');
    const image = nativeImage.createFromPath(imagePath);
    tray = new Tray(image);
    tray.setTitle('PHT: Desktop-App');

    const ctxMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click() {
                app.quit();
            },
        },
    ]);

    tray.setContextMenu(ctxMenu);
}
