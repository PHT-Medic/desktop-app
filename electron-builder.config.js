/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

module.exports = {
    productName: 'PHT - LocalTool',
    appId: 'de.personalhealthtrain.app',
    // eslint-disable-next-line no-template-curly-in-string
    artifactName: 'setup-${version}.${ext}',
    directories: {
        output: 'dist',
        buildResources: 'resources'
    },
    extraMetadata: {
        main: ".electron-adapter/index.js"
    },
    // default files: https://www.electron.build/configuration/contents
    files: {
        from: '.',
        filter: [
            'package.json',
            '.electron-adapter/**/*'
        ]
    },
    win: {
        icon: `assets/icons/win-icon.ico`,
        publisherName: 'tada5hi',
        target: 'nsis',
    },
    nsis: {
        differentialPackage: true,
    },
    linux: {
        icon: 'assets/icons/',
        target: 'deb',
    },
    mac: {
        target: 'dmg',
        icon: `assets/icons/con.icns`,
    },
    dmg: {
        contents: [
            {
                x: 410,
                y: 150,
                type: 'link',
                path: '/Applications',
            },
            {
                x: 130,
                y: 150,
                type: 'file',
            },
        ],
    },
};
