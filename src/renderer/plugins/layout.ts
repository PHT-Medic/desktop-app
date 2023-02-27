/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue from 'vue';
import NavigationComponents, { setProvider } from '@vue-layout/navigation';
import type { Context } from '@nuxt/types';
import { NavigationProvider } from '../config/layout';

Vue.use(NavigationComponents);

export default async (ctx: Context) => {
    const navigationProvider = new NavigationProvider(ctx);

    setProvider(navigationProvider);
};
