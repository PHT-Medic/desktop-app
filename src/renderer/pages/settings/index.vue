<!--
  - Copyright (c) 2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<template>
    <div>
        <h1 class="title no-border mb-3">
            <i class="fa fa-cog" /> Settings <span class="sub-title">Management</span>
        </h1>

        <b-nav
            pills
        >
            <template
                v-for="(item,key) in sidebar.items"
            >
                <template v-if="item.items">
                    <b-nav-item-dropdown
                        :key="key"
                        split
                        split-variant="outline-primary"
                        :disabled="item.active"
                        toggle-class="nav-link-custom"
                        right
                    >
                        <template slot="button-content">
                            <i :class="item.icon" />
                            {{ item.name }}
                        </template>

                        <b-dropdown-item
                            v-for="(sub, subKey) in item.items"
                            :key="subKey"
                            :to="'/settings' + item.urlSuffix + sub.urlSuffix"
                        >
                            {{ sub.name }}
                        </b-dropdown-item>
                    </b-nav-item-dropdown>
                </template>
                <template v-else>
                    <b-nav-item
                        :key="key"
                        :disabled="item.active"
                        :to="'/settings' + item.urlSuffix"
                        exact
                        exact-active-class="active"
                    >
                        <i :class="item.icon" />
                        {{ item.name }}
                    </b-nav-item>
                </template>
            </template>
        </b-nav>

        <hr>

        <nuxt-child />
    </div>
</template>
<script>
import { LayoutKey, LayoutNavigationID } from '../../config/layout/contants';

export default {
    meta: {
        [LayoutKey.NAVIGATION_ID]: LayoutNavigationID.DEFAULT,
    },
    data() {
        return {
            sidebar: {
                items: [
                    {
                        name: 'Overview', icon: 'fas fa-bars', urlSuffix: '',
                    },
                    {
                        name: 'Signature', icon: 'fas fa-file-alt', urlSuffix: '/signature',
                    },
                    {
                        name: 'Encryption',
                        icon: 'fa fa-lock',
                        urlSuffix: '/encryption',
                        items: [
                            {
                                name: 'RSA', icon: 'fa fa-key', urlSuffix: '/',
                            },
                            {
                                name: 'Homomorphic', icon: 'fa fa-key', urlSuffix: '/homomorphic',
                            },
                        ],
                    },
                ],
            },
        };
    },
};
</script>
