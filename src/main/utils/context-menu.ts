/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {app, Menu, Tray, nativeImage} from 'electron';
import * as path from "path";

let tray;

export function buildContextMenu() {
    const image = nativeImage.createFromPath(path.join(__dirname, '..', 'assets', 'icons', '512x512.png'));
    tray = new Tray(image);
    tray.setTitle('PHT: Desktop-App');

    const ctxMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click: function (item) {
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(ctxMenu);
}
