/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { injectAuthupStore } from '@personalhealthtrain/client-vue';
import { storeToRefs } from 'pinia';
import type { ComputedRef } from 'vue';

export function useLoggedIn() : ComputedRef<boolean> {
    const store = injectAuthupStore();
    const refs = storeToRefs(store);

    return refs.loggedIn;
}
