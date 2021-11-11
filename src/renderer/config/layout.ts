/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {LayoutNavigationComponent, LayoutSidebarComponent} from "../modules/layout/types";
import {Layout, LayoutNavigationID} from "../modules/layout/contants";

export const LayoutNavigation : LayoutNavigationComponent[] = [
    {
        id: LayoutNavigationID.DEFAULT,
        name: 'Home',
        icon: 'fa fa-home',
    }
];

type LayoutSidebarGroup = {
    [K in LayoutNavigationID]: LayoutSidebarComponent[]
}

export const LayoutSidebars : LayoutSidebarGroup = {
    default: [
        {
            name: 'Info',
            type: 'link',
            url: '/',
            icon: 'fas fa-info',
            rootLink: true
        },
        {
            name: 'Decode',
            type: 'link',
            url: '/decode',
            icon: 'fas fa-file'
        },
        {
            name: 'Hash',
            type: 'link',
            url: '/hash',
            icon: 'fas fa-hashtag'
        },
        {
            name: 'Settings',
            type: 'link',
            url: '/settings',
            icon: 'fas fa-cog'
        }
    ]

};
