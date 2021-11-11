<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
    import AlertMessage from "../../../components/alert/AlertMessage";
    import RsaSettings from "../../../components/RsaSettings";

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
            RsaSettings,
            AlertMessage
        }
    }
</script>
<template>
    <div>
        <div class="row">
            <div class="col-12">
                <h6 class="title">
                    General
                </h6>

                <hr />

                <rsa-settings />
            </div>
            <div class="col-6">

            </div>
        </div>
    </div>
</template>
