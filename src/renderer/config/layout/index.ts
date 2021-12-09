/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationComponentConfig } from 'vue-layout-navigation';
import { LayoutKey, LayoutNavigationID } from './contants';

export const LayoutTopNavigation : NavigationComponentConfig[] = [
    {
        id: LayoutNavigationID.DEFAULT,
        name: 'Home',
        icon: 'fa fa-home',
    },
];

export const LayoutSideDefaultNavigation : NavigationComponentConfig[] = [
    {
        name: 'Info',
        type: 'link',
        url: '/',
        icon: 'fas fa-info',
        rootLink: true,
    },
    {
        name: 'Result(s)',
        type: 'link',
        url: '/results',
        icon: 'fas fa-file-download',
    },
    {
        name: 'Paillier Number',
        type: 'link',
        url: '/paillier-number',
        icon: 'fa fa-key',
    },
    {
        name: 'Settings',
        type: 'link',
        url: '/settings',
        icon: 'fas fa-cog',
    },
];
