<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
    import AlertMessage from "../../../components/alert/AlertMessage";
    import KeyPairPicker from "../../../components/KeyPairPicker";

    export default {
        meta: {
            requireLoggedIn: true
        },
        computed: {
            user() {
                return this.$store.getters['auth/user'];
            }
        },
        components: {
            KeyPairPicker,
            AlertMessage
        }
    }
</script>
<template>
    <div>
        <h6 class="title">
            Default
        </h6>

        <hr />

        <key-pair-picker :type="'default'" />
    </div>
</template>
