<!--
  - Copyright (c) 2021-2021.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script>
export default {
    computed: {
        loggedIn(vm) {
            return vm.$store.getters['auth/loggedIn'];
        },
        user(vm) {
            return vm.$store.state.auth.user;
        },
    },
};
</script>
<template>
    <div>
        <header class="page-header fixed-top">
            <div class="header-title ml-3">
                <div class="logo">
                    <span>P</span>H<span>T</span>
                    <span class="info-text">LocalTool</span>
                </div>
            </div>
            <nav class="page-navbar navbar-expand-md">
                <b-collapse
                    id="page-navbar"
                    class="navbar-content navbar-collapse"
                >
                    <navigation-components
                        class="navbar-nav"
                        :tier="0"
                    />
                </b-collapse>
            </nav>
        </header>
    </div>
</template>
