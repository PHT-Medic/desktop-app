<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<template>
    <div>
        <div class="m-b-20 m-t-10">
            <div class="panel-card">
                <div class="panel-card-body">
                    <div class="flex-wrap flex-row d-flex">
                        <div>
                            <b-nav pills>
                                <b-nav-item
                                    :to="'/admin/realms'"
                                    exact
                                    exact-active-class="active"
                                >
                                    <i class="fa fa-arrow-left" />
                                </b-nav-item>

                                <b-nav-item
                                    v-for="(item,key) in sidebar.items"
                                    :key="key"
                                    :disabled="item.active"
                                    :to="'/settings' + item.urlSuffix"
                                    exact
                                    exact-active-class="active"
                                >
                                    <i :class="item.icon" />
                                    {{ item.name }}
                                </b-nav-item>
                            </b-nav>
                        </div>
                    </div>

                </div>
            </div>
        </div>

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
                        { name: 'Default', icon: 'fas fa-bars', urlSuffix: '' },
                        { name: 'Homomorphic Encryption',  icon: 'fas fa-key', urlSuffix: '/homomorphic-encryption' }
                    ]
                }
            }
        },
    }
</script>
