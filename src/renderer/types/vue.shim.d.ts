/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { HTTPClient } from '@personalhealthtrain/central-common';
import { HTTPClient as AuthHTTPClient } from '@authelion/common';
import {Store} from "vuex";
import {SocketModule} from "../config/socket";
import AuthModule from "../config/auth";
import {Ilingo} from "ilingo";
import Vue from "vue";

declare module '*.vue' {
    import Vue from 'vue';

    export default Vue;
}

declare module '*.svg' {
    import Vue from 'vue';

    export default Vue;
}

declare module 'vue/types/vue' {
    // Global properties can be declared
    // on the `VueConstructor` interface
    interface VueConstructor {
        $api: HTTPClient,
        $authApi: AuthHTTPClient,

        $auth: AuthModule,
        $ilingo: Ilingo,

        $store: Store<any>
    }

    interface Vue {
        $api: HTTPClient,
        $authApi: AuthHTTPClient,

        $auth: AuthModule,
        $ilingo: Ilingo,

        $store: Store<any>
    }
}
