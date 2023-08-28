/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BDropdown, BDropdownItem, BToastPlugin } from 'bootstrap-vue-next';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((ctx) => {
    ctx.vueApp.use(BToastPlugin);
    ctx.vueApp.component('BDropdown', BDropdown);
    ctx.vueApp.component('BDropdownItem', BDropdownItem);
});
