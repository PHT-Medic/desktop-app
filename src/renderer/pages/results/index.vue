<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import { LayoutKey, LayoutNavigationID } from '../../config/layout/contants';
import TrainResultSelector from '../../components/domains/train-result/TrainResultSelector';
import TrainResultList from '../../components/domains/train-result/TrainResultList';

export default {
    components: { TrainResultList, TrainResultSelector },
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
        query() {
            return this.$store.getters['auth/loggedIn'] ?
                {
                    filter: {
                        user_id: this.$store.getters['auth/userId'],
                    },
                    sort: {
                        created_at: 'DESC',
                    },
                } : {};
        },
    },
    watch: {
        async loggedIn(val, oldVal) {
            if (val === oldVal) {
                return;
            }
            if (
                this.$refs.list
            ) {
                if (!val) {
                    await this.$refs.list.clear();
                }
            }
        },
    },
};
</script>
<template>
    <div class="container">
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

        <train-result-selector />

        <div v-if="loggedIn">
            <train-result-list
                ref="list"
                :query="query"
            />
        </div>
    </div>
</template>
