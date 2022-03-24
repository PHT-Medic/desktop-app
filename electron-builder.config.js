/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

module.exports = {
    productName: 'PHT: Desktop-App',
    appId: 'de.personalhealthtrain.app-desktop',
    // eslint-disable-next-line no-template-curly-in-string
    artifactName: 'pht-desktop-app-${version}.${ext}',
    directories: {
        output: 'dist',
        buildResources: 'resources'
    },
    extraMetadata: {
        main: "src/entrypoint/dist/index.js"
    },
    // default files: https://www.electron.build/configuration/contents
    files: {
        from: '.',
        filter: [
            'assets',
            'package.json',
            'src/entrypoint/dist/**/*'
        ]
    },
    win: {
        icon: `assets/icons/icon.ico`,
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
        icon: `assets/icons/512x512.png`,
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
        sign: false
    },
};
