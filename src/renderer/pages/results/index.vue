<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

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
                        name: 'Upload', icon: 'fas fa-file-upload', urlSuffix: '/',
                    },
                    {
                        name: 'Overview', icon: 'fas fa-bars', urlSuffix: '/list', requireLoggedIn: true,
                    },
                ],
            },
        };
    },
    computed: {
        loggedIn() {
            return this.$store.getters['auth/loggedIn'];
        },
        privateKey() {
            return this.$store.getters['secret/defaultPrivateKey'];
        },
    },
    watch: {
        async loggedIN(val, oldVal) {
            if (val === oldVal) {
                return;
            }

            if (
                !val &&
                this.$nuxt.$route.fullPath === '/results/list'
            ) {
                await this.$nuxt.$router.push('/results');
            }
        },
    },
};
</script>
<template>
    <div>
        <h1 class="title no-border mb-2">
            <i class="fas fa-file-download" /> Result(s)
        </h1>

        <hr>

        <div
            v-if="!privateKey"
            class="alert alert-danger alert-sm"
        >
            You first have to load your private and public key or generate them...<br>
            <nuxt-link
                type="button"
                class="btn btn-dark btn-xs"
                :to="'/settings/encryption'"
            >
                <i class="fa fa-cog" /> Settings
            </nuxt-link>
        </div>

        <div class="content-wrapper">
            <div class="content-sidebar flex-column">
                <b-nav
                    pills
                    vertical
                >
                    <template v-for="(item,key) in sidebar.items">
                        <b-nav-item
                            v-if="(item.requireLoggedIn && loggedIn) || !item.requireLoggedIn"
                            :key="key"
                            :disabled="item.active"
                            :to="'/results' + item.urlSuffix"
                            exact
                            exact-active-class="active"
                        >
                            <i :class="item.icon" />
                            {{ item.name }}
                        </b-nav-item>
                    </template>
                </b-nav>
            </div>
            <div class="content-container">
                <nuxt-child />
            </div>
        </div>
    </div>
</template>
