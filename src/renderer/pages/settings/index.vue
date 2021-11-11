<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<template>
    <div>
        <h1 class="title no-border mb-3">Settings <span class="sub-title">manage your settings</span> </h1>

        <nuxt-child />
    </div>
</template>
<script>
import {Layout, LayoutNavigationID} from "../../modules/layout/contants";

export default {
        meta: {
            [Layout.REQUIRED_LOGGED_IN_KEY]: true,
            [Layout.NAVIGATION_ID_KEY]: LayoutNavigationID.DEFAULT
        },
        data () {
            return {
                sidebar: {
                    items: [
                        { name: 'General', routeName: 'settings-id', icon: 'fas fa-bars', urlSuffix: '' }
                    ]
                }
            }
        },
    }
</script>
