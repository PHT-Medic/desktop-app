<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import { storeToRefs } from 'pinia';
import { LayoutKey, LayoutNavigationID } from '~/config/layout';
import { defineNuxtComponent, definePageMeta } from '#imports';
import { useSecretStore } from '~/store/secret';
import { useAuthStore } from '~/store/auth';
import TrainResultSelector from '~/components/domains/train-result/TrainResultSelector.vue';

export default defineNuxtComponent({
    components: { TrainResultSelector },
    async setup() {
        definePageMeta({
            [LayoutKey.NAVIGATION_ID]: LayoutNavigationID.DEFAULT,
        });

        const secretStore = useSecretStore();
        const secretRefs = storeToRefs(secretStore);

        const authStore = useAuthStore();
        const authRefs = storeToRefs(authStore);

        return {
            loggedIn: authRefs.loggedIn,
            privateKey: secretRefs.defaultPrivateKey,
        };
    },
});
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

        <TrainResultSelector />
    </div>
</template>
