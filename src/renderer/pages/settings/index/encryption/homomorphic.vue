<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
import AlertMessage from '../../../../components/alert/AlertMessage';
import KeyPairPicker from '../../../../components/key/KeyPairPicker';

export default {
    components: {
        KeyPairPicker,
    },
    computed: {
        user() {
            return this.$store.getters['auth/user'];
        },
    },
};
</script>
<template>
    <div>
        <h6>
            Homomorphic Encryption
        </h6>
        <key-pair-picker :variant="'homomorphic-encryption'" />
    </div>
</template>
