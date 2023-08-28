<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { defineNuxtComponent } from '#app';
import KeyPairPicker from '../../../../components/key/KeyPairPicker.vue';

export default defineNuxtComponent({
    components: {
        KeyPairPicker,
    },
});
</script>
<template>
    <KeyPairPicker :variant="'homomorphic-encryption'" />
</template>
