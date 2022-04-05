/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component } from '@vue-layout/navigation';

export enum LayoutKey {
    NAVIGATION_ID = 'navigationId',
    REQUIRED_LOGGED_IN = 'requireLoggedIn',
    REQUIRED_LOGGED_OUT = 'requireLoggedOut',

    REQUIRED_PERMISSIONS = 'requirePermissions',
    REQUIRED_ABILITIES = 'requireAbilities',
}

export enum LayoutNavigationID {
    ADMIN = 'admin',
    DEFAULT = 'default',
}

export const LayoutTopNavigation : Component[] = [
    {
        id: LayoutNavigationID.DEFAULT,
        name: 'Home',
        icon: 'fa fa-home',
    },
];

export const LayoutSideDefaultNavigation : Component[] = [
    {
        name: 'About',
        type: 'link',
        url: '/',
        icon: 'fas fa-info',
        rootLink: true,
    },
    {
        name: 'Signature',
        type: 'link',
        url: '/sign',
        icon: 'fas fa-file-signature',
    },
    {
        name: 'Result(s)',
        type: 'link',
        url: '/results',
        icon: 'fas fa-file-download',
    },
    {
        name: 'Settings',
        type: 'link',
        url: '/settings',
        icon: 'fas fa-cog',
    },
];
