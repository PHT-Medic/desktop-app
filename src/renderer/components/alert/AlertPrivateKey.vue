<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useSecretStore } from '../../store/secret';

export default defineComponent({
    setup() {
        const store = useSecretStore();
        const storeRefs = storeToRefs(store);

        return {
            privateKey: storeRefs.rsaPrivateKey,
        };
    },
});
</script>
<template>
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
</template>
